'use client';

import { useRouter } from "next/navigation";

export default function CheckoutButton({
  price,
  subType,
  activated
}: {
  price: number;
  subType: string;
  activated : boolean;
}) {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    router.push(`/dashboard/checkout?price=${price}&subType=${subType}`);
  };

  return (
    <button
        disabled={!activated}
      onClick={handleClick}
      className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-md shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-300"
    >
        Buy Now
    </button>
  );
}
