'use client'

import { ConfirmationResult, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { useState, useEffect, useTransition, FormEvent } from "react";
import { auth } from '@/firebase'
import { FirebaseError } from "firebase/app";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useAuth } from "@/lib/AuthProvider";
import { error } from "console";

export default function Signup() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");


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

        return () => recaptchaverify.clear();
    }, [])


    const requestOtp = async (e?: FormEvent<HTMLFormElement> | React.MouseEvent) => {
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

                //first we check if user exist with given credentials
                const res = await axios.get('/api/user/user-exist', {
                        params: { email, phone },
                });

                if (res.data.exist) {
                    setErr("User with given credentials already exists");
                    return;
                }



                const confirmationresult = await signInWithPhoneNumber(
                    auth,
                    '+91' + phone,
                    recaptcha
                );
                setConfirmation(confirmationresult);
                setSuccess('OTP sent');


            } catch (err) {
                setResendTimer(0);

                if (axios.isAxiosError(err)) {
                    // Axios error from /api/user/user-exist
                    const message =
                        err.response?.data?.message ||
                        err.message ||
                        "Something went wrong while checking user.";
                    setErr(message);

                } else if (err instanceof FirebaseError) {
                    // Firebase OTP error
                    console.error("Firebase OTP error:", err);

                    switch (err.code) {
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

                } else if (err instanceof Error) {
                    // Any other JS error
                    setErr(err.message);
                } else {
                    setErr("An unknown error occurred.");
                }
            }
        })
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {

        e.preventDefault();
        startTransition(async () => {
            setErr("");

            try {
                const userCredentials = await confirmation?.confirm(otp);
                const uid = userCredentials?.user?.uid;

                const res = await axios.post('/api/user/create-user',{
                        email,phone,password,uid
                })

                setSuccess('Login Successful')

            } catch (err) {
                setResendTimer(0);

                if (axios.isAxiosError(err)) {
                    // Axios error from /api/user/user-exist
                    const message =
                        err.response?.data?.message ||
                        err.message ||
                        "Something went wrong while checking user.";
                    setErr(message);

                } else if (err instanceof FirebaseError) {
                    // Firebase OTP error
                    console.error("Firebase OTP error:", err);

                    switch (err.code) {
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

                } else if (err instanceof Error) {
                    // Any other JS error
                    setErr(err.message);
                } else {
                    setErr("An unknown error occurred.");
                }
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
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                            required
                            placeholder="Email" />
                        <input
                            type="tel"
                            disabled={pending}
                            onChange={(e) => setPhone(e.target.value)}
                            value={phone}
                            required
                            placeholder="Phone Number"
                            maxLength={10} />
                        <input
                            type="password"
                            disabled={pending}
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                            required
                            placeholder="Password" />
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
                                onChange={(e) => setOtp(e.target.value)}
                                required
                                value={otp}
                                placeholder="OTP" />
                        </form>
                        <button
                            disabled={otp.length !== 6}
                            onClick={(e) => handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>)}>
                            Submit
                        </button>
                    </div>
                )
            }
            <div>
                <button
                    disabled={pending || !phone || resendTimer > 0}
                    onClick={(e) => requestOtp(e)}>
                    Request OTP
                </button>
                {resendTimer > 0 && (
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