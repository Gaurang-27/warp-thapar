import {prisma} from '@/lib/prisma';
import { isValidToken } from '@/lib/signedUrl';
import { NextResponse } from 'next/server';


export async function POST(req : Request){

    const body = await req.json();
    const {email , token , password , expires} = body;

    if(!email || !token || !password || !expires) return NextResponse.json({error : 'all fields not found'}, {status : 400});

    const genuine = isValidToken(token , expires , email);
    if(!genuine){
        return NextResponse.json({error : 'Token expired or wrong email, try again'}, {status : 400});
    }

    const updatePass = await prisma.user.update({
        data : {
            password : password 
        },
        where : {
            email : email
        }
    })
    if(!updatePass) return NextResponse.json({error : 'error at db try again'}, {status : 500});

    return NextResponse.json({message : 'password changed'});
}