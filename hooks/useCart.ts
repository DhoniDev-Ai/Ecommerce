import { useState, useCallback } from "react";
import { useCartContext } from "@/context/CartContext";

export function useCart() {
    const { addToCart: contextAddToCart } = useCartContext();
    const [addingId, setAddingId] = useState<string | null>(null);
    const [successId, setSuccessId] = useState<string | null>(null);

    const addToCart = useCallback(async (product: any, quantity: number = 1) => {
        const id = String(product.id);
        setAddingId(id);
        
        try {
            // Optical delay for luxury feel
            await new Promise(r => setTimeout(r, 400));
            
            contextAddToCart(product, quantity);

            setSuccessId(id);
            setTimeout(() => setSuccessId(null), 1500);
        } finally {
            setAddingId(null);
        }
    }, [contextAddToCart]);

    return { 
        addToCart, 
        isAdding: (id: string) => addingId === String(id),
        isSuccess: (id: string) => successId === String(id) 
    };
}