import { isValidToken } from "@/lib/signedUrl"
import ForgotInput from "@/ui/ForgotPassInput";


export default async function Change({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const expires = searchParams.expires;
  const token = searchParams.token;
  const email = searchParams.email;


    if(!expires || !token || !email){
        return (
            <div className="w-full h-[100vh] flex justify-center items-center text-red-600 text-2xl">
                Invalid URL jal
            </div>
        )
    }
    const genuine = isValidToken(token,expires ,email);
    if(!genuine){
        return(
            <div className="w-full h-[100vh] flex justify-center items-center text-red-600 text-2xl">
                Invalid URL
            </div>
        )
    }

    return(
       <div>
        <ForgotInput expires={expires} token={token} email={email}/>
       </div>
    )

}