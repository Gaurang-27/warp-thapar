import { next_auth } from "@/lib/next_auth";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import {prisma} from '@/lib/prisma'



export async function POST(req : Request){

    const session = await getServerSession(next_auth);
    const id = session?.user.id;

    if(!session) return NextResponse.json({error : "unauthorize"}, {status : 400});
    if (!id) return NextResponse.json({ error: "User ID is missing" }, { status: 400 });

    const checkTrial = await prisma.user.findUnique(
        {where : {
            id : id
        }}
    )
    if(!checkTrial) return NextResponse.json({error : 'user not exist'}, {status : 404});

    if(!checkTrial.trialAvailable) return NextResponse.json({error : "free trial already claimed"},{status : 400});


    const createTrial = await prisma.subscription.create({
        data : {
            userId : id,
            subType : 'trial',
        }
    })

    if(!createTrial) return NextResponse.json({error : "error occured on database end"} , {status : 400})

    return NextResponse.json({message : "trial created"});

}