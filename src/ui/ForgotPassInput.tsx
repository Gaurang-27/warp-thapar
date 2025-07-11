'use client'

import LoadingIcon from "@/lib/LoadingIcon";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export default function ForgotInput({ expires, token, email }: { expires: string; token: string; email: string }) {
  const [password, setCred] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [err, setErr] = useState('');
  const [success, setSuccess] = useState('');
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPass) {
      alert('Password and confirm password do not match');
      return;
    }
    if(password.length < 6) {
        alert('Password must be atleast 6 letters')
        return;
    }

    startTransition(async () => {
      try {
        const res = await axios.post('/api/user/forgot/change-pass', {
          password,
          expires,
          token,
          email
        });
        setSuccess('✅ Password has been changed');
        setErr('');
        router.replace('/auth/signin');
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          const msg = error.response?.data.error || error.message || 'Something went wrong';
          setErr(msg);
        } else {
          setErr('⚠️ Some error occurred. Please try again.');
        }
        setSuccess('');
      }
    });
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded-2xl shadow-lg border border-orange-200">
      <h2 className="text-2xl font-bold text-orange-600 text-center mb-6">Reset Your Password</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="password"
          required
          placeholder="New password"
          onChange={(e) => setCred(e.target.value)}
          value={password}
          className="w-full p-3 border border-orange-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
        <input
          type="password"
          required
          placeholder="Confirm password"
          onChange={(e) => setConfirmPass(e.target.value)}
          value={confirmPass}
          className="w-full p-3 border border-orange-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
        />

        <button
          disabled={pending}
          type="submit"
          className={`w-full bg-orange-500 text-white font-semibold py-3 rounded-xl transition hover:bg-orange-600 ${
            pending ? 'opacity-60 cursor-not-allowed' : ''
          }`}
        >
          {pending ? 'Processing...' : 'Submit'}
        </button>
      </form>

      {success && (
        <div className="mt-4 text-green-600 text-center font-medium">{success}</div>
      )}
      {err && (
        <div className="mt-4 text-red-600 text-center font-medium">{err}</div>
      )}
      {pending && (
        <div className="mt-4 flex justify-center">
          <LoadingIcon />
        </div>
      )}
    </div>
  );
}
