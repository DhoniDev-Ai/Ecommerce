"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/lib/supabase/client";
import type { Database } from "@/types/database";

type CartItem = Database['public']['Tables']['cart_items']['Row'];

interface CartContextType {
    isOpen: boolean;
    openCart: () => void;
    closeCart: () => void;
    itemCount: number;
    refreshCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [itemCount, setItemCount] = useState(0);

    const openCart = () => setIsOpen(true);
    const closeCart = () => setIsOpen(false);

    const refreshCart = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                setItemCount(0);
                return;
            }

            // Get user's cart
            const { data: cart } = await (supabase
                .from('carts') as any)
                .select('id')
                .eq('user_id', user.id)
                .single();

            if (!cart) {
                setItemCount(0);
                return;
            }

            // Count items in cart
            const { data: items, error } = await (supabase
                .from('cart_items') as any)
                .select('quantity')
                .eq('cart_id', cart.id);

            if (error) throw error;

            const total = items?.reduce((sum: number, item: any) => sum + item.quantity, 0) || 0;
            setItemCount(total);
        } catch (error) {
            console.error("Error refreshing cart:", error);
        }
    };

    // Listen for cart item additions
    useEffect(() => {
        const handleItemAdded = () => {
            refreshCart();
            openCart();
        };

        window.addEventListener('cart:item-added', handleItemAdded);
        return () => window.removeEventListener('cart:item-added', handleItemAdded);
    }, []);

    // Initial cart load and real-time subscription
    useEffect(() => {
        refreshCart();

        const setupRealtimeSubscription = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // Get user's cart
            const { data: cart } = await (supabase
                .from('carts') as any)
                .select('id')
                .eq('user_id', user.id)
                .single();

            if (!cart) return;

            // Subscribe to cart_items changes for this cart
            const channel = supabase
                .channel('cart-changes')
                .on(
                    'postgres_changes',
                    {
                        event: '*',
                        schema: 'public',
                        table: 'cart_items',
                        filter: `cart_id=eq.${cart.id}`
                    },
                    () => {
                        refreshCart();
                    }
                )
                .subscribe();

            return () => {
                supabase.removeChannel(channel);
            };
        };

        setupRealtimeSubscription();
    }, []);

    return (
        <CartContext.Provider value={{ isOpen, openCart, closeCart, itemCount, refreshCart }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCartContext() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error("useCartContext must be used within a CartProvider");
    }
    return context;
}
