"use client";
import { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo, useRef } from "react";
import { supabase } from "@/lib/supabase/client";

interface CartContextType {
    isOpen: boolean;
    openCart: () => void;
    closeCart: () => void;
    cartItems: any[];
    addToCart: (product: any, quantity?: number) => void;
    removeFromCart: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    itemCount: number;
    cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [cartItems, setCartItems] = useState<any[]>([]);
    const [isHydrated, setIsHydrated] = useState(false);
    const [user, setUser] = useState<any>(null);

    // Ref to prevent multiple syncs running at once
    const isSyncing = useRef(false);

    const openCart = useCallback(() => setIsOpen(true), []);
    const closeCart = useCallback(() => setIsOpen(false), []);

    // 1. PURE HYDRATION: Load local data ONCE on mount
    useEffect(() => {
        const saved = localStorage.getItem("ayuniv_cart");
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed)) setCartItems(parsed);
            } catch (e) {
                console.error("Cart Recovery Error:", e);
            }
        }
        setIsHydrated(true);

        // Setup Auth Listener
        supabase.auth.getUser().then(({ data: { user } }) => {
            if (user) setUser(user);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    // 2. TRIGGER SYNC: When logged in and hydration is finished
    useEffect(() => {
        if (isHydrated && user && !isSyncing.current) {
            syncCartWithSupabase(user);
        }
    }, [isHydrated, user]);

    // 3. PERSISTENCE: Save guest cart ONLY if not logged in
    useEffect(() => {
        if (isHydrated && !user) {
            localStorage.setItem("ayuniv_cart", JSON.stringify(cartItems));
        }
    }, [cartItems, isHydrated, user]);

    // Cache for Cart ID to avoid repeated lookups
    const cartIdCache = useRef<string | null>(null);

    // --- REFINED SYNC HELPER ---
    const syncCartWithSupabase = async (currentUser: any) => {
        if (isSyncing.current) return;
        isSyncing.current = true;

        try {
            const localData = localStorage.getItem("ayuniv_cart");
            const localItems = localData ? JSON.parse(localData) : [];

            // Get or Create Cart ID (Optimized)
            let cartId = cartIdCache.current;
            if (!cartId) {
                let { data: cart } = await (supabase.from('carts') as any).select('id').eq('user_id', currentUser.id).single();
                if (!cart) {
                    const { data: newCart } = await (supabase.from('carts') as any).insert({ user_id: currentUser.id }).select('id').single();
                    cart = newCart;
                }
                cartId = cart.id;
                cartIdCache.current = cart.id;
            }

            // Fetch Remote Items
            const { data: remoteItems } = await (supabase.from('cart_items') as any).select('*, products(*)').eq('cart_id', cartId);

            // Merge: Remote is baseline, Local overrides or adds
            const mergedMap = new Map();
            remoteItems?.forEach((rItem: any) => {
                mergedMap.set(String(rItem.product_id), {
                    ...rItem.products,
                    id: String(rItem.product_id),
                    quantity: rItem.quantity,
                    price: rItem.price_at_add
                });
            });

            localItems.forEach((lItem: any) => {
                const pid = String(lItem.id);
                mergedMap.set(pid, { ...lItem, id: pid });
            });

            const mergedArray = Array.from(mergedMap.values());
            setCartItems(mergedArray);

            // Sync merged state back to Database
            for (const item of mergedArray) {
                await (supabase.from('cart_items') as any).upsert({
                    cart_id: cartId,
                    product_id: item.id,
                    quantity: item.quantity,
                    price_at_add: item.price
                }, { onConflict: 'cart_id,product_id' });
            }

            // CRITICAL: Clear local storage so this merge doesn't repeat forever
            localStorage.removeItem("ayuniv_cart");

        } catch (error) {
            console.error("Sync Error:", error);
        } finally {
            isSyncing.current = false;
        }
    };

    // --- ACTIONS ---

    const getCartId = async (userId: string) => {
        if (cartIdCache.current) return cartIdCache.current;

        const { data: cart } = await (supabase.from('carts') as any).select('id').eq('user_id', userId).single();
        if (cart) {
            cartIdCache.current = cart.id;
            return cart.id;
        }
        return null;
    };

    const addToCart = useCallback(async (product: any, quantity: number = 1) => {
        if (!product?.id) return;
        const productId = String(product.id);

        setCartItems((prev) => {
            const existing = prev.find((item) => String(item.id) === productId);
            if (existing) {
                return prev.map((item) =>
                    String(item.id) === productId ? { ...item, quantity: item.quantity + quantity } : item
                );
            }
            return [...prev, { ...product, quantity }];
        });
        openCart();

        if (user) {
            const cartId = await getCartId(user.id);
            if (cartId) {
                // Fetch current DB quantity to ensure accurate upsert
                const { data: dbItem } = await (supabase.from('cart_items') as any)
                    .select('quantity')
                    .match({ cart_id: cartId, product_id: productId })
                    .single();

                const newQty = (dbItem?.quantity || 0) + quantity;
                await (supabase.from('cart_items') as any).upsert({
                    cart_id: cartId,
                    product_id: productId,
                    quantity: newQty,
                    price_at_add: product.price
                }, { onConflict: 'cart_id,product_id' });
            }
        }
    }, [openCart, user]);

    const removeFromCart = useCallback(async (productId: string) => {
        setCartItems((prev) => prev.filter((item) => String(item.id) !== String(productId)));
        if (user) {
            const cartId = await getCartId(user.id);
            if (cartId) {
                await (supabase.from('cart_items') as any).delete().match({ cart_id: cartId, product_id: productId });
            }
        }
    }, [user]);

    const updateQuantity = useCallback(async (productId: string, quantity: number) => {
        if (quantity < 1) {
            removeFromCart(productId);
            return;
        }
        setCartItems((prev) =>
            prev.map((item) => String(item.id) === String(productId) ? { ...item, quantity } : item)
        );
        if (user) {
            const cartId = await getCartId(user.id);
            if (cartId) {
                await (supabase.from('cart_items') as any).update({ quantity }).match({ cart_id: cartId, product_id: productId });
            }
        }
    }, [removeFromCart, user]);

    const clearCart = useCallback(async () => {
        setCartItems([]);
        if (user) {
            const cartId = await getCartId(user.id);
            if (cartId) {
                await (supabase.from('cart_items') as any).delete().eq('cart_id', cartId);
            }
        }
    }, [user]);

    const itemCount = useMemo(() => cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0), [cartItems]);
    const cartTotal = useMemo(() => cartItems.reduce((sum, item) => sum + (parseFloat(item.price) * (item.quantity || 0)), 0), [cartItems]);

    return (
        <CartContext.Provider value={{ isOpen, openCart, closeCart, cartItems, addToCart, removeFromCart, updateQuantity, clearCart, itemCount, cartTotal }}>
            {children}
        </CartContext.Provider>
    );
}

export const useCartContext = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error("useCartContext must be used within a CartProvider");
    return context;
};