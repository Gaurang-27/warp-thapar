import {prisma} from '@/lib/prisma';
import { PrismaAdapter } from '@auth/prisma-adapter';
import NextAuth from 'next-auth';
import  CredentialsProvider  from 'next-auth/providers/credentials';
import type { NextAuthOptions } from 'next-auth';


export const next_auth : NextAuthOptions =  {
    providers: [
        CredentialsProvider({
            // The name to display on the sign in form (e.g. 'Sign in with...')
            name: 'Credentials',
            // The credentials is used to generate a suitable form on the sign in page.
            // You can specify whatever fields you are expecting to be submitted.
            // e.g. domain, username, password, 2FA token, etc.
            // You can pass any HTML attribute to the <input> tag through the object.
            credentials: {
                email: { label: "email", type: "text" },
                phone : {label : "phone" , type : "text"},
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {
               
                const userExist = await prisma.user.findMany(
                    {where : {
                        AND :[{email : credentials?.email},{phone : credentials?.phone}]
                    }}
                );
                if(!userExist){
                    throw new Error ("user with given credentials does not exist");
                }
                
                const isPasswordCorrect = (userExist[0]?.password === credentials?.password);

                if(!isPasswordCorrect){
                    throw new Error("password is incorrect");
                }

                return {
                    id : userExist[0].id,
                    email : userExist[0].email,
                    phone : userExist[0].phone
                }

                //return null;
             
            }
        })
    ],
    adapter : PrismaAdapter(prisma),
    session :{
        strategy : 'jwt'
    },
    pages :{
        signIn : '/signin',
    },
    secret : process.env.NEXTAUTH_SECRET,

}