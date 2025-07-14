'use client'

import LoadingIcon from "@/lib/LoadingIcon";
import axios from "axios";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export default function ChangePass() {
    const router = useRouter();
    const [pending, startTransition] = useTransition();
    const [oldPass, setOldPass] = useState('');
    const [newPass, setNewPass] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    const [err, setErr] = useState('');
    const [success, setSuccess] = useState('');

    const session = useSession();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setErr('');
        setSuccess('');

        startTransition(async () => {
            if (newPass !== confirmPass) {
                setErr('New password and confirm password do not match');
                return;
            }
            if (newPass.length < 6) {
                setErr('Password needs to be at least 6 characters');
                return;
            }

            try {
                const res = await axios.post('/api/user/change-pass', {
                    oldPassword: oldPass,
                    newPassword: newPass,
                    email: session?.data?.user.email
                });

                setSuccess(res.data?.message);
                setTimeout(() => {
                    setSuccess('');
                    signOut({ callbackUrl: '/auth/signin' });
                }, 1000);


            } catch (error: unknown) {
                if (axios.isAxiosError(error)) {
                    const msg = error.response?.data.error || error.message || 'Some error occurred';
                    setErr(msg);
                } else {
                    setErr('Some error occurred');
                }
            }
        });
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-orange-50 px-4">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md bg-white rounded-2xl shadow-md p-8 border border-orange-200"
            >
                <h2 className="text-2xl font-semibold text-orange-600 mb-6 text-center">Change Password</h2>

                {err && <p className="mb-4 text-sm text-red-600">{err}</p>}
                {success && <p className="mb-4 text-sm text-green-600">{success}</p>}

                <div className="mb-4">
                    <label className="block text-sm font-medium text-orange-800 mb-1">Old Password</label>
                    <input
                        type="password"
                        value={oldPass}
                        onChange={(e) => setOldPass(e.target.value)}
                        required
                        className="w-full px-4 py-2 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-orange-800 mb-1">New Password</label>
                    <input
                        type="password"
                        value={newPass}
                        onChange={(e) => setNewPass(e.target.value)}
                        required
                        className="w-full px-4 py-2 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-orange-800 mb-1">Confirm Password</label>
                    <input
                        type="password"
                        value={confirmPass}
                        onChange={(e) => setConfirmPass(e.target.value)}
                        required
                        className="w-full px-4 py-2 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                </div>

                <button
                    type="submit"
                    disabled={pending}
                    className="w-full bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-60"
                >   {!pending && (
                    <p>Submit</p>
                )}
                    {pending && (
                        <LoadingIcon/>
                    )}
                </button>
            </form>
        </div>
    );
}
