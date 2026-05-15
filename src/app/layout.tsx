import type { Metadata } from "next";
import "./globals.css";
import { Web3Provider } from "@/lib/web3-provider";

export const metadata: Metadata = {
  title: "Tennis Rally on Arc",
  description: "Arcade tennis game on Arc Testnet with on-chain score submission",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Web3Provider>{children}</Web3Provider>
      </body>
    </html>
  );
}
