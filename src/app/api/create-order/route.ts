import axios from "axios";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req:NextRequest){

    const body = await req.json();
    const {customer_id,customer_email,customer_phone, order_amount} = body;

    if (!customer_email || !customer_id || !customer_phone || !order_amount) {
        return NextResponse.json(
            { error: "Please provide all required details" },
            { status: 400 }
        );
    }

    const orderId = "order_" + Date.now();

    try {
        const resp = await axios.post(
      "https://api.cashfree.com/pg/orders",
      {
        order_meta: {
            return_url: "https://youtube.com",
            notify_url: "https://webhook.site/2b09f118-7269-4140-a9f4-a851f50878cf"
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
      });

      //console.log(resp.data)
      return NextResponse.json(
        {   
            customer_id : resp.data.customer_id,
            order_id : resp.data.order_id,
            order_meta : resp.data.order_meta,
            payment_session_id : resp.data.payment_session_id 
        }

      )
    } catch (error : any) {
        console.log(error);
        return NextResponse.json(
      {
        error: true,
        message: error.response?.data?.message || error.message || "Unknown error",
      },
      { status: 500 }
    );
    }



}