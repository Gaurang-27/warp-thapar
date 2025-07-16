'use client'

import {
  ConfirmationResult,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from 'firebase/auth';
import { useState, useEffect, useTransition, FormEvent } from 'react';
import { auth } from '@/firebase';
import { FirebaseError } from 'firebase/app';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useSession } from 'next-auth/react';

export default function Signup() {

  const { data: session, status } = useSession()

  const router = useRouter();


  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [err, setErr] = useState('');
  const [success, setSuccess] = useState('');
  const [resendTimer, setResendTimer] = useState(0);

  const [confirmation, setConfirmation] =
    useState<ConfirmationResult | null>(null);
  const [recaptcha, setRecaptcha] = useState<RecaptchaVerifier | null>(null);

  const [pending, startTransition] = useTransition();


  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendTimer > 0) {
      timer = setTimeout(() => {
        setResendTimer(resendTimer - 1);
      }, 1000);
    }

    return () => clearTimeout(timer);
  }, [resendTimer]);

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/dashboard');
    }
  }, [status]);

  useEffect(() => {

    if (status === 'authenticated') {
      router.push('/dashboard');
    }
    const recaptchaverify = new RecaptchaVerifier(auth, 'recaptcha-container', {
      size: 'invisible',
    });
    setRecaptcha(recaptchaverify);

    return () => recaptchaverify.clear();
  }, []);

  const requestOtp = async (
    e?: FormEvent<HTMLFormElement> | React.MouseEvent
  ) => {
    e?.preventDefault();
    recaptcha?.render();
    setResendTimer(60);
    startTransition(async () => {
      setErr('');
      if (!recaptcha) {
        return setErr('Recaptcha not verified — are you a robot?');
      }
      if(password.length<6){
        alert("password needs to be atleast 6 characters");
        return;
      }

      try {
        const res = await axios.get('/api/user/user-exist', {
          params: { email, phone },
        });

        if (res.data.exist) {
          setErr('User with given credentials already exists');
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
          const message =
            err.response?.data?.message ||
            err.message ||
            'Something went wrong.';
          setErr(message);
        } else if (err instanceof FirebaseError) {
          switch (err.code) {
            case 'auth/invalid-phone-number':
              setErr('Invalid phone number. Please check the number.');
              break;
            case 'auth/too-many-requests':
              setErr('Too many requests. Please try again later.');
              break;
            default:
              setErr('Failed to send OTP. Please try again.');
              break;
          }
        } else if (err instanceof Error) {
          setErr(err.message);
        } else {
          setErr('An unknown error occurred.');
        }
      }
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    startTransition(async () => {
      setErr('');

      try {
        const userCredentials = await confirmation?.confirm(otp);
        const uid = userCredentials?.user?.uid;

        const res = await axios.post('/api/user/create-user', {
          email,
          phone,
          password,
          uid,
        });

        setSuccess('Signup successful!');
        router.push('/auth/signin');
      } catch (err) {
        setResendTimer(0);
        if (axios.isAxiosError(err)) {
          const message =
            err.response?.data?.message ||
            err.message ||
            'Something went wrong.';
          setErr(message);
        } else if (err instanceof FirebaseError) {
          switch (err.code) {
            case 'auth/invalid-verification-code':
              setErr('Invalid OTP. Please check and try again.');
              break;
            default:
              setErr('Failed to verify OTP.');
              break;
          }
        } else if (err instanceof Error) {
          setErr(err.message);
        } else {
          setErr('An unknown error occurred.');
        }
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-orange-50 px-4 py-12">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-orange-600 mb-6 text-center">
          Sign Up
        </h2>

        {!confirmation && (
          <form onSubmit={requestOtp} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={pending}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                placeholder="example@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone
              </label>
              <input
                type="tel"
                maxLength={10}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={pending}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                placeholder="Enter 10-digit phone number"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={pending}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                placeholder="********"
                required
              />
            </div>

            <button
              type="submit"
              disabled={pending || !phone || resendTimer > 0}
              className="w-full py-2 px-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-md transition disabled:opacity-50"
            >
              {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : 'Request OTP'}
            </button>
          </form>
        )}

        {confirmation && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mt-4">
                Enter OTP
              </label>
              <input
                type="text"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter 6-digit OTP"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>

            <button
              type="submit"
              disabled={otp.length !== 6 || pending}
              className="w-full py-2 px-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-md transition disabled:opacity-50"
            >
              Submit OTP
            </button>
          </form>
        )}

        {err && <p className="mt-4 text-sm text-red-600">{err}</p>}
        {success && <p className="mt-4 text-sm text-green-600">{success}</p>}
        {pending && <p className="mt-2 text-sm text-blue-600">Loading...</p>}

        <div id="recaptcha-container" />
      </div>
    </div>
  );
}
