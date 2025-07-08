'use client';
import { signOut } from "next-auth/react";

export default function SignoutButton() {
  return (
    <button
      onClick={() => signOut({callbackUrl:'/'})}
      className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-md shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-300"
    >
      🔓 Sign Out
    </button>
  );
}
