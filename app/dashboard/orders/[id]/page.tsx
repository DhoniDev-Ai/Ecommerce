"use client";
import { motion } from "@/lib/framer";
import { ChevronLeft, MapPin, CreditCard, Package, Truck, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { cn } from "@/utils/cn";

// Sample Data for the Single Order View
const orderDetail = {
    id: "AYU-9283-JK",
    date: "22 Jan 2026",
    status: "In Transit",
    tracking: [
        { state: "Sanctuary Arrival", desc: "Estimated by 25 Jan", date: "Pending", done: false },
        { state: "In Transit", desc: "Departed Jaipur Sorting Hub", date: "23 Jan, 10:15 AM", done: true },
        { state: "Ritual Prepared", desc: "Cold-pressed & Sealed in Jaipur", date: "22 Jan, 04:30 PM", done: true },
        { state: "Order Confirmed", desc: "Awaiting Alchemy", date: "22 Jan, 09:00 AM", done: true },
    ],
    address: {
        name: "Aravind Sharma",
        line: "14, C-Scheme, Ashok Nagar",
        city: "Jaipur, Rajasthan 302001"
    },
    payment: {
        method: "Cashfree",
        ref: "CF_928310293",
        subtotal: 4200,
        shipping: 250,
        tax: 140,
        total: 4590
    },
    items: [
        { name: "Sea Buckthorn Elixir", qty: 1, price: 2400, img: "/assets/product-1.png" },
        { name: "Shatavari Vitality", qty: 1, price: 1800, img: "/assets/product-2.png" }
    ]
};

export default function OrderDetailPage() {
    return (
        <section className="max-w-5xl space-y-12 pb-32">
            {/* Header Nav */}
            <header className="flex justify-between items-center">
                <Link href="/dashboard/orders" className="group flex items-center gap-2 text-[10px] uppercase tracking-[0.4em] text-[#7A8A8A] hover:text-[#5A7A6A] transition-colors">
                    <ChevronLeft className="w-3 h-3 transition-transform group-hover:-translate-x-1" /> Back to Archive
                </Link>
                <p className="text-[10px] uppercase tracking-[0.4em] text-[#7A8B7A] font-bold">Ritual Details</p>
            </header>

            <div className="grid lg:grid-cols-5 gap-12">

                {/* Left Column: Timeline & Items */}
                <div className="lg:col-span-3 space-y-12">

                    {/* Ritual Tracking Timeline */}
                    <div className="bg-white rounded-[3rem] p-10 border border-[#E8E6E2]/60 shadow-sm">
                        <h2 className="text-xl font-heading text-[#2D3A3A] mb-10">Ritual <span className="italic font-serif font-light text-[#5A7A6A]">Progress.</span></h2>
                        <div className="space-y-8 relative">
                            {/* The vertical line */}
                            <div className="absolute left-[11px] top-2 bottom-2 w-px bg-[#F3F1ED]" />

                            {orderDetail.tracking.map((step, i) => (
                                <div key={i} className="flex gap-6 relative">
                                    <div className={cn(
                                        "w-6 h-6 rounded-full border-4 border-white z-10 flex items-center justify-center",
                                        step.done ? "bg-[#5A7A6A] shadow-lg shadow-[#5A7A6A]/20" : "bg-[#F3F1ED]"
                                    )}>
                                        {step.done && <CheckCircle2 className="w-3 h-3 text-white" />}
                                    </div>
                                    <div>
                                        <p className={cn("text-xs font-bold uppercase tracking-widest", step.done ? "text-[#2D3A3A]" : "text-[#7A8A8A]/40")}>
                                            {step.state}
                                        </p>
                                        <p className="text-[11px] text-[#7A8A8A] font-light mt-1">{step.desc}</p>
                                        <p className="text-[9px] text-[#9AA09A] mt-2 font-medium uppercase tracking-tighter">{step.date}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Itemized List */}
                    <div className="space-y-4">
                        <p className="text-[10px] uppercase tracking-[0.3em] text-[#7A8A8A] font-bold ml-6">Your Selection</p>
                        {orderDetail.items.map((item, i) => (
                            <div key={i} className="bg-white rounded-[2.5rem] p-6 flex items-center justify-between border border-[#E8E6E2]/40">
                                <div className="flex items-center gap-6">
                                    <div className="w-20 h-20 bg-[#FDFBF7] rounded-2xl border border-[#E8E6E2] p-2 flex items-center justify-center">
                                        <img src={item.img} className="max-h-full object-contain" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-[#2D3A3A] uppercase tracking-wider">{item.name}</h4>
                                        <p className="text-xs text-[#7A8A8A] font-light">Quantity: {item.qty}</p>
                                    </div>
                                </div>
                                <p className="text-sm font-medium text-[#2D3A3A]">₹{item.price.toLocaleString()}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Column: Address & Payment Summary */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Shipping Card */}
                    <div className="bg-[#FDFBF7] border border-[#E8E6E2] rounded-[3rem] p-10">
                        <div className="flex items-center gap-4 mb-8">
                            <MapPin className="w-5 h-5 text-[#5A7A6A]" />
                            <h3 className="text-sm uppercase tracking-widest font-bold text-[#2D3A3A]">Sanctuary Base</h3>
                        </div>
                        <p className="text-base font-heading text-[#2D3A3A] mb-2">{orderDetail.address.name}</p>
                        <p className="text-sm text-[#7A8A8A] font-light leading-relaxed">
                            {orderDetail.address.line}<br />
                            {orderDetail.address.city}
                        </p>
                    </div>

                    {/* Payment Card */}
                    <div className="bg-white border border-[#E8E6E2]/60 rounded-[3rem] p-10 shadow-sm">
                        <div className="flex items-center gap-4 mb-8">
                            <CreditCard className="w-5 h-5 text-[#5A7A6A]" />
                            <h3 className="text-sm uppercase tracking-widest font-bold text-[#2D3A3A]">Alchemy Exchange</h3>
                        </div>

                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between text-xs text-[#7A8A8A]">
                                <span>Subtotal</span>
                                <span>₹{orderDetail.payment.subtotal.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-xs text-[#7A8A8A]">
                                <span>Shipping Ritual</span>
                                <span>₹{orderDetail.payment.shipping.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-xs text-[#7A8A8A]">
                                <span>Wellness Tax</span>
                                <span>₹{orderDetail.payment.tax.toLocaleString()}</span>
                            </div>
                            <div className="h-px bg-[#F3F1ED] my-2" />
                            <div className="flex justify-between text-lg font-heading text-[#2D3A3A]">
                                <span>Total</span>
                                <span>₹{orderDetail.payment.total.toLocaleString()}</span>
                            </div>
                        </div>

                        <div className="p-4 bg-[#FDFBF7] rounded-2xl border border-[#E8E6E2]">
                            <p className="text-[8px] uppercase tracking-widest text-[#9AA09A] font-bold mb-1">Paid via {orderDetail.payment.method}</p>
                            <p className="text-[10px] text-[#2D3A3A] font-medium font-mono">{orderDetail.payment.ref}</p>
                        </div>
                    </div>

                    {/* Help Section */}
                    <Link href="/contact" className="flex items-center justify-center gap-3 py-6 w-full border border-[#E8E6E2] rounded-full text-[9px] uppercase tracking-widest font-bold text-[#7A8A8A] hover:bg-[#F3F1ED] transition-all">
                        Ask about this Ritual
                    </Link>
                </div>
            </div>
        </section>
    );
}