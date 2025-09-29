import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
      <div className="max-w-md mx-auto text-center p-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          Abodex
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          The fastest, smartest way to close real estate deals
        </p>
        <Link 
          href="/deals" 
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
        >
          Test
        </Link>
      </div>
    </div>
  );
}