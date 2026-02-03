import AdminGuard from '@/components/admin/AdminGuard';
import { AdminNav } from '@/components/admin/AdminNav';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AdminGuard>
            <div className="flex flex-col md:flex-row min-h-screen bg-[#F3F1ED]">
                <AdminNav />

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col min-w-0">
                    <main className="flex-1 p-4 md:p-8 overflow-y-auto">
                        {children}
                    </main>
                </div>
            </div>
        </AdminGuard>
    );
}
