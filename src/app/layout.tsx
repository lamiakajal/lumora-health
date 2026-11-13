import type { Metadata, Viewport } from "next";
import { Suspense, type ReactNode } from "react";
import { Manrope, Sora } from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { TopBar } from "@/components/layout/top-bar";
import { AppProviders } from "@/components/providers/app-providers";
import { BackToTop } from "@/components/ui/back-to-top";
import { PageLoader } from "@/components/ui/page-loader";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { siteConfig } from "../../site.config";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} | ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.developer.name, url: siteConfig.developer.url }],
  creator: siteConfig.developer.name,
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${manrope.variable} ${sora.variable}`}
    >
      <body
        suppressHydrationWarning
        className="min-h-dvh bg-background font-sans text-foreground antialiased"
      >
        <AppProviders>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-120 focus:rounded-full focus:bg-primary focus:px-5 focus:py-2.5 focus:font-semibold focus:text-primary-foreground"
          >
            Skip to main content
          </a>
          <PageLoader />
          <ScrollProgress />
          <TopBar />
          <Suspense fallback={<div className="h-72px border-b" aria-hidden="true" />}>
            <Navbar />
          </Suspense>
          {children}
          <Footer />
          <BackToTop />
        </AppProviders>
      </body>
    </html>
  );
}
