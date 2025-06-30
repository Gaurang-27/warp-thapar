import Link from "next/link";

export default function Home() {
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      {/* Main Heading */}
      <h1 className="text-5xl font-extrabold text-center mb-12">Warp@Thapar</h1>

      {/* Info Card */}
      <div className="flex items-center justify-between bg-white shadow-lg rounded-2xl p-6 w-full max-w-2xl">
        {/* Logo */}
        <div className="flex-shrink-0">
          <img
            src="/warp-logo.jpeg"
            alt="Warp Logo"
            className="h-40 w-80 object-fill rounded-md"
          />
        </div>

        {/* Buy Info */}
        <div className="ml-8 text-right">
          <p className="text-xl font-semibold text-gray-900">
            Buy now for ₹60/month
          </p>
          <p className="text-sm text-gray-500 mb-2">
            One day trial and then pay
          </p>
          <Link
            href="/buy"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition"
          >
            Buy Now
          </Link>
        </div>
      </div>

      {/* Contact Details - Bottom Right */}
      <div className="absolute bottom-4 right-4 text-sm text-gray-600 text-right">
        <p>📞 +91 9069931799</p>
        <p>✉️ gaurangg272@gmail.com</p>
      </div>
    </main>
  );
}
