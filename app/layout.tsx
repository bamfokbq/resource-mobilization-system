import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { Toaster } from 'sonner';
import { ReactScan } from '@/providers/ReactScan';

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  display: 'swap'
})

export const metadata: Metadata = {
  title: "NCD Navigator",
  description: "A tool to help you navigate the NCD landscape",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <ReactScan />
      <body className={`${outfit.className} antialiased`}>
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
