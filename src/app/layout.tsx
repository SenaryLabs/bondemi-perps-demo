import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { TopNav } from "@/components/layout/top-nav";
import { WalletProvider } from "@/context/wallet-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bondemi | Institutional Grade Perps",
  description: "Advanced perpetual futures trading platform for institutional capital.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <WalletProvider>
          <div className="flex flex-col h-screen overflow-hidden">
            <TopNav />
            <div className="flex-1 overflow-hidden relative">
              {children}
            </div>
          </div>
        </WalletProvider>
      </body>
    </html>
  );
}
