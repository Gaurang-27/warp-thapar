'use client'
import { signOut } from 'firebase/auth';
import { useAuth } from '@/lib/AuthProvider';

import ProtectedRoute from '@/lib/ProtectedRoute';
import { auth } from '@/firebase';
import { useEffect, useTransition } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

import LoadingIcon from '@/lib/LoadingIcon';


export default function Dashboard() {

    const {user, token , checking } = useAuth();
    const router = useRouter();
    const [pending, startTransition] = useTransition();

    // useEffect(()=>{
    //     if(!user || !token) return ;
    //   async function checkUserExist(){
    //     try {
    //         const res = await axios.get('/api/user/user-exist' , {
    //             headers : {
    //                 Authorization : `Bearer ${token}`
    //             }
    //         })
    //         console.log(res.data)
    //         if(!res.data.exist){
    //             if (user?.uid) {
    //                 const hash = btoa(user.uid);
    //                 console.log(hash);
    //                 router.replace(`/auth/completeprofile?uid=${hash}`)
    //             }
    //         }else{
    //             return;
    //         }
    //     } catch (error) {
    //         console.error(error);
    //     }
    //   }
    //   startTransition(async ()=>{
    //     await checkUserExist();
    //   })
    // },[user])

    //if(pending) return <LoadingIcon/>

    return (
        <ProtectedRoute>
        {!pending && (
            <div>
            <p>{user?.uid}</p>
            <button onClick={()=>{
                signOut(auth);
            }}>
                sign out
            </button>
        </div>
        )}
        {pending && (<LoadingIcon/>)}
        </ProtectedRoute>
      
    )
}