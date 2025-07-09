import { NextResponse } from "next/server";
import {prisma} from '@/lib/prisma'
import axios from "axios";
import nodemailer from 'nodemailer'


export async function POST(req : Request){

    const body = await req.json();

    const {data} = body;

    if(!data) return NextResponse.json({error : 'no data found'}, {status : 404});
    if (!data?.payment?.cf_payment_id || !data?.order?.order_id) {
      return NextResponse.json({ error: "Invalid or missing data" }, { status: 400 });
    }

    const existing = await prisma.payments.findUnique({
        where : {cf_payment_id : String(data?.payment?.cf_payment_id)}
    })
    if(existing) return NextResponse.json({message : "transaction already noted"});

    const createTransaction = await prisma.payments.create({
        data : {
            order_id : data.order?.order_id,
            order_amount : data.order?.order_amount,
            cf_payment_id : String(data.payment?.cf_payment_id),
            payment_status : data.payment?.payment_status,
            payment_message : data.payment?.payment_message,
            payment_time : data.payment?.payment_time,
            customer_id : data.customer_details?.customer_id
        }
    })
    if(!createTransaction) return NextResponse.json({error : "error at db"},{status : 500});

    //if payment if success we call create-sub 
    if(data.payment?.payment_status === "SUCCESS"){
        const subType = (data.order?.order_amount === 60)?'monthly':'quaterly';

        
        try {

            const res = await axios.post(`${process.env.BASE_URL}/api/subscription/create-sub`,{
                id : data.customer_details?.customer_id,
                subType : subType,
                email : data.customer_details?.customer_email
            })
            
            //mailing logic first so that user is assured payment has reached
            const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: process.env.EMAIL,
                        pass: process.env.EMAIL_PASS
                    },
                })
                const info = await transporter.sendMail({
                    from: process.env.EMAIL,
                    to: data.customer_details?.customer_email,
                    subject: 'Payment received',
                    text: `We have recieved your payment.\n\nGo to https://warp-thapar.vercel.app to manage it.`,
                    html: `
                        <p>Hey there,</p>
                        <p>We have recieved your payment of <strong>Rs.${data.order?.order_amount}</strong>. It will reflect in your dashboard soon.</p>
                        <p>
                        You can manage your subscription 
                        <a href="https://warp-thapar.vercel.app" target="_blank" rel="noopener noreferrer" style="color: #0070f3;">here</a>.
                        </p>
                        <br>
                        <p>Note : If your previous subscription has already ended , it may take upto 24 hours to activate your account. You will receive an email once it's activated.</p>
                        <br>
                        <p>Thanks</p>
                    `,
                })


            return NextResponse.json({message : res?.data?.message})
            
        } catch (error : unknown) {
            if(axios.isAxiosError(error)){
                const message = error.response?.data?.error || error.message || "unknown error"
                return NextResponse.json({error : message} , {status : 500})
            }
            else if(error instanceof Error){
                const message = error.message || 'unknown error'
                return NextResponse.json({error : message} , {status : 500})
            }
            else{
                return NextResponse.json({error : "some unknown error occured"}, {status : 500});
            }
        }
        

    }

    return NextResponse.json({message : `Payment status ${data.payment?.payment_status}`});
}