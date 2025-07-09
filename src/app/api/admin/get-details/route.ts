import { NextResponse } from "next/server";
import {prisma} from '@/lib/prisma'



export async function GET(req : Request){

    const url = new URL(req.url);
    const pass = url.searchParams.get('pass');
    const type = url.searchParams.get('type');

    if(pass != process.env.ADMIN_PASS) return NextResponse.json({error : "unauthorized access"},{status : 400})

    if(type === 'activated'){
        const getDetails = await prisma.subscription.findMany({
        orderBy : {
            endDate : 'asc'
        },
        where : {
            activated : true
        }
    })
    return NextResponse.json(getDetails);
    }
    
    const getDetails = await prisma.subscription.findMany({
        orderBy : {
            endDate : 'asc'
        },
        where : {
            activated : false
        }
    })
    
    return NextResponse.json(getDetails);


}