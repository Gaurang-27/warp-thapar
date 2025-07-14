'use client'

export default function Help() {
  return (
    <div className="min-h-screen flex justify-center items-center bg-orange-50 py-10 px-6">
      <div className="max-w-3xl mx-auto bg-orange-100 shadow-md rounded-xl p-8 border border-2 border-white">
        <h1 className="text-3xl font-bold text-orange-600 mb-6">Help & Support</h1>

        <h2 className="text-xl font-semibold text-gray-800 mb-2">How to Login to Zero Trust WARP:</h2>
        <ol className="list-decimal list-inside text-gray-700 space-y-1 mb-6 text-lg m-2">
          <li>Install the Cloudflare WARP client from the official website.</li>
          <li>Open the WARP client and click on the gear icon ⚙️ and then "preferences" to open settings.</li>
          <li>Go to the “Account” tab and click “Login with Cloudflare Zero Trust”.</li>
          <li>Enter the team name - {process.env.NEXT_PUBLIC_TEAM_NAME}.</li>
          <li>A browser will open — log in with your email and enter the OTP recieved.</li>
          <li>Once verified, return to the WARP client. It will now be connected to your Zero Trust team.</li>
        </ol>

        <h2 className="text-xl font-semibold text-gray-800 mb-2">Need help?</h2>
        <p className="text-gray-700 text-lg">
          Contact us on Discord:{" "}
          <a
            href={process.env.NEXT_PUBLIC_DISCORD_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-600 hover:underline font-medium"
          >
            Join our support server
          </a>
        </p>
      </div>
    </div>
  );
}
