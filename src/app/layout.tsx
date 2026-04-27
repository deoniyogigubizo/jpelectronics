import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from '@/context/LanguageContext';
import { CartProvider } from '@/context/CartContext';
import BottomNavbar from '@/components/BottomNavbar';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <LanguageProvider>
          <CartProvider>
            <div className="min-h-screen pb-20 md:pb-0">
              {children}
            </div>
            <BottomNavbar />
          </CartProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}