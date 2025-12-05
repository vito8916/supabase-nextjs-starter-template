import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://supanext-starter-kit2.vercel.app'),
  title: "SupaNext Starter Kit 2",
  description: "A modern starter kit powered by Supabase and Next.js.",
  openGraph: {
    title: "SupaNext Starter Kit 2",
    description: "A modern starter kit powered by Supabase and Next.js.",
    images: "/assets/images/bento-features.png",
    url: "https://supanext-starter-kit2.vercel.app",
    siteName: "SupaNext Starter Kit 2",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    images: "/assets/images/bento-features.png",
    title: "SupaNext Starter Kit 2",
    description: "A modern starter kit powered by Supabase and Next.js.",
    creator: "@vito8916",
  },
};

/**
 * Root layout applied to the entire app (public + protected routes).
 * Sets fonts, theme provider, and global toasts.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased  w-full min-h-screen`}
      >
       <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Toaster position="top-right" />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
