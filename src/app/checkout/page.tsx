'use client'

import { load } from "@cashfreepayments/cashfree-js";
import axios from "axios";
import { useEffect, useState } from "react";

function Checkout() {
  const [sessionId, setSessionId] = useState("");
  const [cashfree, setCashfree] = useState<any>(null);

  // 1. Fetch Payment Session
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
      } catch (error: any) {
        console.error("Error while checkout:", error);
      }
    };

    getSessionId();
  }, []);

  // 2. Load Cashfree SDK
  useEffect(() => {
    const initializeSDK = async () => {
      const sdk = await load({ mode: "production" });
      setCashfree(sdk);
    };
    initializeSDK();
  }, []);

  // 3. Trigger payment
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
