// app/api/auth/error/page.tsx
'use client'

import { useSearchParams } from "next/navigation"

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  let message = "Something went wrong during authentication.";

  switch (error) {
    case "CredentialsSignin":
      message = "Invalid credentials. Please check your login details.";
      break;
    case "OAuthAccountNotLinked":
      message = "This email is already linked with another provider.";
      break;
    case "AccessDenied":
      message = "Access denied.";
      break;
    // Add more NextAuth error types if needed
    case "Callback":
      message = "Error during callback. Please try again.";
      break;
    default:
      if (error) message = decodeURIComponent(error);
  }

  return (
    <div className="p-4 text-red-600">
      <h1 className="text-2xl font-bold">Login Error</h1>
      <p>{message}</p>
    </div>
  );
}
