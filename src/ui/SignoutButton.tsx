'use client'
import { signOut } from "next-auth/react";


export default function SignoutButton(){


    return (
        <button className="bg-blue-700 p-4" 
        onClick={()=>signOut()}>
            Sign out
        </button>
    )
}