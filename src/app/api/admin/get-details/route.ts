import { NextResponse } from "next/server";
import {prisma} from '@/lib/prisma'



export async function GET(req : Request){

    const url = new URL(req.url);
    const pass = url.searchParams.get('pass');

    if(pass != process.env.ADMIN_PASS) return NextResponse.json({error : "unauthorized access"},{status : 400})

    const getDetails = await prisma.subscription.findMany({
        orderBy : {
            endDate : 'asc'
        }
    })
    
    return NextResponse.json(getDetails);


}