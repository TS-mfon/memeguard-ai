import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MemeGuard AI",
  description: "AI trust briefs for memecoin launches on BNB Chain."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
