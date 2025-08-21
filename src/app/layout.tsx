import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Setu DataFlow Operations Dashboard",
  description:
    "Monitor and manage Setu ETL routines with comprehensive visibility into routine performance, status, and operational metrics.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
