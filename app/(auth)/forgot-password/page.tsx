"use client";

import { useState } from "react";
import { authClient } from "@/auth-client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const redirectTo = process.env.NEXT_PUBLIC_APP_URL
      ? `${process.env.NEXT_PUBLIC_APP_URL}/reset-password`
      : "/reset-password";
    const res = await authClient.requestPasswordReset({
      email,
      redirectTo,
    });

    if (res.error) {
      const msg = res.error.message?.toLowerCase() ?? "";
      if (
        res.error.code === "USER_NOT_FOUND" ||
        msg.includes("user not found") ||
        msg.includes("doesn't exist") ||
        msg.includes("does not exist")
      ) {
        setMessage(
          "If an account exists, you'll receive an email with instructions.",
        );
      } else {
        setMessage(res.error.message ?? "Reset failed");
      }
    } else {
      setMessage(
        "If an account exists, you'll receive an email with instructions.",
      );
    }

    setLoading(false);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50">
      <div className="w-full max-w-md rounded-4xl border border-zinc-200 bg-white p-8 shadow-sm">
        <h1 className="mb-6 text-2xl font-semibold text-zinc-900">
          Forgot your password
        </h1>

        {message && (
          <div className="mb-4 rounded-md bg-zinc-100 px-3 py-2 text-sm text-zinc-800">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="mb-1 block text-sm font-medium text-zinc-700"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              placeholder="you@example.com"
              className="w-full rounded-full border border-zinc-300 px-3 py-2 text-zinc-900 placeholder-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full cursor-pointer rounded-full bg-zinc-900 px-4 py-2 font-medium text-white transition-colors hover:bg-zinc-800 disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send reset link"}
          </button>
        </form>
      </div>
    </div>
  );
}
