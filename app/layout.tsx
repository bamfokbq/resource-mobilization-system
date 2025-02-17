import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { Toaster } from 'sonner';
import { after } from 'next/server';

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
  after(() => {
    // Execute after the layout is rendered and sent to the user
    console.log('Layout rendered');
  })

  return (
    <html lang="en">
      <body
        className={`${outfit.className} antialiased`}
      >
        {children}
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
