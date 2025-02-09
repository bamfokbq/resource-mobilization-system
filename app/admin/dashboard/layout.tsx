import AdminDashboardLinks from '@/components/features/AdminDashboardLinks';
import Header from '@/components/shared/Header';



export default function AdminDashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <section>
            <Header variant="admin" />
            <section className='min-h-[90dvh] flex'>
                <AdminDashboardLinks />
                <div className='bg-ligher-gray w-full p-2 font-bold md:p-4'>
                    {children}
                </div>
            </section>
        </section>
    );
}
