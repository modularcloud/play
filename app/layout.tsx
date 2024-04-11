import type { Metadata } from "next";
import "./globals.css";
import { GeistSans } from "geist/font/sans";

export const metadata: Metadata = {
  title: {
    template: "%s | TwiXChain",
    default: "TwiXChain"
  },
  description: "A demo of an app in the blockchain by Modular Cloud"
};

export const runtime = "edge";

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={GeistSans.className}>{children}</body>
    </html>
  );
}
