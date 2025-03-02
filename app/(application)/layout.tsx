import type { Metadata } from "next";
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: "NCD Navigator",
  description: "A tool to help you navigate the NCD landscape",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const session = await auth();
  const role = session?.user?.role;

  if (session && role === 'Admin') {
    return redirect('/admin/dashboard');
  } else if (session && role === 'User') {
    return redirect('/dashboard');
  } 

  return (
    <main>
      <Header />
      {children}
      <Footer />
    </main>
  );
}
