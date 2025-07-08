import { NextResponse } from "next/server";
import {prisma} from '@/lib/prisma'


export async function POST(req : Request){

    const url = new URL(req.url);
    const id = url.searchParams.get('id');

    if(!id) return NextResponse.json({error : "userid required to del subscription"}, {status : 404});

    const deleteSub = await prisma.subscription.delete({
        where : {userId : id}
    })
    if(!deleteSub) return NextResponse.json({error : "error at db"}, {status : 400});

    return NextResponse.json({message : "subscription succesfully removed"});
}