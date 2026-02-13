"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, Send, User, Bot, Minimize2, Phone } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useAI } from "@/context/AIContext";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/utils/cn";
import ReactMarkdown from "react-markdown";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { VoiceInterface } from "./VoiceInterface";

export function ChatWidget() {
    const { isOpen, setIsOpen, messages, sendMessage, isLoading } = useAI();
    const [input, setInput] = useState("");
    const [hasOpened, setHasOpened] = useState(false); // Track if user has seen the chat
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const pathname = usePathname();

    // Auto-scroll to bottom
    useEffect(() => {
        // Small timeout to ensure DOM is ready during anxiety animation
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
    }, [messages, isOpen]);

    useEffect(() => {
        // Mark as opened if it's open
        if (isOpen && !hasOpened) {
            setHasOpened(true);
        }
    }, [isOpen, hasOpened]);

    const [unreadCount, setUnreadCount] = useState(0);

    // Reset unread count when opened
    useEffect(() => {
        if (isOpen) {
            setUnreadCount(0);
        }
    }, [isOpen]);

    // Fetch Order Context if logged in
    const { user } = useAuth();
    const { setOrderContext, orderContext } = useAI();

    useEffect(() => {
        if (isOpen && user && !orderContext) {
            const fetchOrders = async () => {
                const { getRecentOrders } = await import("@/actions/store/orders");
                const orders: any[] = await getRecentOrders(user.id);

                if (orders.length > 0) {
                    const ctx = `User's Recent Orders:\n${orders.map((o: any) =>
                        `- Order #${o.id} (${o.date}): ${o.status}, Total: ₹${o.total}\n  Items: ${o.items}`
                    ).join("\n")}`;
                    setOrderContext(ctx);
                } else {
                    setOrderContext("User has no recent orders.");
                }
            };
            fetchOrders();
        }
    }, [isOpen, user, orderContext, setOrderContext]);

    // Track unread messages
    useEffect(() => {
        // Only increment if chat is CLOSED and new message arrives
        if (!isOpen && messages.length > 0) {
            const lastMsg = messages[messages.length - 1];
            if (lastMsg.role !== 'user') {
                setUnreadCount(prev => prev + 1);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [messages]); // Remove isOpen dependency to prevent count update when closing

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const msg = input;
        setInput(""); // clear early
        await sendMessage(msg);
    };

    const buttonVariants = {
        open: {
            scale: 0,
            rotate: -180,
            opacity: 0,
            pointerEvents: "none" as const // Type assertion for Framer Motion
        },
        closed: {
            scale: 1,
            rotate: 0,
            opacity: 1,
            pointerEvents: "auto" as const
        }
    };

    const chatVariants = {
        open: {
            opacity: 1,
            y: 0,
            scale: 1,
            pointerEvents: "auto" as const,
            transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const }
        },
        closed: {
            opacity: 0,
            y: 50,
            scale: 0.95,
            pointerEvents: "none" as const,
            transition: { duration: 0.3, ease: "easeIn" as const }
        }
    };

    const [isVoiceMode, setIsVoiceMode] = useState(false);

    if (pathname?.startsWith('/admin')) {
        return null;
    }

    return (
        <>
            {/* 1. Floating Trigger Button */}
            <motion.button
                initial="closed"
                animate={isOpen ? "open" : "closed"}
                variants={buttonVariants}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(true)}
                className="fixed  bottom-20 right-6 z-50 w-16 h-16 bg-[#2D3A3A] text-white rounded-full cursor-pointer shadow-2xl flex items-center justify-center border border-[#5A7A6A]/50 group"
            >
                <Image
                    src="/text_ai.webp"
                    alt="Aya"
                    width={64}
                    height={64}
                    className="w-full h-full object-[25%_top] rounded-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                    priority
                />

                {/* Notification Badge */}
                {(!hasOpened || unreadCount > 0) && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-1 left-1 w-5 h-5 bg-[#FF4D4D] rounded-full border-2 border-[#2D3A3A] flex items-center justify-center z-20"
                    >
                        <span className="text-[9px] font-bold text-white">{unreadCount > 0 ? unreadCount : 1}</span>
                    </motion.div>
                )}
            </motion.button>

            {/* 2. Chat Window */}
            <motion.div
                initial="closed"
                animate={isOpen ? "open" : "closed"}
                variants={chatVariants}
                className="fixed bottom-6 right-6 z-50 w-[90vw] md:w-[400px] h-[600px] max-h-[80vh] bg-white/80 backdrop-blur-2xl border border-white/20 rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden origin-bottom-right"
            >
                {/* Voice Interface Overlay */}
                <AnimatePresence>
                    {isVoiceMode && (
                        <VoiceInterface
                            onClose={() => setIsVoiceMode(false)}
                            onSendMessage={sendMessage}
                            messages={messages}
                        />
                    )}
                </AnimatePresence>

                {/* Header */}
                <div className="p-6 bg-[#2D3A3A] text-white flex justify-between items-center relative overflow-hidden shrink-0">
                    <div className="absolute inset-0 bg-[#5A7A6A] opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
                    <div className="relative z-10 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/10 overflow-hidden text-[#5A7A6A]">
                            <Image
                                src="/text_ai.webp"
                                alt="Aya"
                                width={40}
                                height={40}
                                className="w-full object-[25%_top] h-full object-cover"
                            />
                        </div>
                        <div>
                            <h3 className="font-heading text-lg leading-none">Aya</h3>
                            <p className="text-[10px] uppercase tracking-widest opacity-60">Wellness Guide</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 relative z-10">
                        {/* Voice Mode Disabled for now */}
                        {/* <button
                            onClick={() => setIsVoiceMode(true)}
                            className="w-8 h-8 rounded-full bg-white/10 flex items-center cursor-pointer justify-center hover:bg-white/20 transition-colors group"
                            title="Call Aya"
                        >
                            <Phone className="w-4 h-4 group-hover:text-green-300 transition-colors" />
                        </button> */}
                        <button
                            onClick={() => setIsOpen(false)}
                            className="w-8 h-8 rounded-full bg-white/10 flex items-center cursor-pointer justify-center hover:bg-white/20 transition-colors"
                        >
                            <Minimize2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto md:p-6 p-3 space-y-6 bg-[#FDFBF7]">
                    {messages.map((msg, idx) => (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            key={idx}
                            className={cn(
                                "flex md:gap-4 gap-2 max-w-[85%]",
                                msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
                            )}
                        >
                            {/* Icon Avatar */}
                            <div className={cn(
                                "w-8 h-8 rounded-full flex items-center justify-center shrink-0 border mt-1 overflow-hidden",
                                msg.role === 'user' ? "bg-white border-[#E8E6E2]" : "bg-[#2D3A3A] border-transparent"
                            )}>
                                {msg.role === 'user' ? (
                                    <User className="w-4 h-4 text-[#2D3A3A]" />
                                ) : (
                                    <Image
                                        src="/text_ai.webp"
                                        alt="Aya"
                                        width={32}
                                        height={32}
                                        className="w-full object-[25%_top] h-full object-cover"
                                    />
                                )}
                            </div>

                            {/* Bubble */}
                            <div className={cn(
                                "p-4 rounded-2xl text-sm leading-relaxed shadow-sm",
                                msg.role === 'user'
                                    ? "bg-white text-[#2D3A3A] rounded-tr-none border border-[#E8E6E2]"
                                    : "bg-[#2D3A3A] text-white/90 rounded-tl-none font-light"
                            )}>
                                <ReactMarkdown
                                    components={{
                                        p: ({ children }) => <div className="mb-2 last:mb-0">{children}</div>,
                                        a: ({ children, href, ...props }: any) => {
                                            // Check if it's a product card (link containing an image)
                                            const childArray = Array.isArray(children) ? children : [children];
                                            const firstChild: any = childArray[0];

                                            // ReactMarkdown renders images as an object with type "img" or "Image" if overridden
                                            const isImage = firstChild?.props?.node?.tagName === 'img' || firstChild?.type === 'img';

                                            if (isImage && firstChild.props) {
                                                const src = firstChild.props.src;
                                                const alt = firstChild.props.alt || "";
                                                // Parse "Name | Price"
                                                const [name, price] = alt.split("|").map((s: string) => s.trim());

                                                return (
                                                    <Link
                                                        href={href || "#"}
                                                        className="block mt-3 mb-2 bg-white p-1 rounded-2xl border border-[#E8E6E2] shadow-sm hover:shadow-md hover:border-[#5A7A6A] transition-all no-underline group overflow-hidden"
                                                    >
                                                        <div className="flex gap-4 items-center">
                                                            <div className=" md:h-16 h-12 bg-[#F3F1ED] rounded-xl p-1 shrink-0 border border-[#E8E6E2]/50 flex items-center justify-center">
                                                                <img src={src} alt={name} className="w-full h-full object-contain mix-blend-multiply" />
                                                            </div>
                                                            <div className="min-w-0 flex-1">
                                                                <h4 className="font-heading  max-sm:text-[9px] sm:text-xs  text-[#2D3A3A] truncate mb-1 group-hover:text-[#5A7A6A] transition-colors">{name.slice(0, 20) + "..." || "Product"}</h4>
                                                                <div className="flex items-center gap-2">
                                                                    <span className="text-[10px] font-bold text-[#5A7A6A] bg-[#5A7A6A]/10 px-1 py-0.5 rounded-md">{price}</span>

                                                                </div>
                                                            </div>

                                                        </div>
                                                    </Link>
                                                );
                                            }

                                            return (
                                                <Link href={href || "#"} {...props} className="text-[#5A7A6A] font-medium underline underline-offset-2 hover:text-white transition-colors" target="_blank">
                                                    {children}
                                                </Link>
                                            );
                                        },
                                        strong: ({ ...props }) => (
                                            <strong {...props} className="font-bold text-white" />
                                        ),
                                        ul: ({ ...props }) => (
                                            <ul {...props} className="list-disc pl-4 space-y-1 mt-2 mb-2" />
                                        ),
                                        li: ({ ...props }) => (
                                            <li {...props} className="pl-1" />
                                        )
                                    }}
                                >
                                    {msg.content}
                                </ReactMarkdown>
                            </div>
                        </motion.div>
                    ))}

                    {isLoading && (
                        <div className="flex gap-4 max-w-[85%]">
                            <div className="w-8 h-8 rounded-full bg-[#2D3A3A] flex items-center justify-center shrink-0 mt-1">
                                <Sparkles className="w-3 h-3 text-[#5A7A6A] animate-spin" />
                            </div>
                            <div className="bg-[#2D3A3A] p-4 rounded-2xl rounded-tl-none">
                                <div className="flex gap-1.5">
                                    <div className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                                    <div className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                                    <div className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white border-t border-[#E8E6E2] shrink-0">
                    <form onSubmit={handleSubmit} className="relative">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask Aya anything..."
                            className="w-full bg-[#F3F1ED] rounded-full pl-6 pr-14 py-4 text-sm focus:outline-none focus:border-[#5A7A6A] focus:ring-1 focus:ring-[#5A7A6A] transition-all placeholder:text-[#9AA09A] text-[#2D3A3A]"
                        />
                        <button
                            type="submit"
                            disabled={!input.trim() || isLoading}
                            className="absolute right-2 top-2 bottom-2 w-10 h-10 rounded-full bg-[#5A7A6A] text-white flex items-center justify-center hover:bg-[#4A6A5A] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            <Send className="w-4 h-4 ml-0.5" />
                        </button>
                    </form>
                    <p className="text-center text-[10px] text-[#9AA09A] mt-3 uppercase tracking-wider opacity-60">
                        Aya can make mistakes, so double check it
                    </p>
                </div>
            </motion.div>
        </>
    );
}
