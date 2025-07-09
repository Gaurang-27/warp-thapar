import { cookies } from "next/headers"

import Link from "next/link";

export default async function Dashboard(){


    const cookiestore = await cookies();
    const adminToken = cookiestore.get('admin-token')?.value
    if(adminToken != 'true') {
        return (
            <div className="text-red-600 w-full h-full flex justify-center items-center">Logged out go to /admin</div>
        )
    }




    return (
        <div className="w-full h-[100vh] flex justify-center items-center flex-col gap-5"> 
            <Link href={'/admin/dashboard/activated'}
            className="bg-blue-500  rounded-2xl text-2xl p-4">
                Activated User
            </Link>
            <Link href={'/admin/dashboard/not-activated'}
            className="bg-blue-500  rounded-2xl text-2xl p-4">
                Non Activated User
            </Link>

        </div>
    )
}