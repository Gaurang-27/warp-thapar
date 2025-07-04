import { verifyFirebaseAuth } from "@/lib/firebaseAuth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req : Request){

    try {
        const decodedToken = await verifyFirebaseAuth(req);
        if (!decodedToken?.uid) {
                return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }
        const uid = decodedToken?.uid;

        const findUser = await prisma.user.findUnique(
           { where : {
                uid : uid 
            }}
        )
        if(findUser){
            return NextResponse.json({exist : true})
        }
    else{
            return NextResponse.json({exist: false})
        }
    } catch (error) {
        return NextResponse.json({error : 'unauthorized access'})
    }
}