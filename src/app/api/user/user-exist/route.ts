
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req : Request){

    const {searchParams} = new URL(req.url);
    const email = searchParams.get('email');
    const phone = searchParams.get('phone');

    if(!email || !phone || phone.length!==10) return NextResponse.json({error : "email and phone are required"},{status : 404})

    try {

        const findUser = await prisma.user.findMany(
           { where : {
                OR : [
                    {email : email},
                    {phone : phone}
                ] 
            }}
        )
        if(findUser[0]){
            return NextResponse.json({exist : true})
        }
        else{
            return NextResponse.json({exist: false})
        }
    } catch (error) {
        return NextResponse.json({error : 'Could Not reach database'} , {status : 400})
    }
}