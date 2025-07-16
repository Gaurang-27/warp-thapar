import { next_auth } from '@/lib/next_auth';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function Transactions() {
  const session = await getServerSession(next_auth);

  if (!session || !session.user?.id) {
    redirect('/');
  }

  try {
    const transactions = await prisma.payments.findMany({
      where: {
        customer_id: session.user.id,
      },
      orderBy: { payment_time: 'desc' }
    });

    return (
      <div className="min-h-screen bg-orange-50 px-4 sm:px-6 py-6 overflow-x-hidden">
        {/* Header */}
        <div className="bg-orange-500 text-white px-4 sm:px-6 py-4 sm:py-6 rounded-2xl shadow-lg mb-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-center sm:text-left">
              Your Transactions
            </h1>
            <Link
              href="/"
              className="bg-orange-50 px-4 py-2 rounded-xl text-orange-600 font-semibold text-base sm:text-lg transition hover:bg-white"
            >
              Home
            </Link>
          </div>
        </div>

        {/* Transactions List */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {transactions.length === 0 ? (
            <div className="text-center col-span-full text-orange-700 font-semibold">
              No transactions found.
            </div>
          ) : (
            transactions.map((txn) => (
              <div
                key={txn.cf_payment_id}
                className="bg-orange-100 border-2 border-gray-50 rounded-xl p-4 shadow hover:shadow-lg transition"
              >
                <div className="text-lg font-semibold text-orange-600 mb-2 break-words">
                  ₹{txn.order_amount}
                </div>
                <div className="text-sm text-gray-600">
                  <strong>Date:</strong> {txn.payment_time.toLocaleString('en-IN')}
                </div>
                <div className="text-sm text-gray-600">
                  <strong>Status:</strong> {txn.payment_status}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  } catch (error: unknown) {
    console.error("Error fetching transactions:", error);
    return (
      <div className="min-h-screen bg-orange-50 flex items-center justify-center text-red-600 text-lg px-4 text-center">
        Some error has occurred while retrieving transactions.
      </div>
    );
  }
}
