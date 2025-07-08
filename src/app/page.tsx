import { next_auth } from "@/lib/next_auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function Home() {
  const session = await getServerSession(next_auth);

  // Uncomment to redirect if already logged in
  // if (session) redirect('/dashboard');

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 py-8">
      {/* Main Container */}
      <div className="flex flex-col md:flex-row items-center gap-20 max-w-5xl w-full">

        {/* Title Section */}
        <div className="text-center md:text-left md:flex-1">
          <h1 className="text-5xl sm:text-8xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-tight">
            Warp @ Thapar
          </h1>
        </div>

        {/* Auth Section */}
        <div className="md:flex-1 flex flex-col gap-6 w-full max-w-sm text-center md:text-left md:pl-6">
          <div>
            <h3 className="text-md sm:text-xl">Already have an Account?</h3>
            <Link
              href="/auth/signin"
              className="mt-2 inline-block bg-blue-500 text-white text-2xl sm:text-2xl font-semibold py-3 px-6 rounded-xl hover:bg-blue-600 transition min-w-30"
            >
              Sign In
            </Link>
          </div>
          <div>
            <h3 className="text-md sm:text-xl">Do not have an account?</h3>
            <Link
              href="/auth/signup"
              className="mt-2 inline-block bg-blue-500 text-white text-2xl sm:text-2xl font-semibold py-3 px-6 rounded-xl hover:bg-blue-600 transition sm:min-w-14"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="absolute bottom-4 right-4 text-xs sm:text-sm text-gray-600 text-right">
        <p>📞 +91 9069931799</p>
        <p>✉️ gaurangg272@gmail.com</p>
      </div>
    </main>
  );
}
