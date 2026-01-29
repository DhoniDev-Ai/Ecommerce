import Link from 'next/link';
import AdminGuard from '@/components/admin/AdminGuard';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Note: Logging user info here is harder on server without session.
    // We rely on AdminGuard for protection now.

    return (
        <AdminGuard>
            <div className="flex min-h-screen bg-gray-50">
                {/* Sidebar */}
                <aside className="w-64 bg-white border-r border-gray-200 hidden md:block shrink-0">
                    <div className="h-16 flex items-center px-6 border-b border-gray-200">
                        <span className="font-juana text-xl font-bold text-green-900">Ayuniv Admin</span>
                    </div>
                    <nav className="p-4 space-y-1">
                        <AdminNavLink href="/admin" label="Dashboard" icon="LayoutDashboard" />
                        <AdminNavLink href="/admin/orders" label="Orders" icon="ShoppingBag" />
                        <AdminNavLink href="/admin/products" label="Products" icon="Package" />
                        <AdminNavLink href="/admin/customers" label="Customers" icon="Users" />
                        <AdminNavLink href="/" label="Back to Store" icon="ArrowLeft" className="mt-8 text-gray-500 hover:text-gray-900" />
                    </nav>
                </aside>

                {/* Mobile Header & Content */}
                <div className="flex-1 flex flex-col min-w-0">
                    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-8">
                        <div className="md:hidden font-juana text-lg font-bold text-green-900">Ayuniv Admin</div>
                        <div className="flex items-center gap-4 ml-auto">
                            <span className="text-sm text-gray-600 hidden sm:inline-block">
                                Administrator
                            </span>
                        </div>
                    </header>

                    <main className="flex-1 p-4 md:p-8 overflow-y-auto">
                        {children}
                    </main>
                </div>
            </div>
        </AdminGuard>
    );
}

function AdminNavLink({ href, label, icon, className = "" }: { href: string; label: string; icon: string, className?: string }) {
    return (
        <Link
            href={href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-green-50 hover:text-green-800 transition-colors ${className}`}
        >
            {/* Simple Icon Placeholder using Lucide names logic if we add icons later */}
            <span>{label}</span>
        </Link>
    );
}
