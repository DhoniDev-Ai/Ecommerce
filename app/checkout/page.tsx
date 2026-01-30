"use client";
import { useState, useEffect, useMemo, useCallback } from "react";
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

    // 5. Payment Method State
    const [paymentMethod, setPaymentMethod] = useState<'online' | 'COD'>('online');


    // --- HELPERS ---
    const loadUserData = useCallback(async (currentUser: any) => {
        setUser(currentUser);

        // Parallel data fetching
        const [_, { data: addresses }] = await Promise.all([
            Promise.resolve().then(() => {
                setFormData(prev => ({
                    ...prev,
                    email: currentUser.email || "",
                    fullName: currentUser.user_metadata?.full_name || prev.fullName
                }));
            }),
            supabase
                .from('addresses')
                .select('*')
                .eq('user_id', currentUser.id)
                .order('is_default', { ascending: false })
                .returns<Address[]>()
        ]);

        if (addresses && addresses.length > 0) {
            setSavedAddresses(addresses);
            if (selectedAddressId === "new") {
                setSelectedAddressId(addresses[0].id);
                fillFormWithAddress(addresses[0]);
            }
        }
    }, [selectedAddressId]); // Minimal dependency

    // --- OTP HANDLERS (WHATSAPP) ---
    const handleSendOtp = async () => {
        // Force +91 prefix
        const digits = formData.whatsapp.replace(/\D/g, '');
        let phone = '';

        if (digits.length === 12 && digits.startsWith('91')) {
            phone = '+' + digits;
        } else if (digits.length === 10) {
            phone = '+91' + digits;
        } else {
            setToast({ message: "Please enter a valid 10-digit number.", type: 'error' });
            return;
        }

        setAuthLoading(true);
        try {
            // NOTE: This requires 'whatsapp' channel enabled in Supabase -> Authentication -> Providers -> Phone
            // And a Twilio/Msg91 connection.
            const { error } = await supabase.auth.signInWithOtp({
                phone: phone,
                options: { channel: 'whatsapp', shouldCreateUser: true }
            });

            if (error) {
                // Fallback suggestion for user if they haven't set up WhatsApp yet
                if (error.message.includes("Signups not allowed")) throw new Error("Please enable Phone Auth in Supabase.");
                throw error;
            }

            setOtpSent(true);
            setToast({ message: "WhatsApp code sent.", type: 'success' });
        } catch (err: any) {
            console.error("OTP Error:", err);
            setToast({ message: err.message || "Failed to send code.", type: 'error' });
        } finally {
            setAuthLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        if (!otp || otp.length < 6) {
            setToast({ message: "Please enter a valid 6-digit code.", type: 'error' });
            return;
        }
        setAuthLoading(true);
        try {
            const digits = formData.whatsapp.replace(/\D/g, '');
            let phone = '';
            if (digits.length === 12 && digits.startsWith('91')) phone = '+' + digits;
            else if (digits.length === 10) phone = '+91' + digits;
            else throw new Error("Invalid phone number format");

            const { data: { session, user }, error } = await supabase.auth.verifyOtp({
                phone: phone,
                token: otp,
                type: 'sms' // Verify uses 'sms' type even for WhatsApp typically
            });

            if (error) throw error;

            if (user) {
                setToast({ message: "Identity Verified.", type: 'success' });
                await loadUserData(user);
            }
        } catch (err: any) {
            console.error("Verify Error:", err);
            const errorMessage = err.message || "Invalid OTP";
            if (errorMessage.includes("expired") || errorMessage.includes("invalid")) {
                setToast({ message: "Code expired or invalid.", type: 'error' });
            } else {
                setToast({ message: errorMessage, type: 'error' });
            }
        } finally {
            setAuthLoading(false);
        }
    };

    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        setIsMounted(true);
        const initCheckout = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) loadUserData(session.user);
        };
        initCheckout();
    }, []);

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

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setTouched(prev => ({ ...prev, [name]: true }));
        // Clear error immediately when user types
        setErrors(prev => {
            if (!prev[name]) return prev;
            const n = { ...prev };
            delete n[name];
            return n;
        });
    }, []);

    const getFieldStatus = useCallback((name: string, value: string) => {
        if (!touched[name]) return null;
        switch (name) {
            case 'whatsapp': return validateWhatsApp(value) ? 'valid' : 'invalid';
            // case 'email': return validateEmail(value) ? 'valid' : 'invalid';
            case 'pincode': return validatePincode(value) ? 'valid' : 'invalid';
            case 'fullName': return value.length >= 3 ? 'valid' : 'invalid';
            case 'addressLine': return value.length >= 5 ? 'valid' : 'invalid';
            case 'state':
            case 'city': return value ? 'valid' : 'invalid';
            default: return null;
        }
    }, [touched]);

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        if (formData.fullName.length < 3) newErrors.fullName = "Required";
        if (!validateWhatsApp(formData.whatsapp)) newErrors.whatsapp = "Invalid Number";
        // Email is now optional/auto-detected
        // if (!validateEmail(formData.email)) newErrors.email = "Invalid Email";
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

            setSavedAddresses(prev => prev.map(addr =>
                addr.id === selectedAddressId
                    ? { ...addr, full_name: formData.fullName, phone: formData.whatsapp, address_line_1: formData.addressLine, address_line_2: formData.landmark, city: formData.city, state: formData.state, pincode: formData.pincode }
                    : addr
            ));

            setIsEditing(false);
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

    // --- AUTO-SAVE LOGIC ---
    const autoSaveData = async () => {
        if (!user) return;

        // 1. Auto-save Address if new
        if (selectedAddressId === "new") {
            try {
                // Basic validation before save
                if (formData.fullName.length < 3 || formData.addressLine.length < 5 || !formData.pincode) return;

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
                        is_default: savedAddresses.length === 0
                    })
                    .select()
                    .single();

                if (newAddr) {
                    setSavedAddresses([newAddr, ...savedAddresses]);
                    setSelectedAddressId(newAddr.id);
                }
            } catch (err) { console.error("Auto-save address failed", err); }
        }

        // 2. Sync Profile
        try {
            const { data: profile } = await supabase.from('users').select('full_name, phone').eq('id', user.id).single();
            if (!profile?.full_name || !profile?.phone) {
                await (supabase.from('users') as any).update({
                    full_name: profile?.full_name || formData.fullName,
                    phone: profile?.phone || formData.whatsapp
                }).eq('id', user.id);
            }
        } catch (err) { console.error("Profile sync failed", err); }
    };

    const toggleTerms = () => {
        const newState = !agreedToTerms;
        setAgreedToTerms(newState);
        if (newState) {
            autoSaveData();
        }
    };

    const handleProceedToPayment = async () => {
        // AUTH CHECK: Must be verified user (via phone or login)
        if (!user) {
            setToast({ message: "Please verify your WhatsApp number first.", type: 'error' });
            return;
        }

        if (!validateForm()) {
            const fields = ['fullName', 'whatsapp', 'email', 'addressLine', 'pincode', 'city', 'state'];
            const allTouched = fields.reduce((acc, curr) => ({ ...acc, [curr]: true }), {});
            setTouched(allTouched);
            window.scrollTo({ top: 300, behavior: 'smooth' });
            return;
        }

        if (!agreedToTerms) {
            setToast({ message: "Please agree to the terms.", type: 'error' });
            return;
        }

        setProcessing(true);
        setToast({ message: "Initiating ritual...", type: 'success' });
        // ... (rest of payment logic)


        try {
            // Updated API Call with Correct Payload
            const response = await fetch('/api/checkout/create-ritual', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
                },
                body: JSON.stringify({
                    amount: finalTotal,
                    couponId: appliedCoupon?.id,
                    paymentMethod: paymentMethod,
                    items: cartItems, // Crucial for persistence
                    customerName: formData.fullName,
                    customerPhone: formData.whatsapp,
                    customerEmail: formData.email,
                    shippingAddress: { // Crucial for Schema compliance
                        fullName: formData.fullName,
                        phone: formData.whatsapp,
                        addressLine: formData.addressLine,
                        landmark: formData.landmark,
                        city: formData.city,
                        state: formData.state,
                        pincode: formData.pincode,
                        country: 'India'
                    }
                })
            });

            const data = await response.json();

            if (!response.ok) throw new Error(data.error || "Failed to initiate ritual");

            if (data.mode === 'COD') {
                window.location.href = `/checkout/status?order_id=${data.orderId}`;
                return;
            }

            const cashfree = await load({
                mode: process.env.NEXT_PUBLIC_CASHFREE_ENV === 'PRODUCTION' ? "production" : "sandbox"
            });

            cashfree.checkout({
                paymentSessionId: data.paymentSessionId,
                redirectTarget: "_self"
            });

        } catch (error: any) {
            console.error("Payment Error:", error);
            setProcessing(false);
            setToast({ message: error.message || "Payment initiation failed", type: 'error' });
        }
    };

    // Protect against hydration mismatch
    if (!isMounted) return <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-[#5A7A6A]" /></div>;

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
                                                width={100}
                                                height={100}
                                                // SAFEGUARD: Check if image_urls exists
                                                src={item.image_urls?.[0] || '/placeholder.png'}
                                                alt={item.name}
                                                className="w-full rounded h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform"
                                            />
                                        </div>

                                        <div className="grow text-center sm:text-left">
                                            <h3 className="font-heading text-lg text-[#2D3A3A]">{item.name}</h3>
                                            <p className="text-[11px] font-bold text-[#5A7A6A] mt-1">₹{item.price}</p>
                                        </div>

                                        <div className="flex gap-2">
                                            <div className="flex items-center gap-4 bg-[#F9F8F6] rounded-full p-1 border border-[#E8E6E2]">
                                                <button onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1} className="w-8 h-8 rounded-full bg-white text-[#2D3A3A] flex items-center justify-center hover:bg-[#2D3A3A] hover:text-white transition-colors disabled:opacity-30 disabled:hover:scale-100 disabled:cursor-not-allowed"><Minus className="w-3 h-3" /></button>
                                                <span className="w-4 text-center text-xs font-bold text-[#2D3A3A]">{item.quantity}</span>
                                                <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-8 h-8 rounded-full bg-white text-[#2D3A3A] flex items-center justify-center hover:bg-[#2D3A3A] hover:text-white transition-colors"><Plus className="w-3 h-3" /></button>
                                            </div>

                                            <button
                                                onClick={() => {
                                                    if (window.confirm("Remove this ritual from your sanctuary?")) {
                                                        removeFromCart(item.id);
                                                    }
                                                }}
                                                className="p-3 rounded-full border border-[#E8E6E2] text-[#D4D2CE] flex items-center justify-center hover:bg-red-50 hover:border-red-100 hover:text-red-400 transition-colors sm:ml-2 gap-2"
                                            >
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
                                            "p-6 border rounded-3xl text-left transition-all relative overflow-hidden group hover:shadow-lg",
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
                        <div id="address-form" className="bg-white rounded-[2.5rem] border border-[#E8E6E2] p-6 lg:p-10 transition-all duration-500 relative">
                            {/* LOCKED STATE OVERLAY BUTTON */}
                            {selectedAddressId !== "new" && !isEditing && (
                                <div className="absolute top-6 right-6 z-10">
                                    <button
                                        onClick={() => {
                                            setIsEditing(true);
                                            // Ensure form is populated
                                            const addr = savedAddresses.find(a => a.id === selectedAddressId);
                                            if (addr) fillFormWithAddress(addr);
                                        }}
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
                                    label="Email Address (Optional)" name="email" value={formData.email}
                                    status={getFieldStatus('email', formData.email)}
                                    onChange={handleInputChange} placeholder="hello@ayuniv.com"
                                    icon={<Mail className="w-3 h-3" />}
                                    disabled={otpSent}
                                />


                                {/* AUTHENTICATION UI - OTP FLOW (WHATSAPP NOW) */}
                                {!user && validateWhatsApp(formData.whatsapp) && (
                                    <div className="bg-[#5A7A6A]/5 p-6 rounded-3xl border border-[#5A7A6A]/10 animate-in fade-in slide-in-from-top-4 my-6">
                                        {!otpSent ? (
                                            <div className="flex items-center justify-between gap-4">
                                                <p className="text-[10px] text-[#5A7A6A] font-medium leading-relaxed">
                                                    <span className="font-bold block mb-1">Ritual Identity Required</span>
                                                    Verify your WhatsApp number to secure this order.
                                                </p>
                                                <button
                                                    onClick={handleSendOtp}
                                                    disabled={authLoading}
                                                    className="bg-[#25D366] text-white px-5 py-3 rounded-full cursor-pointer text-[9px] uppercase font-bold tracking-widest hover:shadow-lg hover:bg-[#1ebc57] transition-all disabled:opacity-50 whitespace-nowrap flex items-center gap-2"
                                                >
                                                    {authLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Verify Number"}
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <p className="text-[10px] text-[#5A7A6A] font-medium">
                                                        WhatsApp code sent to <span className="font-bold text-[#2D3A3A]">{formData.whatsapp}</span>
                                                    </p>
                                                    <button
                                                        onClick={() => setOtpSent(false)}
                                                        className="text-[9px] text-[#7A8A8A] hover:text-[#5A7A6A] underline decoration-dotted underline-offset-2"
                                                    >
                                                        Change
                                                    </button>
                                                </div>

                                                <div className="flex gap-2 items-center ">
                                                    <CheckoutInput
                                                        label=""
                                                        name="otp"
                                                        value={otp}
                                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setOtp(e.target.value)}
                                                        placeholder="Enter 6-digit code"
                                                        className="tracking-[0.5em]  text-center font-mono"
                                                    />
                                                    <button
                                                        onClick={handleVerifyOtp}
                                                        disabled={authLoading || otp.length < 6}
                                                        className="bg-[#2D3A3A] text-white px-6 h-10 mt-3 rounded-2xl text-[9px] uppercase font-bold tracking-widest hover:bg-black  transition-all disabled:opacity-50"
                                                    >
                                                        {authLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Confirm"}
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

                        {/* PAYMENT METHOD SELECTION - ADDED THIS AS IT WAS MISSING IN USER CODE BUT REQUIRED FOR COD */}
                        <div className="mb-8 space-y-3">
                            <h3 className="text-sm font-bold text-[#2D3A3A] uppercase tracking-widest mb-4">Payment Selection</h3>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={() => setPaymentMethod('online')}
                                    className={cn(
                                        "p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all",
                                        paymentMethod === 'online' ? "border-[#5A7A6A] bg-[#5A7A6A]/10 text-[#2D3A3A]" : "border-[#E8E6E2] text-[#7A8A8A]"
                                    )}
                                >
                                    <ShieldCheck className="w-5 h-5" />
                                    <span className="text-[10px] font-bold uppercase">Online Pay</span>
                                </button>
                                <button
                                    onClick={() => setPaymentMethod('COD')}
                                    className={cn(
                                        "p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all",
                                        paymentMethod === 'COD' ? "border-[#5A7A6A] bg-[#5A7A6A]/10 text-[#2D3A3A]" : "border-[#E8E6E2] text-[#7A8A8A]"
                                    )}
                                >
                                    <ShoppingBag className="w-5 h-5" />
                                    <span className="text-[10px] font-bold uppercase">Cash on Delivery</span>
                                </button>
                            </div>
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
                                onClick={toggleTerms}
                                className={cn(
                                    " h-5 aspect-square rounded-md border flex items-center justify-center shrink-0 transition-all mt-0.5",
                                    agreedToTerms ? "bg-[#2D3A3A] border-[#2D3A3A]" : "bg-white border-[#D4D2CE]"
                                )}
                            >
                                {agreedToTerms && <CheckCircle2 className=" w-3 h-3 text-white" />}
                            </button>
                            <p className="text-[10px] text-[#7A8A8A] leading-relaxed cursor-pointer" onClick={toggleTerms}>
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
function CheckoutInput({ label, name, value, status, onChange, placeholder, icon, disabled, className }: any) {
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
                    disabled={disabled}
                    className={cn(
                        // FIX: pl-14 adds space for icon, pr-4 keeps right side clean
                        "w-full bg-[#EBF1FA] border rounded-3xl  py-4 pl-14 pr-4 text-sm transition-all duration-300 outline-none placeholder:text-[#D4D2CE]",
                        status === 'valid' ? "border-[#5A7A6A]/40 ring-1 ring-[#5A7A6A]/10" :
                            status === 'invalid' ? "border-red-200 bg-red-50/5" :
                                "border-[#E8E6E2] hover:border-[#D4D2CE] focus:border-[#5A7A6A]",
                        className
                    )}
                />
            </div>
        </div>
    );
}