'use client'

import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation"
import { useState, useTransition } from "react";

export default function Trial() {
  const router = useRouter();
  const [err, setErr] = useState("");
  const [success, setSuccess] = useState("");
  const [pending, startTransition] = useTransition();
  const { data: session } = useSession();

  const handleClick = async (e: React.MouseEvent) => {
    startTransition(async () => {
      try {
        const res = await axios.post('/api/subscription/create-sub', {
          id: session?.user.id,
          subType: 'trial',
          email : session?.user.email
        });

        setSuccess(
          "🎉 Your claim request is submitted! You'll receive an email once your account is activated."
        );
        setErr("");
      } catch (error: unknown) {
        console.log(error);
        if (axios.isAxiosError(error)) {
          const message =
            error.response?.data?.error || error.message || "Some error occurred";
          setErr(message);
        } else if (error instanceof Error) {
          setErr(error.message);
        } else {
          setErr("An unknown error occurred");
        }
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6 py-10 space-y-8">
      {/* Headings */}
      <div className="space-y-4 text-center max-w-2xl">
        <h1 className="text-4xl md:text-5xl font-bold text-orange-600">🚀 Claim Your Free Trial</h1>
        <p className="text-gray-700 text-lg">
          Activation may take up to <span className="font-semibold">24 hours</span>.
        </p>
        <p className="text-gray-700 text-lg">
          You will receive an email when your account is activated. Your one-day trial will start from that moment.
        </p>
        <p className="text-gray-600 text-base">
          📘 Need help? Follow the guide below to learn how to login into your Warp account.
        </p>
      </div>

      {/* Buttons */}
      <div className="flex flex-col md:flex-row gap-4">
        <button
          onClick={() => router.push('/help')}
          className="px-6 py-2.5 bg-orange-100 hover:bg-orange-200 text-orange-600 font-medium rounded-md border border-orange-300 transition"
        >
          🔍 View Help Guide
        </button>
        <button
          onClick={handleClick}
          disabled={pending}
          className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-md shadow-md transition disabled:opacity-50"
        >
          🎁 Claim Free Trial
        </button>
      </div>

      {/* Status messages */}
      {success && (
        <p className="text-green-600 font-medium text-center max-w-xl">{success}</p>
      )}
      {err && (
        <p className="text-red-500 font-medium text-center max-w-xl">{err}</p>
      )}
    </div>
  );
}
