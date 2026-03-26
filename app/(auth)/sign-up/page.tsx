"use client";

import { useState } from "react";
import Link from "next/link";
import { authClient } from "@/auth-client";
import { useRouter } from "next/navigation";
import { RiLockPasswordFill } from "react-icons/ri";
import { BsEnvelopeAtFill } from "react-icons/bs";
import { FaUserTie } from "react-icons/fa";

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
    <div className="flex min-h-screen items-center justify-center bg-zinc-50">
      <div className="w-full flex justify-center overflow-hidden max-w-2xl rounded-4xl border border-zinc-200 bg-white shadow-2xl">
        <div className=" bg-gray-200 h-130 flex-1"></div>
        <div className="p-10 flex flex-1 justify-center flex-col">
          <h1 className="text-xl font-semibold text-zinc-900">
            Create An Account
          </h1>
          <p className="mb-6 text-sm text-zinc-500">
            Sign up to gain access to the platform.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-800">
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="name"
                className="mb-1 flex items-center gap-2 text-sm font-medium text-zinc-700"
              >
                <FaUserTie className="text-blue-500" />
                Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoComplete="name"
                className="placeholder:text-xs w-full rounded-full border border-zinc-300 px-3 py-2 text-zinc-900 placeholder-zinc-400 focus:border-blue-500 focus:outline-none"
                placeholder="Your name"
              />
            </div>

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
                className="placeholder:text-xs w-full rounded-full border border-zinc-300 px-3 py-2 text-zinc-900 placeholder-zinc-400 focus:border-blue-500 focus:outline-none "
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1 flex items-center gap-2 text-sm font-medium text-zinc-700"
              >
                <RiLockPasswordFill className="text-blue-500" />
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
                autoComplete="new-password"
                minLength={8}
                className="placeholder:text-xs w-full rounded-full border border-zinc-300 px-3 py-2 text-zinc-900 placeholder-zinc-400 focus:border-blue-500 focus:outline-none"
              />
              <p className="mt-1 text-xs text-zinc-500">
                At least 8 characters
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full cursor-pointer rounded-full bg-blue-500 hover:scale-95 px-4 py-2 font-medium text-white hover:bg-blue-400 transition-all disabled:opacity-50"
            >
              {isLoading ? "Creating Account..." : "Sign Up"}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-zinc-600">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-blue-500 hover:underline cursor-pointer"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
