import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Providers } from "@/providers/providers";
import { Toaster } from "@/components/ui/sonner";
import { SidebarProvider } from "@/providers/SidebarContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Realtime Messenger",
  description:
    "A real-time messaging app built with Next.js, Clerk, and Convex.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <SidebarProvider>
            <Providers>
              {children}

              <Toaster />
            </Providers>
          </SidebarProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
