"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

interface AIContextType {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    messages: Message[];
    sendMessage: (content: string) => Promise<void>;
    isLoading: boolean;
    openWithContext: (initialMessage: string) => void;
    orderContext: string | null;
    setOrderContext: (context: string | null) => void;
}

const AIContext = createContext<AIContextType | undefined>(undefined);

export function AIProvider({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', content: "Hay! I am Aya. How can I help you find your balance today? 🌿" }
    ]);
    const [isLoading, setIsLoading] = useState(false);

    const [orderContext, setOrderContext] = useState<string | null>(null);

    const sendMessage = async (content: string) => {
        // Add user message immediately
        const userMsg: Message = { role: 'user', content };
        setMessages(prev => [...prev, userMsg]);
        setIsLoading(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: [...messages, userMsg].map(m => ({ role: m.role, content: m.content })),
                    orderContext: orderContext // Pass the context
                })
            });

            if (!response.ok) throw new Error("Failed to fetch");

            const data = await response.json();
            const aiMsg: Message = { role: 'assistant', content: data.content };

            setMessages(prev => [...prev, aiMsg]);
        } catch (error) {
            //console.error(error);
            setMessages(prev => [...prev, { role: 'assistant', content: "I'm having trouble connecting to the source. Please try again in a moment. ✨" }]);
        } finally {
            setIsLoading(false);
        }
    };

    const openWithContext = (initialMessage: string) => {
        setIsOpen(true);
        // Only send if it's different from the last user message to avoid dupes
        // Or simply pre-fill the input? Let's send it as a prompt.
        sendMessage(initialMessage);
    };

    return (
        <AIContext.Provider value={{ isOpen, setIsOpen, messages, sendMessage, isLoading, openWithContext, orderContext, setOrderContext }}>
            {children}
        </AIContext.Provider>
    );
}

export const useAI = () => {
    const context = useContext(AIContext);
    if (!context) throw new Error("useAI must be used within an AIProvider");
    return context;
};
