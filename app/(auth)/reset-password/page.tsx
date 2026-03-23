"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { authClient } from "@/auth-client";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submitForm() {
    if (!token) {
      setMessage("Invalid or missing token.");
      return;
    }
    setLoading(true);
    setMessage(null);
    const res = await authClient.resetPassword({
      token,
      newPassword: password,
    });
    if (res.error) {
      setMessage(res.error.message ?? "Password reset failed");
    } else {
      setMessage("Password reset successfully");
    }
    setLoading(false);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50">
      <div className="w-full max-w-md rounded-4xl border border-zinc-200 bg-white p-8 shadow-sm">
        <h1 className="mb-6 text-2xl font-semibold text-zinc-900">
          Reset your password
        </h1>
        {message && (
          <div className="mb-4 rounded-md bg-zinc-100 px-3 py-2 text-sm text-zinc-800">
            {message}
          </div>
        )}
        <div className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="New password"
            className="w-full rounded-full border border-zinc-300 px-3 py-2 text-zinc-900 placeholder-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
          />
          <button
            onClick={submitForm}
            disabled={loading || !token || password.length === 0}
            className="w-full cursor-pointer rounded-full bg-blue-500 px-4 py-2 font-medium text-white transition-all hover:bg-blue-400 hover:scale-95 disabled:opacity-50"
          >
            {loading ? "Resetting..." : "Reset password"}
          </button>
          {!token && (
            <p className="text-xs text-red-600">
              The reset link is invalid or missing a token.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
