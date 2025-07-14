import { next_auth } from "@/lib/next_auth";
import { getServerSession } from "next-auth";
import Link from "next/link";

export default async function CustomerDetailCard() {
  const session = await getServerSession(next_auth);

  return (
    <div className="w-full md:w-full p-4">
      <div className="bg-orange-100 rounded-2xl shadow-lg p-6 md:p-10 border border-orange-300 space-y-6">
        <h1 className="text-4xl font-bold text-orange-600">👤 User Details</h1>

        <div className="space-y-2 text-lg text-gray-800">
          <p>
            <span className="font-semibold text-orange-500">Email:</span>{" "}
            {session?.user.email}
          </p>
          <p>
            <span className="font-semibold text-orange-500">Phone:</span>{" "}
            {session?.user.phone}
          </p>
        </div>

        <Link
          href="/dashboard/change-password"
          className="inline-block mt-4 text-white bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-md font-medium transition"
        >
          Change Password
        </Link>
      </div>
    </div>
  );
}
