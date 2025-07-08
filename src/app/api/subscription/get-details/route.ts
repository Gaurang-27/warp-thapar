import {prisma} from '@/lib/prisma'
import { SubType } from '@prisma/client';
import { NextResponse } from 'next/server';

export async function GET(req : Request){

    //not protected yet

    const {searchParams} = new URL(req.url);
    const id = searchParams.get('id');

    if(!id) return NextResponse.json({error : 'id required to fetch details'} , {status : 404});

    const subDetail = await prisma.subscription.findUnique({
        where : {userId : id}
    })

    if(!subDetail){
        return NextResponse.json({exist : false});
    }

    if(!subDetail.activated){
        return NextResponse.json({
            exist : true,
            startDate : 'NaN',
            endDate : "NaN",
            activated : false
        })
    }

    return NextResponse.json({
        exist : true, 
        startDate: subDetail.startDate?.toISOString(),
        endDate : subDetail.endDate?.toISOString(),
        SubType : SubType,
        activated : subDetail.activated
        })
}