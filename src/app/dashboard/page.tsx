'use client'
import { useAuth } from '@/lib/AuthProvider'
import { signOut } from 'firebase/auth';
import {auth} from '@/firebase'

export default function Dashboard(){

   const {user}  = useAuth();
   console.log(user);
    return(


        <div>
            {!user&& (
                <div>
                    <p>login first</p>
                </div>
            )}
            {
                user && (
                    <button onClick={()=>signOut(auth)}>
                    sign out
                    </button>
                )
            }
            <p>{user?.uid}</p>
        </div>
    )
}