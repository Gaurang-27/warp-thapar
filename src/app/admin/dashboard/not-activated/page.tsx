import {prisma} from '@/lib/prisma'
import AdminSubCard from '@/ui/AdminSubCard'
import { cookies } from 'next/headers'


export default async function Activated(){

    const cookiestore = await cookies();
    const adminToken = cookiestore.get('admin-token')?.value
    if(adminToken != 'true') {
        return (
            <div className="text-red-600 w-full h-full flex justify-center items-center">Logged out go to /admin</div>
        )
    }

    try {
        const getDetails = await prisma.subscription.findMany({
                orderBy : {
                    endDate : 'asc'
                },
                where : {
                    activated : false
                },
                include: {
                    user : {
                        select : {
                            email : true,
                            phone : true,
                        }
                    }
                }
            })

            console.log(getDetails)
        if(getDetails.length === 0 ) return (
            <div>No active subscriptions</div>
        )

        return(

            <div>

                {getDetails.map((element,idx)=>(
                    <div key={idx}>
                        <AdminSubCard element={element}/>
                    </div>
                ))}
            </div>
        )
    } catch (error : unknown) {
        return (
            <div>contact dev</div>
        )
    }

    
}