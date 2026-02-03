import React, { memo } from "react";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/utils/cn";

interface CheckoutInputProps {
    label: string;
    name: string;
    value: string;
    status?: 'valid' | 'invalid' | null;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder: string;
    icon?: React.ReactNode;
    disabled?: boolean;
    className?: string;
    maxLength?: number;
}

export const CheckoutInput = memo(function CheckoutInput({
    label, name, value, status, onChange, placeholder, icon, disabled, className, maxLength
}: CheckoutInputProps) {
    return (
        <div className="space-y-3 group relative">
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
                    maxLength={maxLength}
                    className={cn(
                        "w-full bg-[#EBF1FA] border rounded-3xl py-4 pl-14 pr-4 text-sm transition-all duration-300 outline-none placeholder:text-[#D4D2CE]",
                        status === 'valid' ? "border-[#5A7A6A]/40 ring-1 ring-[#5A7A6A]/10" :
                            status === 'invalid' ? "border-red-200 bg-red-50/5" :
                                "border-[#E8E6E2] hover:border-[#D4D2CE] focus:border-[#5A7A6A]",
                        disabled && "opacity-60 cursor-not-allowed bg-[#E8E6E2]/50",
                        className
                    )}
                />
            </div>
        </div>
    );
});
