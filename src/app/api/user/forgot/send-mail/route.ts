import {prisma} from '@/lib/prisma'
import { generateToken } from '@/lib/signedUrl';
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer'


export async function POST(req: Request){

    const body = await req.json();
    const {email} = body;
    if(!email){
        return NextResponse.json({error : 'email not received'},{status : 404});
    }

    const findUser = await prisma.user.findUnique({
        where : {
            email : email
        }
    })
    if(!findUser) return NextResponse.json({error : 'user not found'}, {status : 404});

    const {token , expires} = generateToken(email , 900);


    //mailing logic
   try {
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
             subject: 'Forgot Password',
             text: `Go to https://warp-thapar.vercel.app/forgot-password/change?expires=${expires}&token=${token}&email=${email} to change password.`,
             html: `
                 <p>Hey there,</p>
                 <p>To change your password click on the link below and follow instructions</p>
                 <p> 
                 <a href="https://warp-thapar.vercel.app/auth/forgot-password/change?expires=${expires}&token=${token}&email=${email}" target="_blank" rel="noopener noreferrer" style="color: #0070f3;">here</a>.
                 </p>
                 <br>
                 <p>Thanks</p>
             `,
         })
   } catch (error : unknown) {
        return NextResponse.json({error : 'please try again later'},{status : 500})
   }

   return NextResponse.json({message : 'mail sent'})
}