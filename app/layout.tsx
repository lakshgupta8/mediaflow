import type { Metadata } from "next";
import { Spline_Sans } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { ReduxProvider } from "@/components/ReduxProvider";

const splineSans = Spline_Sans({
  variable: "--font-spline-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "MediaFlow - Desktop App",
  description: "A dynamic movie search and catalog application.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${splineSans.variable} font-display antialiased overflow-hidden h-screen flex`}
      >
        <ReduxProvider>
          <Sidebar />
          <main className="relative flex flex-col flex-1 h-full overflow-hidden">
            <Header />
            <div className="flex-1 pb-10 overflow-x-hidden overflow-y-auto">
              {children}

              <footer className="mt-8 pt-8 pb-12 border-white/5 border-t text-slate-500 text-sm text-center">
                <p>© {(new Date()).getFullYear()} MediaFlow. All rights reserved.</p>
                <div className="flex justify-center gap-4 mt-2">
                  <a className="hover:text-primary" href="#">Privacy Policy</a>
                  <a className="hover:text-primary" href="#">Terms of Service</a>
                  <a className="hover:text-primary" href="#">Help Center</a>
                </div>
              </footer>
            </div>
          </main>
        </ReduxProvider>
      </body>
    </html>
  );
}
