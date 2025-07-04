// lib/firebaseAuth.ts
import admin from "firebase-admin";
//import serviceAccount from "../../firebase-secret.json";
//import { NextResponse } from "next/server";

if (!admin?.apps?.length) {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY!);

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  });
}

export const adminAuth = admin.auth();

/**
 * Verifies Firebase ID token from request headers.
 * @param req The incoming request (Next.js API route)
 * @returns The decoded Firebase user token
 * @throws Error if token is missing or invalid
 */
export async function verifyFirebaseAuth(req: Request) {

    //return NextResponse.json({message:"heloo"})
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.split("Bearer ")[1]
    : null;

  if (!token) {
    throw new Error("No Firebase token provided");
  }

  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    return decodedToken;
  } catch (error) {
    console.error("Firebase token verification failed:", error);
    throw new Error("Invalid Firebase token");
  }
}
