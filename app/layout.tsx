import type { Metadata } from "next";
import { Tajawal } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getSession } from "@/lib/auth";

// Force dynamic rendering to prevent caching
export const dynamic = 'force-dynamic';

const tajawal = Tajawal({
  variable: "--font-tajawal",
  subsets: ["arabic"],
  weight: ["300", "400", "500", "700", "900"],
});

export const metadata: Metadata = {
  title: "Health Volunteer Ambassadors Platform",
  description: "The National Volunteer Program is a comprehensive national initiative aimed at organizing volunteer work in Saudi Arabia. It is one of the programs that achieves the goals of Saudi Vision 2030 by increasing volunteer rates, developing the volunteer sector, and providing a unified platform for all volunteer opportunities.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();

  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${tajawal.variable} font-sans h-full antialiased`}
    >
      <head>
      </head>
      <body className="min-h-full flex flex-col">
        <Navbar user={session} />
        {children}
        <Footer />
      </body>
    </html>
  );
}
