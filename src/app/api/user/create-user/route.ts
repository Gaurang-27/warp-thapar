import { NextResponse } from "next/server";
import {prisma} from '@/lib/prisma'


export async function POST(req : Request) {
    
    const body = await req.json();
    const {uid ,password , email , phone} = body;

    if(!uid || !password|| !email || !phone){
        return NextResponse.json({error : "all the credentials not received"},{status : 404});
    }
    if(phone.length!==10){
        return NextResponse.json({error : "Phone number not valid"}, {status : 400})
    }

    const userexist = await prisma.user.findMany({
        where : {
            OR : [
                {uid : uid},
                {phone : phone},
                {email : email}
            ]
                
        }
    })
    if(userexist[0]){
        return NextResponse.json({error : "user with given credentials already exists"},{status : 400})
    }

    const createUser = await prisma.user.create({
        data: {
            uid, email, phone,password
        }
    })
    if(!createUser){
        return NextResponse.json({error : "error while creating user"},{status : 400})
    }

    return NextResponse.json({message : 'user created',userId : createUser.uid})
}