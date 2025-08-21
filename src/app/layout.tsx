import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { validateConfig } from "@/config";
import { handleUncaughtError } from "@/lib/errors";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "Setu DataFlow Operations",
    template: "%s | Setu DataFlow Operations",
  },
  description: "Production-ready monitoring dashboard for Setu ETL routines and data operations",
  keywords: ["ETL", "Data Operations", "Monitoring", "Setu", "Dashboard"],
  authors: [{ name: "Setu Engineering Team" }],
  creator: "Setu",
  publisher: "Setu",
  robots: {
    index: false, // Prevent indexing of internal dashboard
    follow: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "Setu DataFlow Operations",
    description: "Production-ready monitoring dashboard for Setu ETL routines",
    siteName: "Setu DataFlow Operations",
  },
  twitter: {
    card: "summary_large_image",
    title: "Setu DataFlow Operations",
    description: "Production-ready monitoring dashboard for Setu ETL routines",
  },
  metadataBase: new URL(process.env.NEXTAUTH_URL || 'http://localhost:3000'),
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

// Validate configuration on startup
if (typeof window === 'undefined') {
  try {
    validateConfig();
  } catch (error) {
    console.error('Configuration validation failed:', error);
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
}

// Global error handlers
if (typeof window === 'undefined') {
  process.on('uncaughtException', handleUncaughtError);
  process.on('unhandledRejection', (reason) => {
    handleUncaughtError(new Error(`Unhandled Rejection: ${reason}`));
  });
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        {/* Security headers */}
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-Frame-Options" content="DENY" />
        <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
        
        {/* Performance hints */}
        <meta name="format-detection" content="telephone=no" />
      </head>
      <body className={`${inter.className} min-h-screen bg-background font-sans antialiased`}>
        <ErrorBoundary>
          <div id="app-root">
            {children}
          </div>
        </ErrorBoundary>
        
        {/* Development tools */}
        {process.env.NODE_ENV === 'development' && (
          <div id="development-tools" />
        )}
      </body>
    </html>
  );
}
