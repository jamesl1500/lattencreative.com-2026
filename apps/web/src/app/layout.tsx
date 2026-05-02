import type { Metadata } from "next";
import { Space_Grotesk, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { siteConfig } from "@/lib/site-content";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: siteConfig.siteName,
    template: `%s | ${siteConfig.siteName}`,
  },
  description: siteConfig.description,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${plusJakarta.variable}`}>
      <body>
        <Header
          siteName={siteConfig.siteName}
          navigation={siteConfig.nav}
          ctaButton={siteConfig.ctaButton}
        />
        {children}
        <Footer
          siteName={siteConfig.siteName}
          footerText={siteConfig.footerText}
          navigation={siteConfig.nav}
          socialLinks={siteConfig.socialLinks}
          contactEmail={siteConfig.contactEmail}
        />
      </body>
    </html>
  );
}
