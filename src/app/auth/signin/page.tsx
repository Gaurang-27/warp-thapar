'use client'

import { ConfirmationResult, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { useState, useEffect, useTransition, FormEvent } from "react";
import { auth } from '@/firebase'
import { startTransition } from "react";
import { FirebaseError } from "firebase/app";
import { useRouter } from "next/navigation";

export default function signin() {

    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState("");
    const [err, setErr] = useState("");
    const [success, setSuccess] = useState("");
    const [resendTimer, setResendTimer] = useState(0);

    const [confirmation, setConfirmation] = useState<ConfirmationResult | null>(null);
    const [recaptcha, setRecaptcha] = useState<RecaptchaVerifier | null>(null);

    const [pending, startTransition] = useTransition();

    const router = useRouter()


    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (resendTimer > 0) {
            timer = setTimeout(() => {
                setResendTimer(resendTimer - 1);
            }, (1000));
        }

        return () => clearTimeout(timer);
    }, [resendTimer])

    useEffect(() => {
        const recaptchaverify = new RecaptchaVerifier(
            auth,
            'recaptcha-container',
            {
                size: 'invisible',
            }
        )
        setRecaptcha(recaptchaverify);
        console.log(recaptcha);

        return () => recaptchaverify.clear();
    }, [])

    const requestOtp = async (e?: FormEvent<HTMLFormElement>) => {
        e?.preventDefault();
        console.log(recaptcha)
        recaptcha?.render();

        setResendTimer(60);

        startTransition(async () => {//pending becomes true
            setErr("");

            if (!recaptcha) {
                return setErr("recaptcha not verified are you a robot?")
            }
            try {
                const confirmationresult = await signInWithPhoneNumber(
                    auth,
                    phone,
                    recaptcha
                );
                setConfirmation(confirmationresult);
                setSuccess('OTP sent');
            } catch (err) {
                const error = err as FirebaseError;
                console.error("Firebase OTP error:", error);
                setResendTimer(0);

                switch (error.code) {
                    case "auth/invalid-phone-number":
                        setErr("Invalid phone number. Please check the number.");
                        break;
                    case "auth/too-many-requests":
                        setErr("Too many requests. Please try again later.");
                        break;
                    default:
                        setErr("Failed to send OTP. Please try again.");
                        break;
                }
            }
        })
    }

    const handleSubmit = async()=>{

        startTransition(async()=>{
            setErr("");

            try {
                await confirmation?.confirm(otp);
                router.replace('/dashboard');
            } catch (err : unknown) {
                const error = err as FirebaseError;

                console.log(error);
                setErr("failed to verify user");
            }
        })
    }




    return (
        <div>

            {!confirmation && (
                <div>
                    <form onSubmit={requestOtp}>
                        <input
                            type="text"
                            disabled={pending}
                            onChange={(e) => setPhone(e.target.value)} />
                    </form>
                </div>
            )}

            {
                confirmation && (
                    <div>
                        <form onSubmit={handleSubmit}>
                            <input
                            maxLength={6}
                            type="text"
                            onChange={(e)=>setOtp(e.target.value)} />
                        </form>
                        <button
                            disabled={otp.length!== 6}
                            onClick={()=>handleSubmit()}>
                            Submit
                        </button>
                    </div>
                )
            }
            <div>
                <button 
                        disabled = {pending || !phone || resendTimer>0}
                        onClick={() => requestOtp()}>
                        Request OTP
                    </button>
                    {resendTimer>0 && (
                        <p>Wait for {resendTimer} seconds to again request OTP</p>
                    )}
            </div>

            {err && (
                <p className="text-red-600">{err}</p>
            )}
            {success && (
                <p>{success}</p>
            )}

            {pending && (
                <p className='text-blue-600'>Loading...</p>
            )}

            <div id="recaptcha-container" />
        </div>
    )
}