import { NextResponse } from "next/server";
import {prisma} from "@/lib/prisma"
import { error } from "console";

//this will be called when webhook OR new sub entry
export async function POST(req: Request){

    //route protection logic comes here

    const body = await req.json();
    const {id , subType} = body;

    if(!id || !subType) return NextResponse.json({error : "id and subType required"}, {status : 404})

    const currentSub = await prisma.subscription.findUnique({
        where : {
            userId : id
        }
    })

    const trialValid = await prisma.user.findUnique({
                where : {id : id}
            })
    if(subType == 'trial'){       
            if(!trialValid?.trialAvailable) return NextResponse.json({error : 'user has already redeemed trial'},{status :400})
    }

    

    //subscription already exists so we will extend the end date
    if(currentSub){

        if(!currentSub?.startDate || !currentSub.endDate){//checking if sub exists but is not activated
            return NextResponse.json({error : 'not activated yet'}, {status : 400});
        }


        let dateNow = new Date();
        let startDate = (dateNow > currentSub.endDate)?dateNow:currentSub.endDate;//might happen where technically sub has ended but still user is not deleted from database
        let endDate = new Date(startDate);
        const add = (subType === 'monthly')
                ? 30
                : (subType === 'quaterly')
                    ? 90
                    : 1;
        endDate.setDate(endDate.getDate() + add);

        const updateSub = await prisma.subscription.update({
            where : {
                userId : id
            },
            data :{
                subType : subType,
                startDate : startDate ,
                endDate : endDate
            }
        })
        if(!updateSub) return NextResponse.json({error : "error at db"}, {status : 500});

        return NextResponse.json({message : 'subscription renewed'});
    }
    //subscription has ended or it is first time so need to create a new entry 


    const createSub = await prisma.subscription.create({
        data : {
            subType : subType,
            userId : id
        }
    })

    if(!createSub) return NextResponse.json({error : "error while creating subscription"}, {status : 500})

    return NextResponse.json({message : "subscription created"});
}