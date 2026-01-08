import type { Metadata } from "next";
import Script from "next/script";
import {
  Libre_Baskerville,
  Source_Sans_3,
  JetBrains_Mono,
} from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import "./globals.css";

const libreBaskerville = Libre_Baskerville({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

const sourceSans = Source_Sans_3({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "600"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://pproenca.dev"
  ),
  title: {
    default: "pproenca.dev",
    template: "%s | pproenca.dev",
  },
  description: "A personal blog about web development and technology.",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "pproenca.dev",
  },
  twitter: {
    card: "summary",
    creator: "@ThePedroProenca",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {process.env.NODE_ENV === "development" && (
          <Script
            src="https://unpkg.com/react-grab/dist/index.global.js"
            crossOrigin="anonymous"
            strategy="lazyOnload"
          />
        )}
      </head>
      <body
        className={`${libreBaskerville.variable} ${sourceSans.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-(--color-bg-elevated) focus:px-4 focus:py-2 focus:text-(--color-accent)"
        >
          Skip to main content
        </a>
        <ThemeProvider>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main
              id="main-content"
              className="mx-auto w-full max-w-[680px] flex-1 px-golden-3 py-golden-5"
            >
              {children}
            </main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
