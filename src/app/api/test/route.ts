import { verifyFirebaseAuth } from "@/lib/firebaseAuth";
import {  NextResponse } from "next/server";



export async function GET(req : Request){

    try {
        const decodedToken = await verifyFirebaseAuth(req);
        const uid = decodedToken.uid;

        return NextResponse.json({message : uid})
    } catch (error) {
        return NextResponse.json({error : "unauthorized"});
    }
}