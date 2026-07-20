import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/lib/theme-context";
import { AuthProvider } from "@/lib/auth-context";
import { NotificationProvider } from "@/lib/notification-context";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "The Opportunity Registry | AI-Powered Global Opportunities Platform",
  description: "Discover life-changing scholarships, remote tech jobs, internships, fellowships, grants, and online certifications. Tailored for you with intelligent AI matching.",
  keywords: ["scholarships", "fellowships", "remote jobs", "internships", "grants", "AI career advisor", "CV checker"],
  openGraph: {
    title: "The Opportunity Registry | AI-Powered Global Opportunities Platform",
    description: "Discover educational, professional, and career opportunities from around the world.",
    type: "website",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-slate-50 dark:bg-darkbg text-slate-900 dark:text-slate-100 transition-colors duration-300 relative">
        <ThemeProvider>
          <AuthProvider>
            <NotificationProvider>
              {/* Fixed ambient glow elements */}
              <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none select-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-brand-500/5 dark:bg-brand-500/10 blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-indigo-500/5 dark:bg-indigo-500/8 blur-[100px]" />
                <div className="absolute top-[30%] right-[10%] w-[30vw] h-[30vw] rounded-full bg-purple-500/3 dark:bg-purple-500/6 blur-[120px]" />
              </div>
              <Navbar />
              <main className="flex-grow">
                {children}
              </main>
              <Footer />
            </NotificationProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
