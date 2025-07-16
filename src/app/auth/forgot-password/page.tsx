'use client'

import LoadingIcon from "@/lib/LoadingIcon";
import axios from "axios";
import { useState, useTransition } from "react";

export default function ForgotPassword() {
  const [cred, setCred] = useState('');
  const [err, setErr] = useState('');
  const [success, setSuccess] = useState('');
  const [pending, startTransition] = useTransition();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    startTransition(async () => {
      try {
        const res = await axios.post('/api/user/forgot/send-mail', {
          email: cred
        });
        setSuccess('📧 Please check your mail for further directions. Check spam if not received.');
        setErr('');
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          const msg = error.response?.data.error || error.message || 'Error occurred.';
          setErr(msg);
        } else {
          setErr('⚠️ Some error occurred. Please try again.');
        }
        setSuccess('');
      }
    });
  };

  return (
    <div className="max-w-md mx-auto mt-24 p-6 bg-white rounded-2xl shadow-lg border border-orange-200">
      <h2 className="text-2xl font-bold text-orange-600 text-center mb-6">Forgot Password</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          required
          placeholder="Enter your email"
          onChange={(e) => setCred(e.target.value)}
          value={cred}
          className="w-full p-3 border border-orange-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
        />

        <button
          disabled={pending}
          type="submit"
          className={`w-full bg-orange-500 text-white font-semibold py-3 rounded-xl transition hover:bg-orange-600 ${
            pending ? 'opacity-60 cursor-not-allowed' : ''
          }`}
        >
          {pending ? 'Sending...' : 'Submit'}
        </button>
      </form>

      <div className="mt-4 text-orange-500 text-center">Email may take upto 5 minutes to arrive</div>

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
