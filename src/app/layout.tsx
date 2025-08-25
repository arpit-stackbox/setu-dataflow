import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { validateConfig } from "@/config";
import { handleUncaughtError } from "@/lib/errors";
import { AppLayout } from "@/components/layout/AppLayout";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

// Averta Standard custom font configuration
const averta = localFont({
  src: [
    {
      path: "../../public/fonts/avertastd-light.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../public/fonts/avertastd-lightitalic.otf",
      weight: "300",
      style: "italic",
    },
    {
      path: "../../public/fonts/avertastd-regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/avertastd-regularitalic.otf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../../public/fonts/avertastd-semibold.otf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/fonts/avertastd-semibolditalic.otf",
      weight: "600",
      style: "italic",
    },
    {
      path: "../../public/fonts/avertastd-bold.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/avertastd-bolditalic.otf",
      weight: "700",
      style: "italic",
    },
    {
      path: "../../public/fonts/avertastd-extrabold.otf",
      weight: "800",
      style: "normal",
    },
    {
      path: "../../public/fonts/avertastd-extrabolditalic.otf",
      weight: "800",
      style: "italic",
    },
  ],
  variable: "--font-averta",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Setu DataFlow Operations",
    template: "%s | Setu DataFlow Operations",
  },
  description:
    "Production-ready monitoring dashboard for Setu ETL routines and data operations",
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
  metadataBase: new URL(process.env.NEXTAUTH_URL || "http://localhost:3000"),
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
if (typeof window === "undefined") {
  try {
    validateConfig();
  } catch (error) {
    console.error("Configuration validation failed:", error);
    if (process.env.NODE_ENV === "production") {
      process.exit(1);
    }
  }
}

// Global error handlers - avoid duplicate listeners in development
if (typeof window === "undefined") {
  // Check if we already have our custom error handlers to avoid duplicates
  const existingUncaughtListeners = process.listeners("uncaughtException");
  const existingRejectionListeners = process.listeners("unhandledRejection");

  // Only add if our handlers aren't already registered
  const hasCustomUncaughtHandler = existingUncaughtListeners.some(
    (listener) =>
      listener.name === "handleUncaughtError" ||
      listener === handleUncaughtError
  );

  const hasCustomRejectionHandler = existingRejectionListeners.some(
    (listener) => listener.toString().includes("handleUncaughtError")
  );

  if (!hasCustomUncaughtHandler) {
    process.on("uncaughtException", handleUncaughtError);
  }

  if (!hasCustomRejectionHandler) {
    process.on("unhandledRejection", (reason) => {
      handleUncaughtError(new Error(`Unhandled Rejection: ${reason}`));
    });
  }

  // Increase max listeners to handle hot reloading in development
  if (process.env.NODE_ENV === "development") {
    process.setMaxListeners(20);
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${averta.variable} ${inter.variable}`}>
      <head>
        {/* Security headers */}
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-Frame-Options" content="DENY" />
        <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />

        {/* Performance hints */}
        <meta name="format-detection" content="telephone=no" />
      </head>
      <body
        className={`${averta.className} min-h-screen bg-background font-sans antialiased`}
      >
        <ErrorBoundary>
          <AppLayout>{children}</AppLayout>
        </ErrorBoundary>

        {/* Development tools */}
        {process.env.NODE_ENV === "development" && (
          <div id="development-tools" />
        )}
      </body>
    </html>
  );
}
