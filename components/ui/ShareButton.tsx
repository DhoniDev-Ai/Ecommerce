"use client";

import { Share2, Check, Copy } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ShareButtonProps {
    title: string;
    text?: string;
    url?: string;
    className?: string;
}

export function ShareButton({ title, text, url, className = "" }: ShareButtonProps) {
    const [copied, setCopied] = useState(false);

    const handleShare = async () => {
        const shareUrl = url || window.location.href;

        // Try Native Share API first (Mobile)
        if (navigator.share) {
            try {
                await navigator.share({
                    title,
                    text: text, // Don't fallback to title, causes "Title URL" copy behavior
                    url: shareUrl
                });
                return;
            } catch (err) {
                // Ignore abort errors
                console.log('Share aborted');
            }
        }

        // Fallback to Clipboard (Desktop)
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
        } catch (err) {
            console.warn('Clipboard API failed, trying legacy fallback', err);

            // Legacy Fallback for "Document not focused" errors
            try {
                const textArea = document.createElement("textarea");
                textArea.value = shareUrl;
                textArea.style.position = "fixed";
                textArea.style.left = "-9999px";
                textArea.style.top = "0";
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();

                const successful = document.execCommand('copy');
                document.body.removeChild(textArea);

                if (successful) {
                    setCopied(true);
                } else {
                    console.error('Legacy copy failed');
                }
            } catch (fallbackErr) {
                console.error('All copy methods failed', fallbackErr);
            }
        }

        if (copied) {
            // reset is handled in effect or timeout below
        }

        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="relative">
            <button
                onClick={handleShare}
                className={`flex items-center justify-center p-3 cursor-pointer rounded-full hover:bg-[#5A7A6A]/10 text-[#2D3A3A] transition-colors ${className}`}
                title="Share"
            >
                {copied ? <Check className="w-5 h-5 text-green-600" /> : <Share2 className="w-5 h-5" />}
            </button>
            <AnimatePresence>
                {copied && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-[#2D3A3A] text-[#F3F1ED] text-xs font-bold rounded-lg whitespace-nowrap pointer-events-none"
                    >
                        Link Copied!
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
