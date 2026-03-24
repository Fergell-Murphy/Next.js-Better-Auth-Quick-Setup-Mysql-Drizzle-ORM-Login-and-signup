"use client";

import { useState } from "react";
import Link from "next/link";
import { authClient } from "@/auth-client";
import { useRouter } from "next/navigation";
import { RiLockPasswordFill } from "react-icons/ri";
import { BsEnvelopeAtFill } from "react-icons/bs";

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
      <div className="w-full max-w-md rounded-4xl border border-zinc-200 bg-white p-10 shadow-2xl">
        <h1 className=" text-xl font-semibold text-zinc-900">Welcome Back</h1>
        <p className="mb-6 text-sm text-zinc-500">
          Enter your credentials to access your account.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-800">
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="mb-1 flex items-center gap-2 text-sm font-medium text-zinc-700"
            >
              <BsEnvelopeAtFill className="text-blue-500" />
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="placeholder:text-xs w-full rounded-full border border-zinc-300 px-3 py-2 text-zinc-900 placeholder-zinc-400 focus:outline-none"
              placeholder="you@company.com"
            />
          </div>

          <div>
            <span className="flex justify-between">
              <label
                htmlFor="password"
                className="mb-1  flex gap-2 items-center text-sm font-medium text-zinc-700"
              >
                <RiLockPasswordFill className="text-blue-500" />
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-sm hover:underline text-blue-500 cursor-pointer"
              >
                Forgot password?
              </Link>
            </span>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
              autoComplete="current-password"
              className="placeholder:text-xs w-full rounded-full border border-zinc-300 px-3 py-2 text-zinc-900 placeholder-zinc-400 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full cursor-pointer rounded-full bg-blue-500 px-4 py-2 font-medium text-white hover:bg-blue-400 hover:scale-95 transition-all disabled:opacity-50"
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-zinc-600">
          Don&apos;t have an account?{" "}
          <Link
            href="/sign-up"
            className="font-medium text-blue-500 hover:underline cursor-pointer"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
