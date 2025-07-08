import NextAuth, {DefaultSession} from "next-auth";
import {JWT} from 'next-auth/jwt'

declare module 'next-auth'{
    interface Session{
        user : {
            id : string;
            phone? : string;
            trialAvailable? : boolean;
        }& DefaultSession["user"];
    }

    interface User {
        id : string;
        phone? : string;
        trialAvailable? : boolean;
    }
}

declare module "next-auth/jwt"{
    interface JWT {
        user_id? : string ;
        phoneNo? : string ;
        trialAvail? : boolean;
    }
}

