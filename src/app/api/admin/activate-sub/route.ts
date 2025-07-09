import { NextResponse } from "next/server";
import { prisma } from '@/lib/prisma'
import { cookies } from "next/headers";
import nodemailer from 'nodemailer'

//activate will only be needed when user is subscribing for first time
//or his previous subscription has ended so his entry from db is removed
export async function POST(req: Request) {

    const body = await req.json();
    const { id, email } = body;

    const cookiestore = await cookies();
    const adminToken = cookiestore.get('admin-token')?.value

    if (adminToken !== 'true') return NextResponse.json({ error: 'unauthorized acces' }, { status: 400 })

    if (!id || !email) return NextResponse.json({ error: 'no userid found or no email found' }, { status: 404 });


    const findSub = await prisma.subscription.findUnique({
        where: {
            userId: id
        }
    })
    if (!findSub) return NextResponse.json({ error: 'no subscription running in this name' }, { status: 400 });

    if (findSub.activated) return NextResponse.json({ error: "already activated" }, { status: 402 });

    let startDate = new Date();
    let endDate = new Date();
    // if(findSub.startDate && findSub.endDate){//user already has an active subscription
    //     startDate = findSub.startDate;
    //     endDate = findSub.endDate;
    // }
    const add = (findSub.subType === 'monthly')
        ? 30
        : (findSub.subType === 'quaterly')
            ? 120
            : 1;
    endDate.setDate(endDate.getDate() + add);

    const activate = await prisma.subscription.update({
        data: {
            activated: true,
            startDate: startDate,
            endDate: endDate
        },
        where: {
            userId: id
        }
    })
    if (add == 1) {
        const removeTrial = await prisma.user.update({
            data: { trialAvailable: false },
            where: { id: id }
        })
    }

    if (!activate) return NextResponse.json({ error: "error at database end" }, { status: 400 });

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
        subject: 'Activation of your subscription',
        text: `Your subscription is now active.\n\nGo to https://warp-thapar.vercel.app to manage it.`,
        html: `
            <p>Hey there,</p>
            <p>Your subscription is now <strong>activated</strong>. You can use warp now.</p>
            <p>
            You can manage your subscription 
            <a href="https://warp-thapar.vercel.app" target="_blank" rel="noopener noreferrer" style="color: #0070f3;">here</a>.
            </p>
            <br>
            <p>Thanks</p>
        `,
    })

    return NextResponse.json({ message: "subscription activated", info })
}