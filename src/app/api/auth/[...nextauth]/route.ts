import NextAuth from "next-auth";
import { next_auth } from "@/lib/next_auth";

const handler = NextAuth(next_auth)


export { handler as GET, handler as POST };