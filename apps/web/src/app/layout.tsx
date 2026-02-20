import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { client } from "@/lib/sanity.client";
import { siteSettingsQuery } from "@/lib/sanity.queries";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

type SiteSettings = {
  siteName?: string;
  logo?: unknown;
  logoDark?: unknown;
  navigation?: { label: string; href: string }[];
  ctaButton?: { text?: string; link?: string };
  footerText?: string;
  socialLinks?: { platform: string; url: string }[];
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
};

export async function generateMetadata(): Promise<Metadata> {
  const settings = await client.fetch<SiteSettings>(siteSettingsQuery);
  return {
    title: {
      default: settings?.siteName ?? "Latten Creative",
      template: `%s | ${settings?.siteName ?? "Latten Creative"}`,
    },
    description:
      "We design & build modern digital experiences that elevate your brand.",
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await client.fetch<SiteSettings>(siteSettingsQuery);

  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <Header
          siteName={settings?.siteName}
          navigation={settings?.navigation}
          ctaButton={settings?.ctaButton}
        />
        {children}
        <Footer
          siteName={settings?.siteName}
          footerText={settings?.footerText}
          navigation={settings?.navigation}
          socialLinks={settings?.socialLinks}
          contactEmail={settings?.contactEmail}
        />
      </body>
    </html>
  );
}
