
import {prisma} from '@/lib/prisma'
import { NextResponse } from 'next/server';


export async function POST(req : Request){

    const body = await req.json()
    const {oldPassword , newPassword , email} = body ;
    if(!oldPassword || !newPassword || !email) return NextResponse.json({error : "old password , new password needed and email needed"},{status: 400});

    const findUser = await prisma.user.findUnique({
        where : {
            email : email
        }
    })
    if(!findUser) return NextResponse.json({error : "user not found"}, {status : 400})

    if(findUser.password !== oldPassword) {
        return NextResponse.json({error : 'old password is incorrect'}, {status : 400});
    }

    const changePass = await prisma.user.update({
        data : {
            password : newPassword 
        },
        where : {
            email : email
        }
    })
    if(!changePass) return NextResponse.json({error : 'error at db please try again'}, {status : 400});

    return NextResponse.json({message : "password updated successfully please login again"});
}