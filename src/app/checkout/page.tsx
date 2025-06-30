"use client";

import { load } from "@cashfreepayments/cashfree-js";
import axios from "axios";
import { useEffect, useState } from "react";

// Define SDK type to avoid `any`
type CashfreeSDK = {
  checkout: (options: {
    paymentSessionId: string;
    redirectTarget?: "_self" | "_blank" | "_parent" | "_top";
  }) => void;
};

function Checkout() {
  const [sessionId, setSessionId] = useState("");
  const [cashfree, setCashfree] = useState<CashfreeSDK | null>(null);

  useEffect(() => {
    const getSessionId = async () => {
      try {
        const resp = await axios.post("/api/create-order", {
          order_amount: 1,
          customer_id: "234",
          customer_email: "gaurangg272@gmai.com",
          customer_phone: "+919069931799"
        });
        setSessionId(resp.data.payment_session_id);
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("Error while checkout:", error.message);
        } else {
          console.error("Unknown error while checkout");
        }
      }
    };

    getSessionId();
  }, []);

  useEffect(() => {
    const initializeSDK = async () => {
      const sdk = await load({ mode: "production" });
      setCashfree(sdk);
    };
    initializeSDK();
  }, []);

  const doPayment = () => {
    if (!cashfree || !sessionId) {
      alert("Payment not ready. Please wait.");
      return;
    }

    cashfree.checkout({
      paymentSessionId: sessionId,
      redirectTarget: "_self",
    });
  };

  return (
    <div className="p-4">
      <p>Click below to open the checkout page in current tab</p>
      <button
        type="button"
        className="bg-blue-600 text-white px-4 py-2 rounded"
        onClick={doPayment}
      >
        Pay Now
      </button>
    </div>
  );
}

export default Checkout;
