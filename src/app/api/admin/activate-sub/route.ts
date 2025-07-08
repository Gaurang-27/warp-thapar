import { NextResponse } from "next/server";
import { prisma } from '@/lib/prisma'
import { error } from "console";

//activate will only be needed when user is subscribing for first time
//or his previous subscription has ended so his entry from db is removed
export async function POST(req: Request) {

    const body = await req.json();
    const { pass, id } = body;

    if (!pass || pass != process.env.ADMIN_PASS) {
        return NextResponse.json({ error: "unauthorized access" }, { status: 400 });
    }
    if (!id) return NextResponse.json({ error: 'no userid found' }, { status: 404 });


    const findSub = await prisma.subscription.findUnique({
        where: {
            userId: id
        }
    })
    if (!findSub) return NextResponse.json({ error: 'no subscription running in this name' }, { status: 400 });

    if(findSub.activated) return NextResponse.json({error : "already activated"},{status : 402});

    let startDate = new Date();
    let endDate = new Date();
    // if(findSub.startDate && findSub.endDate){//user already has an active subscription
    //     startDate = findSub.startDate;
    //     endDate = findSub.endDate;
    // }
    const add = (findSub.subType === 'monthly')
                ? 30
                : (findSub.subType === 'quaterly')
                    ? 120
                    : 1;
    endDate.setDate(endDate.getDate() + add);

    const activate = await prisma.subscription.update({
        data: {
            activated: true,
            startDate : startDate,
            endDate : endDate
        },
        where: {
            userId: id
        }
    })
        const removeTrial = await prisma.user.update({
            data : {trialAvailable : false},
            where : {id : id}
        })


    if(!activate) return NextResponse.json({error : "error at database end"}, {status : 400});

    //mailing logic will come here

    return NextResponse.json({message : "subscription activated"})
}