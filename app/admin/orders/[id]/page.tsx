
import { supabaseAdmin } from '@/lib/supabase/admin';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, MapPin, CreditCard, Package } from 'lucide-react';
import { OrderStatusSelect } from '@/components/admin/OrderStatusSelect';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function OrderDetailPage({ params }: { params: { id: string } }) {
    const { id } = await params;

    // Fetch Full Order Details
    const { data: orderResult, error } = await supabaseAdmin
        .from('orders')
        .select(`
            *,
            user:users (
                full_name,
                email,
                phone
            ),
            items:order_items (
                id,
                quantity,
                price_at_purchase,
                product:products (
                    name,
                    image_urls
                )
            )
        `)
        .eq('id', id)
        .single();

    const order = orderResult as any;

    if (error || !order) {
        console.error("Order Fetch Error:", error);
        return notFound();
    }

    // Parse Address JSON if needed (it's typed as Json in DB)
    const address = order.shipping_address as any;

    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin/orders" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <ArrowLeft className="h-5 w-5 text-gray-500" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold font-juana text-gray-900">Order #{order.id.slice(0, 8)}</h1>
                        <p className="text-sm text-gray-500">
                            Placed on {new Date(order.created_at).toLocaleString()}
                        </p>
                    </div>
                </div>
                <div className="flex gap-3">
                    {/* Status Actions */}
                    <OrderStatusSelect orderId={order.id} currentStatus={order.status} />
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {/* Main Content: Items */}
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                            <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                <Package className="h-4 w-4 text-green-700" />
                                Order Items
                            </h3>
                            <span className="text-sm text-gray-500">{order.items.length} items</span>
                        </div>
                        <div className="divide-y divide-gray-100">
                            {order.items.map((item: any) => (
                                <div key={item.id} className="p-6 flex gap-4">
                                    {/* Image Placeholder */}
                                    {item.product?.image_url && (
                                        <div className="h-16 w-16 bg-gray-100 rounded-lg shrink-0 relative overflow-hidden">
                                            <img src={item.product.image_url} alt={item.product?.name} className="object-cover h-full w-full" />
                                        </div>
                                    )}
                                    <div className="flex-1">
                                        <h4 className="font-medium text-gray-900">{item.product?.name || "Unknown Product"}</h4>
                                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium text-gray-900">₹{(item.price_at_purchase * item.quantity).toLocaleString()}</p>
                                        <p className="text-xs text-gray-400">₹{item.price_at_purchase} ea</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-500">Subtotal</span>
                                <span className="font-medium">₹{order.total_amount.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center text-lg font-bold mt-2 text-green-900">
                                <span>Total</span>
                                <span>₹{order.total_amount.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar: Customer & Info */}
                <div className="space-y-6">
                    {/* Customer */}
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 text-xs">
                                {order.user?.full_name?.charAt(0) || 'G'}
                            </div>
                            Customer
                        </h3>
                        <div className="space-y-3 text-sm">
                            <div>
                                <label className="text-xs text-gray-400 uppercase font-bold">Name</label>
                                <p className="font-medium text-gray-900">{order.user?.full_name || 'Guest'}</p>
                            </div>
                            <div>
                                <label className="text-xs text-gray-400 uppercase font-bold">Email</label>
                                <p className="text-gray-600 break-all">{order.user?.email}</p>
                            </div>
                            <div>
                                <label className="text-xs text-gray-400 uppercase font-bold">Phone</label>
                                <p className="text-gray-600">{order.user?.phone || 'N/A'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            Shipping Address
                        </h3>
                        {address ? (
                            <address className="not-italic text-sm text-gray-600 space-y-1">
                                <p className="font-medium text-gray-900">{address.fullName}</p>
                                <p>{address.addressLine1}</p>
                                {address.addressLine2 && <p>{address.addressLine2}</p>}
                                <p>{address.city}, {address.state} {address.pincode}</p>
                                <p className="mt-2 text-xs text-gray-400">Phone: {address.mobileNumber}</p>
                            </address>
                        ) : (
                            <p className="text-sm text-gray-400">No address details.</p>
                        )}
                    </div>

                    {/* Payment Info */}
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <CreditCard className="h-4 w-4 text-gray-400" />
                            Payment
                        </h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Method</span>
                                <span className="font-medium uppercase">{order.payment_method}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Status</span>
                                <span className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase ${order.payment_status === 'succeeded' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                    {order.payment_status}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
