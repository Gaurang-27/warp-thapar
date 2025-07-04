import { NextResponse } from "next/server";
import {prisma} from '@/lib/prisma'


export async function POST(req : Request) {
    
    const body = await req.json();
    const {uid , name , email , phone} = body;

    if(!uid || !name || !email || !phone){
        return NextResponse.json({error : "all the credentials not received"});
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
        return NextResponse.json({error : "user with given credentials already exists"})
    }

    const createUser = await prisma.user.create({
        data: {
            uid, name, email, phone
        }
    })
    if(!createUser){
        return NextResponse.json({error : "error while creating user"})
    }

    return NextResponse.json({message : 'user created',userId : createUser.uid})
}