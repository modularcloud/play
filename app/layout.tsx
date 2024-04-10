import type { Metadata } from "next";
import "./globals.css";
import { GeistSans } from "geist/font/sans";
import { TailwindIndicator } from "~/components/tailwind-indicator";

export const metadata: Metadata = {
  title: {
    template: "%s | TwiXChain",
    default: "TwiXChain"
  },
  description: "A demo of an app in the blockchain by Modular Cloud"
};

export const runtime = "edge";
export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={GeistSans.className}>
        {children}

        <TailwindIndicator />
      </body>
    </html>
  );
}
