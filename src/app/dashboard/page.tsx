'use client'
import { useAuth } from '@/lib/AuthProvider'

export default function dashboard(){

   const user  = useAuth();
   console.log(user);
    return(


        <div>
            {!user && (
                <p>login first</p>
            )}
            <p>{user?.user?.uid}</p>
        </div>
    )
}