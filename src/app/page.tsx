"use client";

import { useUser } from "@clerk/nextjs";
import Link from "next/link";

export default function HomePage() {
  const { user, isLoaded } = useUser();

  return (
    <div className="min-h-screen bg-gray-500/5 flex items-center justify-center p-6">
      <div className="w-full max-w-xl bg-white border border-gray-200 rounded-2xl shadow-sm p-10 text-center space-y-6">

        {/* App Name */}
        <h1 className="text-3xl font-semibold text-gray-900">
          Realtime Messenger
        </h1>

        {/* Subtitle */}
        <p className="text-sm text-gray-500">
          Simple. Fast. Minimal.
        </p>

        {/* Auth State */}
        {!isLoaded ? (
          <div className="h-8 w-40 mx-auto bg-gray-200 animate-pulse rounded-xl" />
        ) : user ? (
          <>
            <p className="text-sm text-gray-600">
              Welcome back,{" "}
              <span className="font-medium text-gray-900">
                {user.firstName}
              </span>
            </p>

            <div className="flex justify-center gap-4 pt-4">
              <Link
                href="/chat"
                className="px-5 py-2 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition text-sm"
              >
                Open Chat
              </Link>

              <Link
                href="/settings"
                className="px-5 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition text-sm"
              >
                Settings
              </Link>
            </div>
          </>
        ) : (
          <div className="flex justify-center gap-4 pt-4">
            <Link
              href="/sign-in"
              className="px-5 py-2 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition text-sm"
            >
              Sign In
            </Link>

            <Link
              href="/sign-up"
              className="px-5 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition text-sm"
            >
              Create Account
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}