'use client'

import { useAuth } from "@/lib/AuthProvider"
import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import axios, { AxiosError } from 'axios'
import LoadingIcon from "@/lib/LoadingIcon";

export default function CompleteProfile() {

    const { user, token, checking } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();

    const [pending, startTransition] = useTransition();
    const [error, setError] = useState("")

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");

    useEffect(() => {

        if (!user) return
        async function checkGenuine() {
            const uid = searchParams.get('uid') as string;
            // console.log('Query UID:', uid);
            // console.log('User UID:', user?.uid);

            const decodeduid = atob(uid);
            const isValid = (decodeduid === user?.uid)

            if (!isValid) {
                router.push('/')
            }

        }
        checkGenuine();
    }, [user])


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        startTransition(async () => {
            try {
                const res = await axios.post("/api/user/create-user", {
                    name,
                    email,
                    phone: user?.phoneNumber,
                    uid: user?.uid,
                });

                router.push("/dashboard");
            } catch (error: unknown) {
                if (axios.isAxiosError(error)) {
                    setError(error.response?.data?.message || error.message || "An error occurred");
                } else if (error instanceof Error) {
                    setError(error.message);
                } else {
                    setError("An unknown error occurred");
                }
            }
        });
    };

    return (
        <div>
            <form onSubmit={handleSubmit} >
                <input
                    type="text"
                    value={name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                    required />

                <input
                    type="text"
                    value={email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                    required />
                <button type="submit">
                    Submit
                </button>
            </form>

            {error && (
                <p>{error}</p>
            )}

            {pending && (<LoadingIcon />)}

        </div>
    )
}