"use client";

import { useUser } from "@clerk/nextjs";
import Link from "next/link";

export default function HomePage() {
  const { user, isLoaded } = useUser();

  return (
    <div className="min-h-screen bg-[#151818] text-neutral-100 flex flex-col">
      {/* Top Nav */}
      <header className="w-full border-b border-white/10 backdrop-blur">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="tracking-tight text-white font-bold font-display">
            Realtime Messenger
          </h1>

          {isLoaded && user ? (
            <Link
              href="/chat"
              className="text-sm text-rose-400 hover:text-rose-300 transition"
            >
              Open App →
            </Link>
          ) : (
            <Link
              href="/sign-in"
              className="text-sm text-rose-400 hover:text-rose-300 transition"
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
            <h2 className="text-5xl md:text-6xl font-semibold tracking-tight leading-[1.05] text-white">
              Conversations,
              <br />
              <span className="text-rose-400">beautifully simplified.</span>
            </h2>

            <p className="text-lg text-neutral-400 max-w-xl mx-auto leading-relaxed">
              A clean, real-time messaging experience built with modern web
              technologies. Fast, secure, and minimal by design.
            </p>
          </div>

          {/* CTA */}
          <div className="flex justify-center gap-4 flex-wrap">
            {!isLoaded ? (
              <div className="h-12 w-40 bg-white/10 animate-pulse rounded-lg" />
            ) : user ? (
              <>
                <Link
                  href="/chat"
                  className="px-6 py-3 bg-rose-500 text-white rounded-lg text-sm font-medium hover:bg-rose-400 transition"
                >
                  Open Chat
                </Link>

                <Link
                  href="/settings"
                  className="px-6 py-3 border border-white/15 text-neutral-200 rounded-lg text-sm font-medium hover:bg-white/5 transition"
                >
                  Settings
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/sign-up"
                  className="px-6 py-3 bg-rose-500 text-white rounded-lg text-sm font-medium hover:bg-rose-400 transition"
                >
                  Get Started
                </Link>

                <Link
                  href="/sign-in"
                  className="px-6 py-3 border border-white/15 text-neutral-200 rounded-lg text-sm font-medium hover:bg-white/5 transition"
                >
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-6 text-center text-xs text-neutral-500">
        Built with Next.js, Convex & Clerk.
        <br />
        <a
          href="https://vikas-saini.tech/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-rose-400 ml-1"
        >
          My Portfolio
        </a>
      </footer>
    </div>
  );
}
