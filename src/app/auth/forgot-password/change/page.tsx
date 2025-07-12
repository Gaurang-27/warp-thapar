import { isValidToken } from "@/lib/signedUrl"
import ForgotInput from "@/ui/ForgotPassInput";


interface PageProps {
  searchParams: {
    token?: string;
    expires?: string;
    email?: string;
  };
}

export default async function Change({
  params,searchParams
}: {
 params: Promise <{params:string}>
  searchParams: Promise<{ [key: string]: string  | undefined }>
}) {
  const { token, expires, email } = await searchParams;

  if (!token || !expires || !email) {
    return (
      <div className="w-full h-screen flex justify-center items-center text-red-600 text-2xl">
        Invalid URL
      </div>
    );
  }

  const valid = isValidToken(token, expires, email);

  if (!valid) {
    return (
      <div className="w-full h-screen flex justify-center items-center text-red-600 text-2xl">
        Invalid or expired link
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <ForgotInput expires={expires} token={token} email={email} />
    </div>
  );
}
