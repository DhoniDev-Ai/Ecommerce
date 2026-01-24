"use client";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, X } from "lucide-react";
import { useEffect } from "react";

interface ToastProps {
    message: string;
    type: 'success' | 'error' | null;
    onClose: () => void;
}

export function Toast({ message, type, onClose }: ToastProps) {
    useEffect(() => {
        if (type) {
            const timer = setTimeout(onClose, 3000);
            return () => clearTimeout(timer);
        }
    }, [type, onClose]);

    return (
        <AnimatePresence>
            {type && (
                <motion.div
                    initial={{ opacity: 0, y: -20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.9 }}
                    className="fixed top-6 right-6 z-[100] flex items-center gap-3 bg-white/80 backdrop-blur-md border border-[#E8E6E2] px-6 py-4 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
                >
                    {type === 'success' ? (
                        <CheckCircle2 className="w-5 h-5 text-[#5A7A6A]" />
                    ) : (
                        <XCircle className="w-5 h-5 text-red-400" />
                    )}
                    <span className="text-xs font-bold text-[#2D3A3A] tracking-wider uppercase">
                        {message}
                    </span>
                    <button onClick={onClose} className="ml-4 hover:bg-black/5 p-1 rounded-full transition-colors">
                        <X className="w-3 h-3 text-[#7A8A8A]" />
                    </button>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
