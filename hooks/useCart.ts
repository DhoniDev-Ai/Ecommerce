"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import type { Database } from "@/types/database";

export function useCart() {
    const [addingProductId, setAddingProductId] = useState<string | null>(null);
    const [successProductId, setSuccessProductId] = useState<string | null>(null);

    const addToCart = async (productId: string, price: number, quantity: number = 1) => {
        setAddingProductId(productId);
        
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                // Trigger your Auth Logic here
                alert("Please join the Sanctuary.");
                return;
            }

            // ONE REQUEST: RPC now handles the User ID and Cart creation internally
            const { error } = await (supabase.rpc as any)('increment_cart_item', {
                p_user_id: user.id,
                p_product_id: productId,
                p_price_at_add: price,
                p_currency: 'INR',
                p_increment_qty: quantity
            });

            if (error) throw error;

            setSuccessProductId(productId);
            setTimeout(() => setSuccessProductId(null), 800);

            // Notify context to refresh count and open sidebar
            window.dispatchEvent(new CustomEvent('cart:item-added'));

        } catch (err: any) {
            console.error("Cart Alchemy Error:", err.message);
        } finally {
            setAddingProductId(null);
        }
    };

    return { 
        addToCart, 
        isAdding: (id: string) => addingProductId === id,
        isSuccess: (id: string) => successProductId === id 
    };
}