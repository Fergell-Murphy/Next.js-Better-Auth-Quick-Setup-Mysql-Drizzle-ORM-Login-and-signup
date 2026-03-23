"use client";

import Link from "next/link";
import { authClient } from "@/auth-client";

export default function Home() {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50">
        <p className="text-zinc-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50">
      <main className="flex w-full max-w-md flex-col items-center gap-6 rounded-4xl border border-zinc-200 bg-white p-8 shadow-sm">
        {session ? (
          <>
            <h1 className="text-2xl font-semibold text-zinc-900">
              Welcome, {session.user.name}
            </h1>
            <p className="text-zinc-600">
              You are signed in as {session.user.email}
            </p>
            <div className="flex gap-4">
              <Link
                href="/dashboard"
                className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
              >
                Dashboard
              </Link>
              <button
                onClick={() => authClient.signOut()}
                className="rounded-full cursor-pointer bg-zinc-200 px-4 py-2 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-300"
              >
                Sign out
              </button>
            </div>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-semibold text-zinc-900">
              Better Auth Quick Setup
            </h1>
            <p className="text-center text-zinc-600">
              Sign in or create an account to get started.
            </p>
            <div className="flex gap-4">
              <Link
                href="/login"
                className="rounded-full bg-zinc-900 px-4 py-2 font-medium text-white transition-colors hover:bg-zinc-800"
              >
                Sign in
              </Link>
              <Link
                href="/sign-up"
                className="rounded-full border border-zinc-300 px-4 py-2 font-medium text-zinc-900 transition-colors hover:bg-zinc-50"
              >
                Sign up
              </Link>
            </div>
          </>
        )}
        <Link
          href="/docs"
          className="mt-6 text-sm text-zinc-500 hover:text-zinc-700"
        >
          Setup guide
        </Link>
      </main>
    </div>
  );
}
