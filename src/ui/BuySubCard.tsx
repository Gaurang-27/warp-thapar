'use client';

import subscriptions from "@/lib/subscriptions";
import CheckoutButton from "./CheckoutButton";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function BuySubCard({activated , exist} :{activated : boolean,exist:boolean}) {
  const router = useRouter();
  const session = useSession();

  return (
    <div className="w-full md:w-1/2 p-4">
      <div className="bg-orange-50 rounded-2xl shadow-xl p-8 md:p-12 border border-orange-300 flex flex-col space-y-12 md:items-start items-center transition-all duration-300">
        
        {/* Trial Section */}
        <div className="text-center md:text-left space-y-5 w-full">
          <h2 className="text-3xl md:text-4xl font-bold text-orange-600">
            🎁 Claim One-Day Trial for Free
          </h2>
          <p className="text-gray-600 text-base md:text-lg">
            No credit card required. Try all premium features today.
          </p>
          <button
            className="py-2.5 px-6 bg-orange-500 hover:bg-orange-600 focus:ring-4 focus:ring-orange-300 text-white font-semibold rounded-lg shadow-sm transition disabled:opacity-50"
            onClick={() => router.push('/dashboard/checkout/trial')}
          >
            Start Trial
          </button>
        </div>

        {/* Paid Subscriptions */}
        <div className="space-y-6 w-full">
          {subscriptions.map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col md:flex-row md:items-center justify-between gap-4 border border-orange-100 bg-orange-50/20 hover:bg-orange-100/40 transition rounded-xl p-5"
            >
              <div className="text-lg md:text-xl font-medium text-gray-800">
                📦 {item.month} Month Plan — <span className="text-orange-600 font-bold">₹{item.price}</span>
              </div>
              <CheckoutButton price={item.price} subType={item.subType} activated={activated} exist={exist} />
            </div>
          ))}
          {!activated && exist && (
            <div>Please wait for your account activation , then you can buy</div>
          )}
        </div>

      </div>
    </div>
  );
}
