import { next_auth } from '@/lib/next_auth';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';

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
    });

    return (
      <div className="min-h-screen bg-orange-50 p-6">
        {/* Header */}
        <div className="bg-orange-400 text-white p-4 rounded-xl shadow-md mb-6">
          <h1 className="text-2xl font-bold text-center">Your Transactions</h1>
        </div>

        {/* Transactions List */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
                <div className="text-lg font-semibold text-orange-600 mb-2">
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
      <div className="min-h-screen bg-orange-50 flex items-center justify-center text-red-600 text-lg">
        Some error has occurred while retrieving transactions.
      </div>
    );
  }
}
