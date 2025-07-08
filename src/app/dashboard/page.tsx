import { getServerSession } from 'next-auth';
import { next_auth } from '@/lib/next_auth';
import SignoutButton from '@/ui/SignoutButton';
import SubDetailsCard from '@/ui/SubDetailsCard';
import BuySubCard from '@/ui/BuySubCard';
import CustomerDetailCard from '@/ui/CustomerDetailCard';
import Link from 'next/link';

interface subDetailsType {
  startDate?: string;
  endDate?: string;
  subType?: string;
  exist: boolean;
  activated: boolean;
}

export default async function Dashboard() {
  const session = await getServerSession(next_auth);

  let err = "";
  let subDetails: subDetailsType = { exist: false, activated: true };

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center text-2xl font-semibold text-red-500">
        ❌ Not Logged In
      </div>
    );
  }

  try {
    const res = await fetch(
      `${process.env.BASE_URL}/api/subscription/get-details?id=${session?.user?.id}`,
      {
        method: 'GET',
        cache: 'no-store',
      }
    );

    if (!res.ok) {
      const errorBody = await res.json();
      throw new Error(`Fetch error: ${res.status} : ${errorBody.error}`);
    }

    const data = await res.json();
    subDetails = data;
  } catch (error: unknown) {
    console.error("Caught error:", error);
    if (error instanceof Error) {
      err = error.message || "unknown error";
    } else {
      err = "unknown error";
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      {/* Header */}
      <h1 className="text-5xl md:text-6xl text-center font-bold text-orange-500 md:text-left mb-12 md:pl-7">
        Warp @ Thapar
      </h1>

      {/* Subscription + Buy Cards */}
      <div className="flex flex-col md:flex-row md:space-x-6 space-y-6 md:space-y-0">
        <SubDetailsCard subDetails={subDetails} />
        <BuySubCard activated={subDetails.activated} exist={subDetails.exist} />
      </div>

      {/* User Details Card */}
      <div className="md:w-1/2">
        <div className="flex flex-col md:flex-row md:justify-start">
          <CustomerDetailCard />
        </div>
      </div>

      {/* Actions */}
      <div className="mt-12 flex flex-col items-center space-y-4">
        <SignoutButton />

        <Link
          href="/dashboard/transactions"
          className="text-orange-600 hover:text-orange-700 font-medium underline underline-offset-4 transition"
        >
          📄 View Transactions
        </Link>

        {err && (
          <p className="text-red-500 text-sm">⚠️ {err}</p>
        )}
      </div>
    </div>
  );
}
