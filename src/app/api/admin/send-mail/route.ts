import { NextResponse } from "next/server";

import nodemailer from 'nodemailer'

export async function POST(req : Request){


    const body = await req.json();
    const {email} = body;

    if(!email) return NextResponse.json({error : "no emial recieved"},{status : 400});

    //mailing logic will come here
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASS
            },
        })
        const info = await transporter.sendMail({
            from: process.env.EMAIL,
            to: email,
            subject: 'Warp Subscription ending soon',
            text: `Your subscription is ending soon.Please renew.\n\nGo to https://warp-thapar.vercel.app to manage it.`,
            html: `
                <p>Hey there,</p>
                <p>Your subscription is ending soon.Please renew your subscription to continue using warp.</p>
                <p>Please ignore if already purchased </p>
                <p>
                You can manage your subscription 
                <a href="https://warp-thapar.vercel.app" target="_blank" rel="noopener noreferrer" style="color: #0070f3;">here</a>.
                </p>
                <br>
                <p>Thanks</p>
            `,
        })

        if(!info) return NextResponse.json({error : "email not sent"},{status : 400});

        return NextResponse.json({message : "mail sent"});

    
}