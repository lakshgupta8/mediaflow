import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Inter } from "next/font/google";
import "./globals.css";
import { ReduxProvider } from "@/components/ReduxProvider";
import { Providers } from "@/components/Providers";
import { AuthProvider } from "@/components/AuthProvider";
import { PreferencesSync } from "@/components/PreferencesSync";
import { AppShell } from "@/components/layout/AppShell";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "MediaFlow · Every source, one place",
    template: "%s · MediaFlow",
  },
  description: "Find where to stream, rent or buy any movie or series across every service in your region.",
};

export const viewport: Viewport = {
  themeColor: "#050a06",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${bricolage.variable} ${inter.variable}`}>
      <body className="bg-background-dark min-h-dvh font-sans text-fg antialiased">
        <ReduxProvider>
          <AuthProvider>
            <Providers>
              <PreferencesSync />
              <AppShell>{children}</AppShell>
            </Providers>
          </AuthProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
