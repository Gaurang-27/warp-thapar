import { NextResponse } from "next/server";
import { cookies } from "next/headers";


export async function POST(req : Request){

    const url = new URL(req.url);
    const pass = url.searchParams.get('pass');

    const cookieStore = await cookies();

    if(!pass || pass!=process.env.ADMIN_PASS) return NextResponse.json({error : 'unauthorized access'},{status : 400});

    cookieStore.set('admin-token','true',{
        httpOnly : true,
        secure : true,
        maxAge : 60*60,
        path : '/'
    })

    return NextResponse.json({message : "admin authorized"})
}