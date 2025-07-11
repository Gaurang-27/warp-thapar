interface subDetailsType {
  startDate?: string;
  endDate?: string;
  subType?: string;
  exist: boolean;
  activated: boolean;
}

export default function SubDetailsCard({ subDetails }: { subDetails: subDetailsType }) {


  // No active subscription — minimal height and styling
  if (!subDetails.exist) {
    return (
      <div className="w-full md:w-1/2 p-4">
        <div className="bg-orange-100 rounded-xl shadow-md p-4 md:p-6 border border-orange-200 flex justify-center items-center">
          <h1 className="text-xl md:text-2xl font-semibold text-orange-500 text-center">
            🚫 No Active Subscription
          </h1>
        </div>
      </div>
    );
  }

  let correctedEndDate = "";

if (subDetails.endDate) {
  const endDateObj = new Date(subDetails.endDate);

  // Format: 08 July 2025
  correctedEndDate = endDateObj.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

  // Active subscription — full styled card
  return (
    <div className="w-full md:w-1/2 p-4">
      <div className="bg-orange-50 rounded-2xl shadow-lg p-6 md:p-10 border border-orange-300 flex flex-col md:items-start items-center space-y-6">
        <div className="space-y-5 w-full">
          <h1 className="text-4xl md:text-8xl text-orange-500 text-center md:text-left md:pb-7">
            Subscription Active
          </h1>

          <h2 className="text-lg md:text-2xl text-gray-700 text-center md:text-left">
            <span className="font-semibold text-orange-500">Active till:</span>{' '}
            {correctedEndDate}
          </h2>

          <h2 className="text-lg md:text-2xl text-gray-700 text-center md:text-left">
            <span className="font-semibold text-orange-500">Status:</span>{' '}
            {subDetails.activated ? 'Activated' : 'Not Activated'}
          </h2>
        </div>
      </div>
    </div>
  );
}
