'use client';

import { useSearchParams } from "next/navigation";
import CheckoutButton from "@/ui/CheckoutButton";
import { useSession } from "next-auth/react";
import { useState, useTransition, useEffect, Suspense } from "react";
import { load } from "@cashfreepayments/cashfree-js";
import axios from "axios";
import LoadingIcon from "@/lib/LoadingIcon";
import { useRouter } from "next/navigation";

type CashfreeSDK = {
  checkout: (options: {
    paymentSessionId: string;
    redirectTarget?: "_self" | "_blank" | "_parent" | "_top";
  }) => void;
};

function CheckoutContent() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();


  const router = useRouter()
  //const price = searchParams.get('price');
  const subType = searchParams.get('subType');

  useEffect(()=>{
    if(subType!=='monthly' && subType!=='quaterly'){
      setErr("invalid product")
      router.replace('/dashboard')
    }
  },[subType])

  const price = (subType==='monthly')?60:120

  const id = session?.user.id;
  const email = session?.user.email;
  const phone = '+91' + session?.user.phone;

  const [cashfree, setCashfree] = useState<CashfreeSDK | null>(null);
  const [pending, startTransition] = useTransition();
  const [err, setErr] = useState("");

  useEffect(() => {
    const initializeSDK = async () => {
      const sdk = await load({ mode: "sandbox" });
      setCashfree(sdk);
    };
    initializeSDK();
  }, []);

  const handleClick = async () => {
    if (!cashfree) {
      alert("Payment not ready, try again");
      return;
    }

    startTransition(async () => {
      try {
        const resp = await axios.post("/api/create-order", {
          subType : subType,
          customer_id: id,
          customer_email: email,
          customer_phone: phone,
        });

        cashfree.checkout({
          paymentSessionId: resp.data.payment_session_id,
          redirectTarget: "_self",
        });
      } catch (error: unknown) {
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-orange-50 px-6 py-12 space-y-8">
      <div className="bg-orange-50 shadow-md rounded-xl p-6 md:p-10 max-w-xl w-full border border-orange-200">
        <h1 className="text-red-600 font-medium text-lg mb-4">
          ⚠️ If your current plan has ended (trial or paid), activation may take up to 24 hours. You will receive an email once your account gets activated.
        </h1>

        <h2 className="text-4xl font-bold text-orange-600 mb-6">Checkout</h2>

        <div className="space-y-4 text-gray-700 text-lg">
          <p><span className="font-medium text-orange-500">Order Amount:</span> ₹{price}</p>
          <p>
            <span className="font-medium text-orange-500">Subscription:</span>{' '}
            {subType === 'monthly' ? '1 Month' : '3 Months'}
          </p>
          <p className="text-gray-600 text-base ">
            📎 By clicking on <strong>Pay Now</strong>, you will be redirected to the payment page.
          </p>
        </div>

        <button
          onClick={handleClick}
          disabled={pending || !subType}
          className="mt-6 w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-md transition disabled:opacity-50"
        >
          Pay Now
        </button>

        {pending && (
          <div className="mt-4 flex justify-center">
            <LoadingIcon />
          </div>
        )}

        {err && (
          <p className="mt-4 text-red-500 text-center font-medium">{err}</p>
        )}
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="text-center text-gray-500 py-10">Loading checkout...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
