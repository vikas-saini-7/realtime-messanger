"use client";

import { useUser } from "@clerk/nextjs";
import Link from "next/link";

export default function HomePage() {
  const { user, isLoaded } = useUser();

  return (
    <div className="min-h-screen bg-[#fafafa] text-neutral-900 flex flex-col">

      {/* Top Nav */}
      <header className="w-full border-b border-neutral-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-sm font-semibold tracking-tight">
            Realtime Messenger
          </h1>

          {isLoaded && user ? (
            <Link
              href="/chat"
              className="text-sm text-neutral-600 hover:text-black transition"
            >
              Open App →
            </Link>
          ) : (
            <Link
              href="/sign-in"
              className="text-sm text-neutral-600 hover:text-black transition"
            >
              Sign In →
            </Link>
          )}
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-3xl text-center space-y-10">

          <div className="space-y-6">
            <h2 className="text-5xl md:text-6xl font-semibold tracking-tight leading-[1.05]">
              Conversations,
              <br />
              <span className="text-neutral-400">
                beautifully simplified.
              </span>
            </h2>

            <p className="text-lg text-neutral-500 max-w-xl mx-auto leading-relaxed">
              A clean, real-time messaging experience built with modern web technologies.
              Fast, secure, and minimal by design.
            </p>
          </div>

          {/* CTA */}
          <div className="flex justify-center gap-4 flex-wrap">

            {!isLoaded ? (
              <div className="h-12 w-40 bg-neutral-200 animate-pulse rounded-lg" />
            ) : user ? (
              <>
                <Link
                  href="/chat"
                  className="px-6 py-3 bg-black text-white rounded-lg text-sm font-medium hover:opacity-90 transition"
                >
                  Open Chat
                </Link>

                <Link
                  href="/settings"
                  className="px-6 py-3 border border-neutral-300 rounded-lg text-sm font-medium hover:bg-neutral-100 transition"
                >
                  Settings
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/sign-up"
                  className="px-6 py-3 bg-black text-white rounded-lg text-sm font-medium hover:opacity-90 transition"
                >
                  Get Started
                </Link>

                <Link
                  href="/sign-in"
                  className="px-6 py-3 border border-neutral-300 rounded-lg text-sm font-medium hover:bg-neutral-100 transition"
                >
                  Sign In
                </Link>
              </>
            )}
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-200 py-6 text-center text-xs text-neutral-400">
        Built with Next.js, Convex & Clerk.
      </footer>
    </div>
  );
}