'use client'

import LoadingIcon from "@/lib/LoadingIcon";
import { signIn } from "next-auth/react"
import { useState, useTransition } from "react"

export default function Signin(){

    const [cred, setCred ] = useState("");
    const [password , setPassword] = useState("")
    
    const[pending, startTransition] = useTransition();

    const handleSubmit = async function(e : React.FormEvent<HTMLFormElement>){
        
        e.preventDefault();
        startTransition(async ()=>{
            signIn("credentials",{
                callbackUrl : '/dashboard',
                cred : cred,
                password : password
            })
        })
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input type="text"
                    required
                    value={cred}
                    onChange={(e)=>setCred(e.target.value)}
                    placeholder="Email or Phone" />
                <input type="password" 
                    required
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}
                    placeholder="Password"/>
                <button type="submit">
                    Login
                </button>
            </form>

            {pending && (
                <LoadingIcon/>
            )}
        </div>
    )
}