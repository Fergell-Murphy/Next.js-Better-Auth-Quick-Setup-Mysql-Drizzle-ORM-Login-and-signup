import Link from "next/link";
import { CopyCode } from "./components/CopyCode";

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto max-w-3xl px-6 py-4">
          <Link
            href="/"
            className="text-sm font-medium text-zinc-600 hover:text-zinc-900 "
          >
            ← Back
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="mb-2 text-3xl font-bold text-zinc-900">
          Complete Setup Guide: Better Auth with Next.js, Drizzle & MySQL
        </h1>
        <p className="mb-12 text-zinc-600 dark:text-zinc-400">
          Step-by-step guide to building authentication from scratch using{" "}
          <a
            href="https://www.better-auth.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            Better Auth
          </a>
          , Next.js,{" "}
          <a
            href="https://orm.drizzle.team/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            Drizzle ORM
          </a>
          , and MySQL.
        </p>

        <nav className="mb-12 rounded-lg border border-zinc-200 bg-white p-4">
          <h2 className="mb-3 font-semibold text-zinc-900 dark:text-zinc-50">
            Table of Contents
          </h2>
          <ol className="list-inside list-decimal space-y-1 text-sm text-zinc-600">
            {[
              "Prerequisites",
              "Create the Project",
              "Install Dependencies",
              "Database Setup",
              "Drizzle Schema",
              "Database Connection",
              "Server Auth Configuration",
              "Auth API Route",
              "Client Auth Configuration",
              "Auth Pages (Login, Sign Up)",
              "Home Page with Session",
              "Protected Dashboard",
              "Route Protection Proxy",
              "Environment Variables",
              "Apply Migrations",
              "Architecture Overview",
            ].map((item, i) => (
              <li key={item}>
                <a
                  href={`#section-${i + 1}`}
                  className="hover:text-zinc-900 hover:underline"
                >
                  {item}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="space-y-16">
          {/* 1. Prerequisites */}
          <section id="section-1">
            <h2 className="mb-4 text-2xl font-bold text-zinc-900">
              1. Prerequisites
            </h2>
            <p className="mb-4 text-zinc-600">
              Before starting, ensure you have Node.js 18+, MySQL, and
              npm/yarn/pnpm. Create a MySQL database.
            </p>
          </section>

          {/* 2. Create Project */}
          <section id="section-2">
            <h2 className="mb-4 text-2xl font-bold text-zinc-900">
              2. Create the Project
            </h2>
            <p className="mb-4 text-zinc-600">
              Create a new Next.js app with the App Router:
            </p>
            <CopyCode
              code="npx create-next-app@latest auth-better --typescript --tailwind --app --no-src-dir"
              language="bash"
            />
          </section>

          {/* 3. Install Dependencies */}
          <section id="section-3">
            <h2 className="mb-4 text-2xl font-bold text-zinc-900">
              3. Install Dependencies
            </h2>
            <CopyCode
              code={`npm install better-auth drizzle-orm mysql2 dotenv
npm install -D drizzle-kit @better-auth/cli`}
              language="bash"
            />
          </section>

          {/* 4. Database Setup */}
          <section id="section-4">
            <h2 className="mb-4 text-2xl font-bold text-zinc-900">
              4. Database Setup
            </h2>
            <h3 className="mb-2 font-semibold text-zinc-900">
              Create <code className="rounded bg-zinc-200 px-1">.env</code>
            </h3>
            <CopyCode
              code="DATABASE_URL=mysql://user:password@localhost:3306/auth_better"
              language="env"
            />
            <h3 className="mb-2 mt-6 font-semibold text-zinc-900">
              Create{" "}
              <code className="rounded bg-zinc-200 px-1">.env.example</code>
            </h3>
            <CopyCode
              code={`# Database connection (required)
DATABASE_URL=mysql://user:password@localhost:3306/auth_better

# App URL for auth callbacks (optional)
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Auth secret (required in production): openssl rand -base64 32
BETTER_AUTH_SECRET=your-32-character-or-longer-secret`}
              language="env"
            />
          </section>

          {/* 5. Drizzle Schema */}
          <section id="section-5">
            <h2 className="mb-4 text-2xl font-bold text-zinc-900">
              5. Drizzle Schema
            </h2>
            <p className="mb-4 text-zinc-600">
              Create{" "}
              <code className="rounded bg-zinc-200 px-1">db/schema.ts</code>{" "}
              with user, session, account, and verification tables:
            </p>
            <CopyCode
              code={`import {
  boolean,
  datetime,
  mysqlTable,
  text,
  varchar,
} from "drizzle-orm/mysql-core";

export const user = mysqlTable("user", {
  id: varchar("id", { length: 255 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  emailVerified: boolean("emailVerified").notNull().default(false),
  image: varchar("image", { length: 512 }),
  createdAt: datetime("createdAt").notNull(),
  updatedAt: datetime("updatedAt").notNull(),
});

export const session = mysqlTable("session", {
  id: varchar("id", { length: 255 }).primaryKey(),
  userId: varchar("userId", { length: 255 })
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  token: varchar("token", { length: 255 }).notNull().unique(),
  expiresAt: datetime("expiresAt").notNull(),
  ipAddress: varchar("ipAddress", { length: 255 }),
  userAgent: text("userAgent"),
  createdAt: datetime("createdAt").notNull(),
  updatedAt: datetime("updatedAt").notNull(),
});

export const account = mysqlTable("account", {
  id: varchar("id", { length: 255 }).primaryKey(),
  userId: varchar("userId", { length: 255 })
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accountId: varchar("accountId", { length: 255 }).notNull(),
  providerId: varchar("providerId", { length: 255 }).notNull(),
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  idToken: text("idToken"),
  accessTokenExpiresAt: datetime("accessTokenExpiresAt"),
  refreshTokenExpiresAt: datetime("refreshTokenExpiresAt"),
  scope: varchar("scope", { length: 255 }),
  password: varchar("password", { length: 255 }),
  createdAt: datetime("createdAt").notNull(),
  updatedAt: datetime("updatedAt").notNull(),
});

export const verification = mysqlTable("verification", {
  id: varchar("id", { length: 255 }).primaryKey(),
  identifier: varchar("identifier", { length: 255 }).notNull(),
  value: varchar("value", { length: 255 }).notNull(),
  expiresAt: datetime("expiresAt").notNull(),
  createdAt: datetime("createdAt").notNull(),
  updatedAt: datetime("updatedAt").notNull(),
});`}
              language="typescript"
            />
          </section>

          {/* 6. Database Connection */}
          <section id="section-6">
            <h2 className="mb-4 text-2xl font-bold text-zinc-900">
              6. Database Connection
            </h2>
            <p className="mb-4 text-zinc-600 dark:text-zinc-400">
              Create{" "}
              <code className="rounded bg-zinc-200 px-1">db/index.ts</code> with
              a connection pool:
            </p>
            <CopyCode
              code={`import "dotenv/config";
import mysql from "mysql2/promise";
import { drizzle } from "drizzle-orm/mysql2";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined");
}

const pool = mysql.createPool(process.env.DATABASE_URL);

export const db = drizzle(pool);`}
              language="typescript"
            />
          </section>

          {/* 7. Server Auth */}
          <section id="section-7">
            <h2 className="mb-4 text-2xl font-bold text-zinc-900">
              7. Server Auth Configuration
            </h2>
            <p className="mb-4 text-zinc-600">
              Create <code className="rounded bg-zinc-200 px-1">auth.ts</code>{" "}
              in the project root:
            </p>
            <CopyCode
              code={`import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import * as schema from "@/db/schema";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "mysql",
    schema: {
      user: schema.user,
      session: schema.session,
      account: schema.account,
      verification: schema.verification,
    },
  }),
  emailAndPassword: {
    enabled: true,
  },
});`}
              language="typescript"
            />
          </section>

          {/* 8. Auth API Route */}
          <section id="section-8">
            <h2 className="mb-4 text-2xl font-bold text-zinc-900">
              8. Auth API Route
            </h2>
            <p className="mb-4 text-zinc-600">
              Create{" "}
              <code className="rounded bg-zinc-200 px-1">
                app/api/auth/[...all]/route.ts
              </code>
              :
            </p>
            <CopyCode
              code={`import { auth } from "@/auth";
import { toNextJsHandler } from "better-auth/next-js";

export const { POST, GET } = toNextJsHandler(auth);`}
              language="typescript"
            />
          </section>

          {/* 9. Client Auth */}
          <section id="section-9">
            <h2 className="mb-4 text-2xl font-bold text-zinc-900">
              9. Client Auth Configuration
            </h2>
            <p className="mb-4 text-zinc-600">
              Create{" "}
              <code className="rounded bg-zinc-200 px-1">auth-client.ts</code>{" "}
              in the project root:
            </p>
            <CopyCode
              code={`import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL,
});`}
              language="typescript"
            />
          </section>

          {/* 10. Auth Pages */}
          <section id="section-10">
            <h2 className="mb-4 text-2xl font-bold text-zinc-900 ">
              10. Auth Pages (Login, Sign Up)
            </h2>
            <h3 className="mb-2 font-semibold text-zinc-900 ">
              Login –{" "}
              <code className="rounded bg-zinc-200 px-1 ">
                app/login/page.tsx
              </code>
            </h3>
            <CopyCode
              code={`"use client";

import { useState } from "react";
import Link from "next/link";
import { authClient } from "@/auth-client";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      const result = await authClient.signIn.email({
        email,
        password,
        callbackURL: "/",
      });
      if (result.error) {
        setError(result.error.message ?? "Sign in failed");
        return;
      }
      router.push("/");
      router.refresh();
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50">
      <div className="w-full max-w-md rounded-lg border border-zinc-200 bg-white p-8 shadow-sm">
        <h1 className="mb-6 text-2xl font-semibold">Sign in</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-800 ">
              {error}
            </div>
          )}
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="w-full rounded-md border border-zinc-300 px-3 py-2"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="w-full rounded-md border border-zinc-300 px-3 py-2 "
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-md bg-zinc-900 px-4 py-2 font-medium text-white disabled:opacity-50 "
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </button>
        </form>
        <p className="mt-4 text-center text-sm">
          Don't have an account?{" "}
          <Link href="/sign-up" className="font-medium underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}`}
              language="typescript"
            />
            <h3 className="mb-2 mt-8 font-semibold text-zinc-900 ">
              Sign Up –{" "}
              <code className="rounded bg-zinc-200 px-1 ">
                app/sign-up/page.tsx
              </code>
            </h3>
            <CopyCode
              code={`"use client";

import { useState } from "react";
import Link from "next/link";
import { authClient } from "@/auth-client";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      const result = await authClient.signUp.email({
        name,
        email,
        password,
        callbackURL: "/",
      });
      if (result.error) {
        setError(result.error.message ?? "Sign up failed");
        return;
      }
      router.push("/");
      router.refresh();
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 ">
      <div className="w-full max-w-md rounded-lg border border-zinc-200 bg-white p-8 shadow-sm ">
        <h1 className="mb-6 text-2xl font-semibold">Create an account</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-800 ">
              {error}
            </div>
          )}
          <div>
            <label htmlFor="name" className="mb-1 block text-sm font-medium">
              Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoComplete="name"
              className="w-full rounded-md border border-zinc-300 px-3 py-2"
            />
          </div>
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="w-full rounded-md border border-zinc-300 px-3 py-2"
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
              minLength={8}
              className="w-full rounded-md border border-zinc-300 px-3 py-2"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-md bg-zinc-900 px-4 py-2 font-medium text-white disabled:opacity-50"
          >
            {isLoading ? "Creating account..." : "Sign up"}
          </button>
        </form>
        <p className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link href="/login" className="font-medium underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}`}
              language="typescript"
            />
          </section>

          {/* 11. Home Page */}
          <section id="section-11">
            <h2 className="mb-4 text-2xl font-bold text-zinc-900">
              11. Home Page with Session
            </h2>
            <p className="mb-4 text-zinc-600">
              Update{" "}
              <code className="rounded bg-zinc-200 px-1">app/page.tsx</code> to
              show session-aware content:
            </p>
            <CopyCode
              code={`"use client";

import Link from "next/link";
import { authClient } from "@/auth-client";

export default function Home() {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <main className="flex w-full max-w-md flex-col items-center gap-6 rounded-lg border p-8">
        {session ? (
          <>
            <h1 className="text-2xl font-semibold">Welcome, ${"{session.user.name}"}</h1>
            <p>You are signed in as ${"{session.user.email}"}</p>
            <div className="flex gap-4">
              <Link href="/dashboard" className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white">
                Dashboard
              </Link>
              <button onClick={() => authClient.signOut()} className="rounded-md border px-4 py-2 text-sm font-medium">
                Sign out
              </button>
            </div>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-semibold">Better Auth</h1>
            <p>Sign in or create an account to get started.</p>
            <div className="flex gap-4">
              <Link href="/login" className="rounded-md bg-zinc-900 px-4 py-2 font-medium text-white">
                Sign in
              </Link>
              <Link href="/sign-up" className="rounded-md border px-4 py-2 font-medium">
                Sign up
              </Link>
            </div>
          </>
        )}
      </main>
    </div>
  );
}`}
              language="typescript"
            />
          </section>

          {/* 12. Dashboard */}
          <section id="section-12">
            <h2 className="mb-4 text-2xl font-bold text-zinc-900">
              12. Protected Dashboard
            </h2>
            <p className="mb-4 text-zinc-600 ">
              Create{" "}
              <code className="rounded bg-zinc-200 px-1 ">
                app/dashboard/page.tsx
              </code>
              :
            </p>
            <CopyCode
              code={`"use client";

import { authClient } from "@/auth-client";
import Link from "next/link";

export default function DashboardPage() {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <main className="flex w-full max-w-md flex-col items-center gap-6 rounded-lg border p-8">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p>Protected content for ${"{session.user.name}"}</p>
        <div className="flex gap-4">
          <Link href="/" className="rounded-md border px-4 py-2 text-sm font-medium">
            Home
          </Link>
          <button onClick={() => authClient.signOut()} className="rounded-md border px-4 py-2 text-sm font-medium">
            Sign out
          </button>
        </div>
      </main>
    </div>
  );
}`}
              language="typescript"
            />
          </section>

          {/* 13. Proxy */}
          <section id="section-13">
            <h2 className="mb-4 text-2xl font-bold text-zinc-900">
              13. Route Protection Proxy
            </h2>
            <p className="mb-4 text-zinc-600">
              Create <code className="rounded bg-zinc-200 px-1">proxy.ts</code>{" "}
              in the project root:
            </p>
            <CopyCode
              code={`import { NextRequest, NextResponse } from "next/server";

const protectedPaths = ["/dashboard"];
const authPaths = ["/login", "/sign-up"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = protectedPaths.some(
    (path) => pathname === path || pathname.startsWith(\`\${path}/\`)
  );
  const isAuthPage = authPaths.some(
    (path) => pathname === path || pathname.startsWith(\`\${path}/\`)
  );

  if (!isProtected && !isAuthPage) {
    return NextResponse.next();
  }

  const response = await fetch(
    new URL("/api/auth/get-session", request.nextUrl.origin),
    {
      headers: {
        cookie: request.headers.get("cookie") ?? "",
      },
    }
  );

  const body = (await response.json()) as {
    data?: { user: { name: string }; session: unknown } | null;
  } | null;
  const session = body?.data ?? null;

  if (isProtected && !session) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackURL", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthPage && session) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/sign-up"],
};`}
              language="typescript"
            />
          </section>

          {/* 14. Drizzle Config */}
          <section id="section-14">
            <h2 className="mb-4 text-2xl font-bold text-zinc-900">
              14. Apply Migrations
            </h2>
            <p className="mb-4 text-zinc-600">
              Create{" "}
              <code className="rounded bg-zinc-200 px-1">
                drizzle.config.ts
              </code>
              :
            </p>
            <CopyCode
              code={`import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle",
  schema: "./db/schema.ts",
  dialect: "mysql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});`}
              language="typescript"
            />
            <p className="mb-2 mt-6 text-zinc-600">
              Generate and run migrations:
            </p>
            <CopyCode
              code={`npx drizzle-kit generate
npx drizzle-kit migrate`}
              language="bash"
            />
          </section>

          {/* 15. Run */}
          <section id="section-15">
            <h2 className="mb-4 text-2xl font-bold text-zinc-900">
              15. Running the App
            </h2>
            <CopyCode code="npm run dev" language="bash" />
            <p className="mt-4 text-zinc-600 ">
              Visit http://localhost:3000, sign up, then sign in.
            </p>
          </section>

          {/* 16. Architecture */}
          <section id="section-16">
            <h2 className="mb-4 text-2xl font-bold text-zinc-900 ">
              16. Architecture Overview
            </h2>
            <p className="mb-4 text-zinc-600">
              Request flow: Browser → authClient → /api/auth/* → auth.ts →
              Drizzle → MySQL
            </p>
            <CopyCode
              code={`Browser (authClient.signIn.email)
    ↓
POST /api/auth/sign-in/email
    ↓
auth.ts (betterAuth + drizzleAdapter)
    ↓
db/index.ts (drizzle + mysql pool)
    ↓
MySQL: user, session, account, verification`}
              language="plaintext"
            />
          </section>
        </div>

        <footer className="mt-16 border-t border-zinc-200 pt-8">
          <p className="text-sm text-zinc-500">
            Need help? Check the{" "}
            <a
              href="https://www.better-auth.com/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              Better Auth docs
            </a>
            .
          </p>
        </footer>
      </main>
    </div>
  );
}
