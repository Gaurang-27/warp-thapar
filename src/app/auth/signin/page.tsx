'use client'

import LoadingIcon from "@/lib/LoadingIcon";
import { signIn } from "next-auth/react";
import { useState, useTransition } from "react";

export default function Signin() {
  const [cred, setCred] = useState("");
  const [password, setPassword] = useState("");
  const [pending, startTransition] = useTransition();

  const handleSubmit = async function (e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    startTransition(async () => {
      await signIn("credentials", {
        callbackUrl: "/dashboard",
        cred: cred,
        password: password,
      });
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-orange-50 px-4 py-12">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-orange-600 mb-6 text-center">
          Sign In
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email or Phone
            </label>
            <input
              type="text"
              value={cred}
              onChange={(e) => setCred(e.target.value)}
              required
              placeholder="you@example.com or 9876543210"
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-md transition disabled:opacity-50"
            disabled={pending}
          >
            {pending ? "Logging in..." : "Login"}
          </button>
        </form>

        {pending && (
          <div className="mt-4 flex justify-center">
            <LoadingIcon />
          </div>
        )}
      </div>
    </div>
  );
}
