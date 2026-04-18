"use client";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <p
        className="text-[120px] sm:text-[160px] font-semibold text-[var(--secondary)] opacity-10 leading-none select-none"
        style={{ fontFamily: "var(--font-cormorant)" }}
      >
        404
      </p>
      <div className="-mt-8">
        <h2
          className="text-3xl sm:text-4xl font-semibold text-gray-900 mb-3"
          style={{ fontFamily: "var(--font-cormorant)" }}
        >
          Page Not Found
        </h2>
        <p className="text-gray-400 text-sm mb-8 max-w-sm mx-auto">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex gap-3 justify-center">
          <Link
            href="/"
            className="px-6 py-3 bg-[var(--secondary)] text-white rounded-xl font-medium text-sm hover:bg-[#c03535] transition-colors"
          >
            Go Home
          </Link>
          <Link
            href="/shop"
            className="px-6 py-3 border-2 border-gray-200 text-gray-600 rounded-xl font-medium text-sm hover:border-[var(--secondary)] hover:text-[var(--secondary)] transition-colors"
          >
            Browse Shop
          </Link>
        </div>
      </div>
    </main>
  );
}
