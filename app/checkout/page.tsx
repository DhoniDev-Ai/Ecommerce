"use client";
import { useState, useEffect, useMemo } from "react";
import {
    ShieldCheck, Loader2, MapPin, Plus, Ticket, CheckCircle2,
    AlertCircle, Minus, Trash2, ShoppingBag, Mail, Sparkles, Flag, ArrowRight, Pencil
} from "lucide-react";
import { cn } from "@/utils/cn";
import { useCartContext } from "@/context/CartContext";
import { supabase } from "@/lib/supabase/client";
import { Header } from "@/components/layout/Header";
import { validateWhatsApp, validatePincode, validateEmail } from "@/utils/validation";
import { Toast } from "@/components/ui/Toast";
import { load } from '@cashfreepayments/cashfree-js';


import { Database } from "@/types/database";
import Image from "next/image";

type Address = Database['public']['Tables']['addresses']['Row'];

const INDIAN_STATES = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana",
    "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
    "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
    "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi", "Chandigarh"
];

export default function CheckoutPage() {
    // 1. Cart Context
    const { cartItems, cartTotal, updateQuantity, removeFromCart } = useCartContext();

    // 2. State Management
    const [otp, setOtp] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [authLoading, setAuthLoading] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
    const [selectedAddressId, setSelectedAddressId] = useState<string>("new");
    const [processing, setProcessing] = useState(false);
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [isEditing, setIsEditing] = useState(false); // Edit mode state
    const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' | null }>({ message: "", type: null });

    // 3. Form State
    const [formData, setFormData] = useState({
        fullName: "",
        whatsapp: "",
        email: "",
        addressLine: "",
        landmark: "",
        city: "",
        state: "",
        pincode: ""
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});

    // 4. Coupon State
    const [couponCode, setCouponCode] = useState("");
    const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
    const [couponError, setCouponError] = useState("");



    // --- HELPERS ---
    const loadUserData = async (currentUser: any) => {
        setUser(currentUser);

        // Parallel data fetching: Prefill form and fetch addresses simultaneously
        const formPrefillPromise = Promise.resolve().then(() => {
            setFormData(prev => ({
                ...prev,
                email: currentUser.email || "",
                fullName: currentUser.user_metadata?.full_name || prev.fullName
            }));
        });

        const addressesPromise = supabase
            .from('addresses')
            .select('*')
            .eq('user_id', currentUser.id)
            .order('is_default', { ascending: false })
            .returns<Address[]>();

        const [_, { data: addresses }] = await Promise.all([formPrefillPromise, addressesPromise]);

        if (addresses && addresses.length > 0) {
            setSavedAddresses(addresses);
            if (selectedAddressId === "new") {
                setSelectedAddressId(addresses[0].id);
                fillFormWithAddress(addresses[0]);
            }
        }
    };

    // --- OTP HANDLERS ---
    const handleSendOtp = async () => {
        if (!validateEmail(formData.email)) return;
        setAuthLoading(true);
        try {
            const { error } = await supabase.auth.signInWithOtp({
                email: formData.email,
                options: { shouldCreateUser: true }
            });
            if (error) throw error;
            setOtpSent(true);
            setToast({ message: "OTP sent to your email.", type: 'success' });
        } catch (err: any) {
            console.error("OTP Error:", err);
            const errorMessage = err.message || "Something went wrong";

            if (errorMessage.includes("expired") || errorMessage.includes("invalid")) {
                setToast({ message: "Code expired or invalid. Please request a new one.", type: 'error' });
            } else {
                setToast({ message: errorMessage, type: 'error' });
            }
            // Ensure we don't reset 'otpSent' blindly so they can retry or click change email
            // But if it's a critical error maybe we should? For now keeping it simple.
        } finally {
            setAuthLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        if (!otp || otp.length < 6) {
            setToast({ message: "Please enter a valid code.", type: 'error' });
            return;
        }
        setAuthLoading(true);
        try {
            const { data: { session, user }, error } = await supabase.auth.verifyOtp({
                email: formData.email,
                token: otp,
                type: 'email'
            });

            if (error) throw error;

            if (user) {
                setToast({ message: "Identity Verified.", type: 'success' });
                // Parallel Rituals: Update user state and fetch addresses concurrently
                await loadUserData(user);
            }
        } catch (err: any) {
            console.error("Verify Error:", err);
            const errorMessage = err.message || "Invalid OTP";

            if (errorMessage.includes("expired") || errorMessage.includes("invalid")) {
                setToast({ message: "This code has expired. Please send a new one.", type: 'error' });
            } else {
                setToast({ message: errorMessage, type: 'error' });
            }
        } finally {
            setAuthLoading(false);
        }
    };

    // --- INITIALIZATION ---
    useEffect(() => {
        const initCheckout = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) loadUserData(user);
        };
        initCheckout();
    }, []);

    // --- HELPERS ---
    const fillFormWithAddress = (addr: any) => {
        setFormData(prev => ({
            ...prev,
            fullName: addr.full_name,
            whatsapp: addr.phone,
            addressLine: addr.address_line_1,
            landmark: addr.landmark || "",
            city: addr.city,
            state: addr.state || "",
            pincode: addr.pincode
        }));
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setTouched(prev => ({ ...prev, [name]: true }));
        if (errors[name]) setErrors(prev => { const n = { ...prev }; delete n[name]; return n; });
    };

    const getFieldStatus = (name: string, value: string) => {
        if (!touched[name]) return null;
        if (name === 'whatsapp') return validateWhatsApp(value) ? 'valid' : 'invalid';
        if (name === 'email') return validateEmail(value) ? 'valid' : 'invalid';
        if (name === 'pincode') return validatePincode(value) ? 'valid' : 'invalid';
        if (name === 'fullName') return value.length >= 3 ? 'valid' : 'invalid';
        if (name === 'addressLine') return value.length >= 5 ? 'valid' : 'invalid';
        if (name === 'state' || name === 'city') return value ? 'valid' : 'invalid';
        return null;
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        if (formData.fullName.length < 3) newErrors.fullName = "Required";
        if (!validateWhatsApp(formData.whatsapp)) newErrors.whatsapp = "Invalid Number";
        if (!validateEmail(formData.email)) newErrors.email = "Invalid Email";
        if (formData.addressLine.length < 5) newErrors.addressLine = "Incomplete Address";
        if (!validatePincode(formData.pincode)) newErrors.pincode = "Invalid Pincode";
        if (!formData.city) newErrors.city = "Required";
        if (!formData.state) newErrors.state = "Required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // --- FINANCIALS ---
    const subtotal = cartTotal;
    const discount = useMemo(() => {
        if (!appliedCoupon) return 0;
        return appliedCoupon.type === 'percentage'
            ? (subtotal * appliedCoupon.value) / 100
            : appliedCoupon.value;
    }, [subtotal, appliedCoupon]);

    const shipping = subtotal >= 2500 ? 0 : 150;
    const finalTotal = subtotal - discount + shipping;

    // --- ACTIONS ---
    const handleApplyCoupon = async () => {
        setCouponError("");
        if (!couponCode) return;

        const { data, error } = await supabase
            .from('coupons')
            .select('*')
            .eq('code', couponCode.toUpperCase())
            .eq('is_active', true)
            .single();

        if (error || !data) {
            setCouponError("Ritual code expired or invalid.");
            return;
        }
        setAppliedCoupon(data);
    };

    const handleUpdateAddress = async () => {
        if (!validateForm()) return;
        setProcessing(true);

        try {
            const { error } = await (supabase.from('addresses') as any)
                .update({
                    full_name: formData.fullName,
                    phone: formData.whatsapp,
                    address_line_1: formData.addressLine,
                    address_line_2: formData.landmark,
                    city: formData.city,
                    state: formData.state,
                    pincode: formData.pincode,
                    updated_at: new Date().toISOString()
                })
                .eq('id', selectedAddressId);

            if (error) throw error;

            // Update local state
            setSavedAddresses(prev => prev.map(addr =>
                addr.id === selectedAddressId
                    ? { ...addr, full_name: formData.fullName, phone: formData.whatsapp, address_line_1: formData.addressLine, address_line_2: formData.landmark, city: formData.city, state: formData.state, pincode: formData.pincode }
                    : addr
            ));

            setIsEditing(false); // Exit edit mode
            setToast({ message: "Address updated successfully", type: "success" });
        } catch (error) {
            console.error("Update failed:", error);
            setToast({ message: "Failed to update address", type: "error" });
        } finally {
            setProcessing(false);
        }
    };

    const handleCancelEdit = () => {
        if (selectedAddressId === "new") {
            setFormData(prev => ({ ...prev, addressLine: "", landmark: "", city: "", state: "", pincode: "" }));
        } else {
            const original = savedAddresses.find(a => a.id === selectedAddressId);
            if (original) fillFormWithAddress(original);
            setIsEditing(false);
        }
    };

    const handleProceedToPayment = async () => {
        // 1. Validate Form & Authentication
        if (!user) {
            setToast({ message: "Please verify your email first.", type: 'error' });
            return;
        }

        if (!validateForm()) {
            const fields = ['fullName', 'whatsapp', 'email', 'addressLine', 'pincode', 'city', 'state'];
            const allTouched = fields.reduce((acc, curr) => ({ ...acc, [curr]: true }), {});
            setTouched(allTouched);
            // Scroll to top to see errors
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        // --- AUTO-SAVE ADDRESS & SYNC NAME ---
        if (selectedAddressId === "new") {
            try {
                const { data: newAddr } = await (supabase.from('addresses') as any)
                    .insert({
                        user_id: user.id,
                        full_name: formData.fullName,
                        phone: formData.whatsapp,
                        address_line_1: formData.addressLine,
                        address_line_2: formData.landmark,
                        city: formData.city,
                        state: formData.state,
                        pincode: formData.pincode,
                        is_default: savedAddresses.length === 0 // Default if it's the first one
                    })
                    .select()
                    .single();

                if (newAddr) {
                    setSavedAddresses([newAddr, ...savedAddresses]);
                    setSelectedAddressId(newAddr.id);
                }

                // Sync Name & Phone to Profile if empty
                // Explicitly cast the query to avoid 'never' type inference issues
                const { data } = await supabase.from('users').select('full_name, phone').eq('id', user.id).single();
                const profileData = data as { full_name: string | null; phone: string | null } | null;

                const updates: any = {};
                // Use optional chaining carefully
                if (!profileData?.full_name || profileData.full_name === "Guest User" || profileData.full_name === user.email?.split('@')[0]) {
                    updates.full_name = formData.fullName;
                }
                if (!profileData?.phone) {
                    updates.phone = formData.whatsapp;
                }

                if (Object.keys(updates).length > 0) {
                    await (supabase.from('users') as any).update(updates).eq('id', user.id);
                }

            } catch (err) {
                console.error("Auto-save address failed", err);
            }
        } else {
            // Even for existing address, check if we should sync name/phone to profile
            try {
                const { data } = await supabase.from('users').select('full_name, phone').eq('id', user.id).single();
                const profileData = data as { full_name: string | null; phone: string | null } | null;

                const updates: any = {};
                if (!profileData?.full_name) {
                    updates.full_name = formData.fullName;
                }
                if (!profileData?.phone) {
                    updates.phone = formData.whatsapp;
                }

                if (Object.keys(updates).length > 0) {
                    await (supabase.from('users') as any).update(updates).eq('id', user.id);
                }
            } catch (err) { console.error("Profile sync failed", err); }
        }
        // -------------------------------------

        // 2. Validate Terms
        // Alert removed as per user request, button is now disabled until agreed.
        if (!agreedToTerms) {
            return;
        }

        setProcessing(true);
        setToast({ message: "Initiating secure payment channel...", type: 'success' });

        try {
            // A. Create Order & Session
            const response = await fetch('/api/payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user?.id,
                    amount: finalTotal,
                    customerPhone: formData.whatsapp,
                    customerEmail: formData.email,
                    customerName: formData.fullName,
                    shippingAddress: {
                        fullName: formData.fullName,
                        phone: formData.whatsapp,
                        addressLine: formData.addressLine,
                        landmark: formData.landmark,
                        city: formData.city,
                        state: formData.state,
                        pincode: formData.pincode
                    }
                })
            });

            const data = await response.json();

            if (!response.ok) throw new Error(data.error || "Failed to initiate ritual");

            // B. Initialize Cashfree
            const cashfree = await load({
                mode: process.env.NEXT_PUBLIC_CASHFREE_ENV === 'PRODUCTION' ? "production" : "sandbox"
            });

            // C. Redirect to Payment Sanctuary
            cashfree.checkout({
                paymentSessionId: data.paymentSessionId,
                redirectTarget: "_self" // Redirects strictly to the status page
            });

        } catch (error: any) {
            console.error("Payment Error:", error);
            setProcessing(false);
            setToast({ message: error.message || "Payment initiation failed", type: 'error' });
        }
    };

    return (
        <div className="min-h-screen bg-[#FDFBF7]">
            <Toast message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, type: null })} />
            <Header />
            <main className="max-w-[1440px] mx-auto px-3 sm:px-6 md:px-8 lg:px-12 py-24 lg:py-32 grid lg:grid-cols-12 gap-6 lg:gap-16">

                {/* LEFT: Rituals & Delivery */}
                <div className="lg:col-span-7 space-y-12">

                    {/* 1. YOUR RITUALS (CART) */}
                    <section>
                        <h2 className="font-heading text-2xl lg:text-3xl text-[#2D3A3A] mb-8 flex items-center gap-3">
                            <ShoppingBag className="w-5 h-5 text-[#5A7A6A]" />
                            Your Rituals
                        </h2>

                        {cartItems.length === 0 ? (
                            <div className="p-12 text-center border border-dashed border-[#E8E6E2] rounded-[2.5rem] text-[#7A8A8A]">
                                Your sanctuary is empty.
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {cartItems.map((item: any) => (
                                    <div key={item.id} className="group bg-white rounded-4xl p-4  pr-6 border border-[#E8E6E2] flex flex-col justify-between sm:flex-row items-center gap-6 hover:shadow-[0_20px_40px_rgba(0,0,0,0.03)] transition-all duration-500">
                                        <div className="w-20 h-20 bg-[#F3F1ED] rounded-xl p-2 shrink-0">
                                            <Image
                                                width={1000}
                                                height={1000} src={item.image_urls?.[0]} alt={item.name} className="w-full rounded h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform" />
                                        </div>

                                        <div className="grow text-center sm:text-left">
                                            <h3 className="font-heading text-lg text-[#2D3A3A]">{item.name}</h3>
                                            <p className="text-[11px] font-bold text-[#5A7A6A] mt-1">₹{item.price}</p>
                                        </div>

                                        <div className="flex gap-2">
                                            <div className="flex items-center gap-4 bg-[#F9F8F6] rounded-full p-1 border border-[#E8E6E2]">
                                                <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-8 h-8 rounded-full bg-white text-[#2D3A3A] flex items-center justify-center hover:bg-[#2D3A3A] hover:text-white transition-colors"><Minus className="w-3 h-3" /></button>
                                                <span className="w-4 text-center text-xs font-bold text-[#2D3A3A]">{item.quantity}</span>
                                                <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-8 h-8 rounded-full bg-white text-[#2D3A3A] flex items-center justify-center hover:bg-[#2D3A3A] hover:text-white transition-colors"><Plus className="w-3 h-3" /></button>
                                            </div>

                                            <button onClick={() => removeFromCart(item.id)} className="p-3 rounded-full border border-[#E8E6E2] text-[#D4D2CE] flex items-center justify-center hover:bg-red-50 hover:border-red-100 hover:text-red-400 transition-colors sm:ml-2 gap-2">
                                                <Trash2 className="w-3.5 h-3.5" />

                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>

                    {/* 2. DELIVERY SANCTUARY (FORM) */}
                    <section>
                        <h2 className="font-heading text-2xl lg:text-3xl text-[#2D3A3A] mb-8 flex items-center gap-3">
                            <MapPin className="w-5 h-5 text-[#5A7A6A]" />
                            Delivery Sanctuary
                        </h2>

                        {/* SAVED ADDRESS SWITCHER */}
                        {savedAddresses.length > 0 && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                                {savedAddresses.map((addr) => (
                                    <button
                                        key={addr.id}
                                        onClick={() => {
                                            setSelectedAddressId(addr.id);
                                            fillFormWithAddress(addr);
                                            setIsEditing(false);
                                        }}
                                        className={cn(
                                            "p-6  border rounded-3xl text-left transition-all relative overflow-hidden group hover:shadow-lg",
                                            selectedAddressId === addr.id ? "border-[#5A7A6A] bg-[#5A7A6A]/5" : "border-[#E8E6E2] bg-white hover:border-[#5A7A6A]/30"
                                        )}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="text-sm font-bold text-[#2D3A3A]">{addr.full_name}</span>
                                            {selectedAddressId === addr.id && <CheckCircle2 className="w-4 h-4 text-[#5A7A6A]" />}
                                        </div>
                                        <p className="text-xs text-[#7A8A8A] leading-relaxed line-clamp-2 mb-1">
                                            {addr.address_line_1}, {addr.city}
                                        </p>
                                        <p className="text-xs text-[#5A7A6A] font-bold">
                                            {addr.phone}
                                        </p>
                                    </button>
                                ))}

                                <button
                                    onClick={() => {
                                        setSelectedAddressId("new");
                                        setFormData(prev => ({ ...prev, addressLine: "", landmark: "", city: "", state: "", pincode: "" }));
                                        setIsEditing(true); // New address is always editing
                                    }}
                                    className={cn(
                                        "p-6 rounded-4xl border border-dashed flex items-center justify-center gap-3 transition-all",
                                        selectedAddressId === "new" ? "border-[#5A7A6A] bg-[#5A7A6A]/5 text-[#5A7A6A]" : "border-[#E8E6E2] text-[#7A8A8A] hover:bg-white"
                                    )}
                                >
                                    <Plus className="w-4 h-4" />
                                    <span className="text-[10px] uppercase tracking-widest font-bold">New Base</span>
                                </button>
                            </div>
                        )}

                        {/* INLINE FORM */}
                        <div className="bg-white rounded-[2.5rem] border border-[#E8E6E2] p-6 lg:p-10 transition-all duration-500 relative">
                            {/* LOCKED STATE OVERLAY BUTTON */}
                            {selectedAddressId !== "new" && !isEditing && (
                                <div className="absolute top-6 right-6 z-10">
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="bg-white border cursor-pointer border-[#E8E6E2] px-4 py-2 rounded-full text-[10px] uppercase font-bold tracking-widest text-[#2D3A3A] hover:bg-[#2D3A3A] hover:text-white transition-colors flex items-center gap-2 shadow-sm"
                                    >
                                        <Pencil className="w-3 h-3" /> Edit
                                    </button>
                                </div>
                            )}

                            <div className={cn(
                                "space-y-8",
                                selectedAddressId !== "new" && !isEditing && "opacity-50 grayscale pointer-events-none"
                            )}>
                                <div className="grid md:grid-cols-2 gap-8">
                                    <CheckoutInput
                                        label="Full Name" name="fullName" value={formData.fullName}
                                        status={getFieldStatus('fullName', formData.fullName)}
                                        onChange={handleInputChange} placeholder="Hardik Jain"
                                        icon={<Sparkles className="w-3  h-3 text-[#C68DFF]" />}
                                    />
                                    <CheckoutInput
                                        label="WhatsApp" name="whatsapp" value={formData.whatsapp}
                                        status={getFieldStatus('whatsapp', formData.whatsapp)}
                                        onChange={handleInputChange} placeholder="99XXXXXXXX"
                                    />
                                </div>

                                <CheckoutInput
                                    label="Email Address" name="email" value={formData.email}
                                    status={getFieldStatus('email', formData.email)}
                                    onChange={handleInputChange} placeholder="hello@ayuniv.in"
                                    icon={<Mail className="w-3 h-3" />}
                                    disabled={!!user || otpSent}
                                />

                                {/* AUTHENTICATION UI - OTP FLOW */}
                                {!user && validateEmail(formData.email) && (
                                    <div className="bg-[#5A7A6A]/5 p-6 rounded-3xl border border-[#5A7A6A]/10 animate-in fade-in slide-in-from-top-4">
                                        {!otpSent ? (
                                            <div className="flex items-center justify-between gap-4">
                                                <p className="text-[10px] text-[#5A7A6A] font-medium leading-relaxed">
                                                    <span className="font-bold block mb-1">Ritual Identity Required</span>
                                                    We'll send a secret code to your email.
                                                </p>
                                                <button
                                                    onClick={handleSendOtp}
                                                    disabled={authLoading}
                                                    className="bg-[#5A7A6A] text-white px-5 py-3 rounded-full cursor-pointer text-[9px] uppercase font-bold tracking-widest hover:shadow-lg transition-all disabled:opacity-50 whitespace-nowrap"
                                                >
                                                    {authLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Send Code"}
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <p className="text-[10px] text-[#5A7A6A] font-medium">
                                                        Enter the code sent to <span className="font-bold text-[#2D3A3A]">{formData.email}</span>
                                                    </p>
                                                    <button
                                                        onClick={() => setOtpSent(false)}
                                                        className="text-[9px] text-[#7A8A8A] hover:text-[#5A7A6A] underline decoration-dotted underline-offset-2"
                                                    >
                                                        Change Email
                                                    </button>
                                                </div>

                                                <div className="flex gap-2 items-center ">
                                                    <CheckoutInput
                                                        label=""
                                                        name="otp"
                                                        value={otp}
                                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setOtp(e.target.value)}
                                                        placeholder="Enter 6-8 digit code"
                                                        // icon={<Sparkles className="w-3 h-3 text-[#C68DFF]" />}
                                                        className="tracking-[0.5em]  text-center font-mono"
                                                    />
                                                    <button
                                                        onClick={handleVerifyOtp}
                                                        disabled={authLoading || otp.length < 6}
                                                        className="bg-[#2D3A3A] text-white px-6 h-10 mt-3 rounded-2xl text-[9px] uppercase font-bold tracking-widest hover:bg-black  transition-all disabled:opacity-50"
                                                    >
                                                        {authLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Verify"}
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                <CheckoutInput
                                    label="Address Line" name="addressLine" value={formData.addressLine}
                                    status={getFieldStatus('addressLine', formData.addressLine)}
                                    onChange={handleInputChange} placeholder="House No, Street, Area"
                                />

                                <CheckoutInput
                                    label="Landmark (Optional)" name="landmark" value={formData.landmark}
                                    onChange={handleInputChange} placeholder="e.g. Near The Great Banyan Tree"
                                    icon={<Flag className="w-3 h-3" />}
                                />

                                <div className="grid md:grid-cols-3 gap-6">
                                    <CheckoutInput
                                        label="Pincode" name="pincode" value={formData.pincode}
                                        status={getFieldStatus('pincode', formData.pincode)}
                                        onChange={handleInputChange} placeholder="302001"
                                    />
                                    <CheckoutInput
                                        label="City" name="city" value={formData.city}
                                        status={getFieldStatus('city', formData.city)}
                                        onChange={handleInputChange} placeholder="Jaipur"
                                    />

                                    <div className="space-y-3 group relative">
                                        <label className="text-[9px] uppercase tracking-[0.2em] font-bold text-[#9AA09A] ml-4">State</label>
                                        <div className="relative">
                                            <select
                                                name="state"
                                                value={formData.state}
                                                onChange={handleInputChange}
                                                className={cn(
                                                    "w-full bg-[#EBF1FA] border rounded-3xl py-4 pl-6 pr-8 text-sm outline-none appearance-none cursor-pointer transition-all",
                                                    getFieldStatus('state', formData.state) === 'invalid' ? "border-red-200" : "border-[#E8E6E2] focus:border-[#5A7A6A]"
                                                )}
                                            >
                                                <option value="">Select State</option>
                                                {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                                            </select>
                                            <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* SAVE BUTTON FOR EDIT MODE */}
                                {selectedAddressId !== "new" && isEditing && (
                                    <div className="flex justify-end pt-4 gap-3">
                                        <button
                                            onClick={handleCancelEdit}
                                            disabled={processing}
                                            className="px-6 py-3 text-[#7A8A8A] text-[10px] uppercase font-bold tracking-widest hover:text-[#2D3A3A] transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleUpdateAddress}
                                            disabled={processing}
                                            className="px-8 py-3 bg-[#5A7A6A] text-white rounded-full text-[10px] uppercase font-bold tracking-widest hover:shadow-lg transition-all disabled:opacity-50"
                                        >
                                            {processing ? "Saving..." : "Save Changes"}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>
                </div>

                {/* RIGHT: Alchemy Summary */}
                <div className="lg:col-span-5">
                    <div className="sticky top-32 bg-white rounded-[3rem] p-8 lg:p-10 border border-[#E8E6E2] shadow-2xl">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-heading text-[#2D3A3A]">Alchemy <span className="italic font-serif text-[#5A7A6A]">Summary</span></h2>
                            <div className="w-8 h-8 bg-[#F3F1ED] rounded-full flex items-center justify-center text-[#2D3A3A] font-bold text-xs">
                                {cartItems.reduce((acc: number, item: any) => acc + item.quantity, 0)}
                            </div>
                        </div>

                        {/* COUPON INPUT */}
                        <div className="mb-10  ">
                            <div className="relative flex gap-2">


                                <input
                                    value={couponCode}
                                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                    placeholder="RITUAL CODE"
                                    className="flex-1 bg-[#F9F8F6] border border-[#E8E6E2] rounded-2xl py-4 pl-6 pr-4 text-xs font-bold tracking-widest outline-none focus:border-[#5A7A6A] transition-all"
                                />
                                <button
                                    onClick={handleApplyCoupon}
                                    className="bg-[#2D3A3A] text-white px-6 rounded-2xl text-[9px] uppercase font-bold tracking-widest hover:bg-[#5A7A6A] transition-colors"
                                >
                                    Apply
                                </button>
                            </div>
                            {appliedCoupon && <p className="text-[9px] text-[#5A7A6A] mt-2 ml-4 flex items-center gap-1"><Ticket className="w-3 h-3" /> Offer Active: {appliedCoupon.code}</p>}
                            {couponError && <p className="text-[9px] text-red-400 mt-2  ml-4 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {couponError}</p>}
                        </div>

                        {/* FINANCIALS */}
                        <div className="space-y-4 mb-10 pb-8 border-b border-[#E8E6E2]">
                            <div className="flex justify-between text-sm text-[#7A8A8A]"><span>Archive Value</span><span>₹{subtotal.toLocaleString()}</span></div>

                            {/* DYNAMIC DISCOUNT ROW */}
                            {discount > 0 && (
                                <div className="flex justify-between text-sm text-[#5A7A6A] font-bold bg-[#5A7A6A]/5 p-3 rounded-xl -mx-3">
                                    <span className="flex items-center gap-2"><Sparkles className="w-3 h-3" /> Ritual Reward</span>
                                    <span>- ₹{discount.toLocaleString()}</span>
                                </div>
                            )}

                            <div className="flex justify-between text-sm text-[#7A8A8A]">
                                <span>Logistics</span>
                                <span className={shipping === 0 ? "text-[#5A7A6A]" : ""}>{shipping === 0 ? "Complimentary" : `₹${shipping}`}</span>
                            </div>
                        </div>

                        <div className="flex justify-between items-end mb-10">
                            <span className="text-[10px] uppercase tracking-[0.4em] font-black text-[#2D3A3A]">Total Investment</span>
                            <span className="text-3xl lg:text-4xl font-serif italic text-[#2D3A3A]">₹{finalTotal.toLocaleString()}</span>
                        </div>

                        {/* TERMS CHECKBOX */}
                        <div className="mb-8 flex items-start gap-3 px-2">
                            <button
                                onClick={() => setAgreedToTerms(!agreedToTerms)}
                                className={cn(
                                    " h-5 aspect-square rounded-md border flex items-center justify-center shrink-0 transition-all mt-0.5",
                                    agreedToTerms ? "bg-[#2D3A3A] border-[#2D3A3A]" : "bg-white border-[#D4D2CE]"
                                )}
                            >
                                {agreedToTerms && <CheckCircle2 className=" w-3 h-3 text-white" />}
                            </button>
                            <p className="text-[10px] text-[#7A8A8A] leading-relaxed cursor-pointer" onClick={() => setAgreedToTerms(!agreedToTerms)}>
                                I acknowledge the holistic nature of these products and agree to the <span className="underline decoration-[#5A7A6A] decoration-dashed underline-offset-2 hover:text-[#2D3A3A]">Terms of Sanctuary</span> & Privacy Ritual.
                            </p>
                        </div>

                        <button
                            onClick={handleProceedToPayment}
                            disabled={processing || cartItems.length === 0 || !agreedToTerms}
                            className={cn(
                                "w-full py-6 bg-[#2D3A3A] text-white rounded-full text-[11px] font-bold uppercase tracking-[0.4em] flex items-center justify-center border cursor-pointer gap-3 shadow-xl hover:shadow-2xl  transition-all active:scale-95 disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed group",
                                !agreedToTerms && "opacity-75 grayscale cursor-not-allowed hover:transform-none hover:shadow-none bg-[#7A8A8A] text-gray-500"
                            )}
                        >
                            {processing ? <Loader2 className="w-5 h-5 animate-spin" /> : <><ShieldCheck className="w-5 h-5 group-hover:scale-110 transition-transform" /> Initiate Transfer</>}
                        </button>
                    </div>
                </div>
            </main >
        </div >
    );
}

// --- REUSABLE INPUT COMPONENT ---
function CheckoutInput({ label, name, value, status, onChange, placeholder, icon }: any) {
    return (
        <div className="space-y-3 group  relative">
            <label className="text-[9px] uppercase tracking-[0.2em] font-bold text-[#9AA09A] ml-4 flex items-center gap-2 transition-colors group-focus-within:text-[#5A7A6A]">
                {label} {icon}
            </label>
            <div className="relative">
                {/* Left-Aligned Validation Icon */}
                <div className="absolute left-6 top-1/2 -translate-y-1/2 pointer-events-none transition-all duration-300 z-10">
                    {status === 'valid' ? <CheckCircle2 className="w-4 h-4 text-[#5A7A6A] scale-110" /> :
                        status === 'invalid' ? <AlertCircle className="w-4 h-4 text-red-400 scale-110" /> :
                            <div className="w-2 h-2 rounded-full bg-[#E8E6E2]" />}
                </div>

                <input
                    type="text"
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className={cn(
                        // FIX: pl-14 adds space for icon, pr-4 keeps right side clean
                        "w-full bg-[#EBF1FA] border rounded-3xl  py-4 pl-14 pr-4 text-sm transition-all duration-300 outline-none placeholder:text-[#D4D2CE]",
                        status === 'valid' ? "border-[#5A7A6A]/40 ring-1 ring-[#5A7A6A]/10" :
                            status === 'invalid' ? "border-red-200 bg-red-50/5" :
                                "border-[#E8E6E2] hover:border-[#D4D2CE] focus:border-[#5A7A6A]"
                    )}
                />
            </div>
        </div>
    );
}