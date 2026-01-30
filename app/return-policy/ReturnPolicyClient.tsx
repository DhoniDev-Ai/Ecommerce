"use client";

import { motion } from "@/lib/framer";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ArrowLeft, ArrowRight, RefreshCw, ShieldCheck, AlertCircle, Clock, Mail } from "lucide-react";
import Link from "next/link";

export function ReturnPolicyClient() {
    return (
        <div className="min-h-screen bg-[#FDFBF7] flex flex-col selection:bg-[#5A7A6A]/10 font-sans">
            <Header />

            <main className="grow pt-32 pb-20 px-6 relative z-10">
                <div className="max-w-4xl mx-auto">
                    {/* Header Section */}
                    <div className="mb-16">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-bold text-[#9AA09A] hover:text-[#5A7A6A] transition-colors mb-8"
                        >
                            <ArrowLeft className="w-3 h-3" /> Back to Sanctuary
                        </Link>

                        <motion.h1
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-4xl md:text-5xl font-heading text-[#2D3A3A] mb-6 tracking-tight"
                        >
                            Return & <span className="italic font-serif text-[#5A7A6A]">Refund Policy</span>
                        </motion.h1>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#7A8A8A]"
                        >
                            <Clock className="w-3.5 h-3.5" />
                            <span>Last Updated: January 2025</span>
                        </motion.div>
                    </div>

                    {/* Policy Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="prose prose-stone max-w-none prose-headings:font-heading prose-headings:tracking-wide prose-headings:text-[#2D3A3A] prose-p:text-[#5A6A6A] prose-p:leading-relaxed prose-li:text-[#5A6A6A]"
                    >
                        <div className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-[#E8E6E2] shadow-sm mb-12">
                            <p className="text-lg font-light text-[#2D3A3A]">
                                At <strong className="text-[#5A7A6A]">Ayuniv</strong>, we curate our rituals and elixirs with the utmost intention and purity. We want your journey with us to be harmonious. However, if an artifact does not align with your path, we offer a transparent process for returns and exchanges.
                            </p>
                        </div>

                        {/* 1. Eligibility */}
                        <div className="mb-12">
                            <h2 className="flex items-center gap-3 text-2xl mb-6">
                                <div className="p-2 bg-[#5A7A6A]/10 rounded-full text-[#5A7A6A]">
                                    <ShieldCheck className="w-5 h-5" />
                                </div>
                                Eligibility for Returns
                            </h2>
                            <p>
                                To be eligible for a return, your item must meet the following criteria:
                            </p>
                            <ul className="space-y-2 mt-4 ml-6 list-disc marker:text-[#5A7A6A]">
                                <li>The item must be <strong>unused</strong> and in the same condition that you received it.</li>
                                <li>It must be in the <strong>original packaging</strong> with all seals intact.</li>
                                <li>You must initiate the return request within <strong>7 days</strong> of delivery.</li>
                                <li>Proof of purchase (Order ID or Receipt) is required.</li>
                            </ul>
                        </div>

                        {/* 2. Non-Returnable Items */}
                        <div className="mb-12">
                            <h2 className="flex items-center gap-3 text-2xl mb-6">
                                <div className="p-2 bg-amber-50 rounded-full text-amber-600">
                                    <AlertCircle className="w-5 h-5" />
                                </div>
                                Non-Returnable Items
                            </h2>
                            <p>
                                Certain types of goods are exempt from being returned for hygiene and safety reasons:
                            </p>
                            <ul className="space-y-2 mt-4 ml-6 list-disc marker:text-amber-600">
                                <li>Perishable goods such as certain herbal blends or fresh ingredients.</li>
                                <li>Personal care items that have been opened or used (e.g., oils, creams).</li>
                                <li>Gift cards and promotional items.</li>
                            </ul>
                        </div>

                        {/* 3. The Process */}
                        <div className="mb-12">
                            <h2 className="flex items-center gap-3 text-2xl mb-6">
                                <div className="p-2 bg-blue-50 rounded-full text-blue-600">
                                    <RefreshCw className="w-5 h-5" />
                                </div>
                                How to Initiate a Return
                            </h2>
                            <div className="grid md:grid-cols-2 gap-6 not-prose">
                                <div className="p-6 bg-[#F3F5F3] rounded-3xl border border-[#E8E6E2]">
                                    <span className="block text-4xl font-heading text-[#5A7A6A]/20 mb-2">01</span>
                                    <h3 className="font-bold text-[#2D3A3A] mb-2">Contact Us</h3>
                                    <p className="text-sm text-[#5A6A6A]">Email <a href="mailto:support@ayuniv.com" className="text-[#5A7A6A] underline">support@ayuniv.com</a> or create a ticket in your dashboard with your Order ID and reason for return.</p>
                                </div>
                                <div className="p-6 bg-[#F3F5F3] rounded-3xl border border-[#E8E6E2]">
                                    <span className="block text-4xl font-heading text-[#5A7A6A]/20 mb-2">02</span>
                                    <h3 className="font-bold text-[#2D3A3A] mb-2">Approval & Shipping</h3>
                                    <p className="text-sm text-[#5A6A6A]">Once approved, we will provide instructions. You may need to ship the item back to our sanctuary (Reverse Pickup available in select pincodes).</p>
                                </div>
                                <div className="p-6 bg-[#F3F5F3] rounded-3xl border border-[#E8E6E2]">
                                    <span className="block text-4xl font-heading text-[#5A7A6A]/20 mb-2">03</span>
                                    <h3 className="font-bold text-[#2D3A3A] mb-2">Inspection</h3>
                                    <p className="text-sm text-[#5A6A6A]">Upon receipt, we will inspect the item. We will notify you of the approval or rejection of your refund.</p>
                                </div>
                                <div className="p-6 bg-[#F3F5F3] rounded-3xl border border-[#E8E6E2]">
                                    <span className="block text-4xl font-heading text-[#5A7A6A]/20 mb-2">04</span>
                                    <h3 className="font-bold text-[#2D3A3A] mb-2">Refund</h3>
                                    <p className="text-sm text-[#5A6A6A]">If approved, your refund will be processed to your original method of payment within 5-7 business days.</p>
                                </div>
                            </div>
                        </div>

                        {/* 4. Damaged Items */}
                        <div className="bg-[#2D3A3A] p-8 md:p-12 rounded-[2.5rem] text-white">
                            <h2 className="text-2xl font-heading mb-4 text-white">Damaged or Defective Artifacts?</h2>
                            <p className="text-white/80 mb-6">
                                In the rare event that your ritual items arrive damaged, please notify us within <strong>24 hours</strong> of delivery. Send us photos of the damaged item and packaging.
                            </p>
                            <Link
                                href="/contact"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#2D3A3A] rounded-full text-xs font-bold uppercase tracking-widest hover:bg-[#5A7A6A] hover:text-white transition-all"
                            >
                                Report an Issue <ArrowRight className="w-3 h-3" />
                            </Link>
                        </div>

                        {/* Contact Info */}
                        <div className="mt-16 text-center border-t border-[#E8E6E2] pt-12">
                            <p className="text-sm text-[#7A8A8A] mb-2 uppercase tracking-widest font-bold">Have Questions?</p>
                            <a href="mailto:support@ayuniv.com" className="text-xl font-heading text-[#2D3A3A] hover:text-[#5A7A6A] transition-colors flex items-center justify-center gap-2">
                                <Mail className="w-5 h-5" /> support@ayuniv.com
                            </a>
                        </div>
                    </motion.div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
