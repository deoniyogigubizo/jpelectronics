import type { Metadata } from "next";
import { Geist, Geist_Mono, Share_Tech_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from '@/components/Providers';
import BottomNavbar from '@/components/BottomNavbar';
import WhatsAppIcon from '@/components/WhatsAppIcon';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const shareTechMono = Share_Tech_Mono({
  variable: "--font-share-tech-mono",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "JP Tech — Electronics Store Rwanda",
  description: "Your trusted electronics marketplace in Rwanda. Shop smartphones, laptops, TVs, appliances, wearables, solar products and more.",
  keywords: "electronics, rwanda, smartphones, laptops, kigali, tech store",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} ${shareTechMono.variable} antialiased`}>
        <Providers>
          <div className="min-h-screen pb-20 md:pb-0">
            {children}
          </div>
          <BottomNavbar />
          <WhatsAppIcon />
        </Providers>
      </body>
    </html>
  );
}