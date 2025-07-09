import { NextResponse } from "next/server";
import {prisma} from '@/lib/prisma'
import { cookies } from "next/headers";
import nodemailer from 'nodemailer';

export async function POST(req : Request){

    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    const email = url.searchParams.get('email');

    const cookiestore = await cookies();
        const adminToken = cookiestore.get('admin-token')?.value
    
        if(adminToken !== 'true') return NextResponse.json({error : 'unauthorized acces'}, {status :400})

    if(!id || !email) return NextResponse.json({error : "userid and email required to del subscription "}, {status : 404});

    const deleteSub = await prisma.subscription.delete({
        where : {userId : id}
    })
    if(!deleteSub) return NextResponse.json({error : "error at db"}, {status : 400});

    //mailing logic
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
            subject: 'Termination of your subscription',
            text: `Your subscription is now terminated.\n\nGo to https://warp-thapar.vercel.app to manage it.`,
            html: `
                <p>Hey there,</p>
                <p>Your subscription has been <strong>terminated</strong>.Please buy a subscription to continue using warp</p>
                <p>
                You can manage your subscription 
                <a href="https://warp-thapar.vercel.app" target="_blank" rel="noopener noreferrer" style="color: #0070f3;">here</a>.
                </p>
                <br>
                <p>Thanks</p>
            `,
        })

    return NextResponse.json({message : "subscription succesfully removed"});
}