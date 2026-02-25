import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/sidebar";
import { MobileNav } from "@/components/mobile-nav";
import { SocialLinks } from "@/components/social-links";
import { Separator } from "@/components/ui/separator";
import { PageTransition } from "@/components/page-transition";
import { AuthProvider } from "@/context/auth-context";
import { PostHogProvider } from "@/components/posthog-provider";
import { ToastProvider } from "@/components/toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://idriss-bhugeloo.labkreol.re"),
  title: {
    default: "Idriss Bhugeloo",
    template: "%s — Idriss Bhugeloo",
  },
  description:
    "Ingénieur télécom et systèmes basé à La Réunion. Développement web, homelab Proxmox, trail et investissement.",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "Idriss Bhugeloo",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <PostHogProvider>
        <AuthProvider>
        <ToastProvider>
        <div className="flex min-h-screen flex-col md:flex-row max-w-7xl mx-auto">
          {/* Mobile Header */}
          <div className="md:hidden flex items-center justify-between p-4 border-b bg-background sticky top-0 z-50">
            <MobileNav />
            <span className="font-semibold text-lg">Idriss Bhugeloo</span>
            <div className="w-9" /> {/* Spacer for centering if needed, or just empty */}
          </div>

          <Sidebar />

          <main className="flex-1 p-6 md:p-12 lg:p-16 max-w-2xl w-full flex flex-col">
            <div className="flex-1">
              <PageTransition>{children}</PageTransition>
            </div>

            <div className="mt-8 space-y-8">
              <Separator />
              <SocialLinks />
            </div>
          </main>
        </div>
        </ToastProvider>
        </AuthProvider>
        </PostHogProvider>
      </body>
    </html>
  );
}
