import type { Metadata, Viewport } from "next";
import Script from "next/script";
import {
  Libre_Baskerville,
  Source_Sans_3,
  JetBrains_Mono,
} from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { Header } from "@/components/Header";
import { SITE_CONFIG, ROUTES } from "@/lib/constants";
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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4f1e8" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0908" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
  title: {
    default: SITE_CONFIG.title,
    template: `%s | ${SITE_CONFIG.title}`,
  },
  description: SITE_CONFIG.description,
  authors: [{ name: SITE_CONFIG.author.name, url: SITE_CONFIG.author.url }],
  creator: SITE_CONFIG.author.name,
  publisher: SITE_CONFIG.author.name,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-32x32.svg", sizes: "32x32", type: "image/svg+xml" },
      { url: "/favicon-16x16.svg", sizes: "16x16", type: "image/svg+xml" },
    ],
    apple: [{ url: "/apple-touch-icon.svg", sizes: "180x180" }],
  },
  manifest: "/site.webmanifest",
  openGraph: {
    type: "website",
    locale: SITE_CONFIG.locale,
    siteName: SITE_CONFIG.name,
    title: SITE_CONFIG.title,
    description: SITE_CONFIG.description,
    url: SITE_CONFIG.url,
  },
  twitter: {
    card: "summary_large_image",
    creator: SITE_CONFIG.author.twitter,
    site: SITE_CONFIG.author.twitter,
  },
  alternates: {
    canonical: ROUTES.home,
    types: {
      "application/rss+xml": ROUTES.feed.rss,
      "application/atom+xml": ROUTES.feed.atom,
      "application/feed+json": ROUTES.feed.json,
    },
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
        {process.env.NODE_ENV === "development" && (
          <Script
            src="https://unpkg.com/react-grab/dist/index.global.js"
            crossOrigin="anonymous"
            strategy="lazyOnload"
          />
        )}
      </head>
      <body
        className={`${libreBaskerville.variable} ${sourceSans.variable} ${jetbrainsMono.variable} bg-bg-deep text-text-primary font-sans antialiased transition-colors duration-200`}
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-bg-elevated focus:px-4 focus:py-2 focus:text-accent"
        >
          Skip to main content
        </a>
        <NextThemesProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex min-h-screen flex-col">
            <Header />
            <main
              id="main-content"
              className="mx-auto w-full flex-1 px-5 py-8 sm:px-6 sm:py-10 md:max-w-2xl lg:max-w-[680px] lg:px-golden-3 lg:py-golden-5"
            >
              {children}
            </main>
            <footer className="border-t border-border-subtle/30">
              <div className="mx-auto px-5 py-4 text-center text-xs text-text-tertiary sm:px-6 md:max-w-2xl lg:max-w-[680px] lg:px-golden-3 lg:py-golden-3">
                <p>&copy; {new Date().getFullYear()} pproenca.dev</p>
              </div>
            </footer>
          </div>
        </NextThemesProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
