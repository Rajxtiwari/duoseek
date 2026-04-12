import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import AppShell from "@/components/AppShell";

export const metadata: Metadata = {
  title: "DuoSeek – Find Your Perfect Gaming Duo",
  description: "DuoSeek connects verified gamers through smart random matchmaking. Share gameplay reels, link your Riot ID or Steam, and find your perfect duo instantly.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased bg-zinc-950 min-h-screen">
        <Suspense fallback={<div className="min-h-screen bg-zinc-950" />}>
          <AppShell>{children}</AppShell>
        </Suspense>
      </body>
    </html>
  );
}
