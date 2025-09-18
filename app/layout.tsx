import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { Toaster } from 'sonner';
import SessionProvider from '@/components/providers/SessionProvider';

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  display: 'swap'
})

export const metadata: Metadata = {
  title: "Resource Mobilization System (RMS)",
  description: "A platform to manage and mobilize resources effectively.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.className} antialiased`}>
        <SessionProvider>
          {children}
          <Toaster richColors closeButton position="top-center" />
        </SessionProvider>
      </body>
    </html>
  );
}
