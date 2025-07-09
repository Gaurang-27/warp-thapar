'use client'

import { useState } from "react"
import axios from "axios";
import { useRouter } from "next/navigation";


export default  function Admin() {

    const [pass, setPass] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async (e : React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await axios.post(`/api/admin/authorize?pass=${pass}`);
            router.replace('/admin/dashboard')

        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                setError(error.response?.data.error || error.message || "error")
            }
            else if (error instanceof Error) {
                setError(error.message || "error")
            }
            else {
                setError("error")
            }
        }
    }


    return (
        <div className="flex flex-col gap-5 w-full h-[100vh] justify-center items-center ">

            <h1>admin page</h1>
            <form className="flex flex-col gap-2"onSubmit={handleSubmit}>
                <input type="text" className="bg-orange-200 border-black p-2 text-lg rounded-xl"
                    required
                    onChange={(e)=>setPass(e.target.value)} 
                    placeholder="admin pass"
                    value={pass}/>
                <button 
                className="p-2 bg-orange-500 hover:bg-orange-400 rounded-xl text-lg"
                type="submit"
                > login</button>
            </form>

            {error && (
                <p className="text-red-500 font-bold">{error}</p>
            )}
        </div>
    )
}