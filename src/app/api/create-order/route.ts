import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
//import subscriptions from "@/lib/subscriptions";
import { getServerSession } from "next-auth";
import { next_auth } from "@/lib/next_auth";

export async function POST(req: NextRequest) {

  // const session = await getServerSession(next_auth);
  // if(!session){
  //   return NextResponse.json({error : "unauthorized acces"}, {status : 400});
  // }
  //vulnerable endpoint

  const body = await req.json();
  const { customer_id, customer_email, customer_phone, subType } = body;

  if (!customer_email || !customer_id || !customer_phone || !subType) {
    return NextResponse.json(
      { error: "Please provide all required details" },
      { status: 400 }
    );
  }

  const orderId = "order_" + Date.now();
  if(subType!=='monthly' && subType!=='quaterly'){
    return NextResponse.json({error : 'invalid product'},{status : 400});
  }

  const order_amount = (subType === 'monthly')?60:120;

  try {
    const resp = await axios.post(
      `https://${process.env.CASHFREE_MODE}.cashfree.com/pg/orders`,
      {
        order_meta: {
          return_url: `${process.env.BASE_URL}/dashboard/transactions`,
          notify_url: `${process.env.BASE_URL}/api/webhook/listen`,
        },
        order_id: orderId,
        order_amount: order_amount,
        order_currency: "INR",
        customer_details: {
          customer_id: customer_id,
          customer_email: customer_email,
          customer_phone: customer_phone,
        },
      },
      {
        headers: {
          accept: "application/json",
          "x-api-version": "2022-09-01",
          "x-client-id": process.env.CASHFREE_APP_ID,
          "x-client-secret": process.env.CASHFREE_SECRET_KEY,
          "content-type": "application/json",
        },
      }
    );

    return NextResponse.json({
      customer_id: resp.data.customer_id,
      order_id: resp.data.order_id,
      order_meta: resp.data.order_meta,
      payment_session_id: resp.data.payment_session_id,
    });
  } catch (error: unknown) {
    // safe handling of unknown error type
    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        {
          error: true,
          message: error.response?.data?.message || error.message || "Unknown Axios error",
        },
        { status: 500 }
      );
    }

    if (error instanceof Error) {
      return NextResponse.json(
        {
          error: true,
          message: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        error: true,
        message: "Unexpected error",
      },
      { status: 500 }
    );
  }
}
