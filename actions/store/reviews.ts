"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export interface ReviewState {
    message: string;
    success?: boolean;
    errors?: {
        rating?: string[];
        comment?: string[];
    };
}

// 1. Check if user has purchased the product (Verified Buyer)
export async function checkVerifiedPurchase(productId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return false;

    // Correct Query: Join orders with order_items
    // If auto-detection fails, we might need to manually fetch or specify the FK if ambiguous.
    // However, usually "order_items(product_id)" works if FK exists.
    // Let's try fetching separately to avoid relation issues if schema is tricky.

    // Step 1: Get Order IDs
    const { data: orders, error: orderError } = await supabase
        .from('orders')
        .select('id')
        .eq('user_id', user.id)
        .neq('status', 'cancelled');

    if (orderError || !orders) {
        console.error("CheckVerified: Error fetching orders", orderError);
        return false;
    }

    if (orders.length === 0) return false;

    const orderIds = orders.map(o => o.id);

    // Step 2: Check if product exists in any of these orders
    const { data: items, error: itemsError } = await supabase
        .from('order_items')
        .select('product_id, order_id')
        .in('order_id', orderIds)
        .eq('product_id', productId);

    if (itemsError) {
        console.error("CheckVerified: Error fetching items", itemsError);
        return false;
    }

    // If we found any item matching our product ID in the user's orders
    const hasPurchased = items && items.length > 0;

    if (hasPurchased) {
        console.log(`CheckVerified: Verified purchase for product ${productId} in order ${items[0].order_id}`);
    } else {
        console.log(`CheckVerified: Product ${productId} not found in user orders.`);
    }

    return !!hasPurchased;
}

// 2. Submit or Update Review
export async function submitReview(
    prevState: ReviewState,
    formData: FormData
): Promise<ReviewState> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { message: "You must be logged in to review.", success: false };
    }

    const productId = formData.get("productId") as string;
    const rating = Number(formData.get("rating"));
    const comment = formData.get("comment") as string;

    // Basic Validation
    if (!rating || rating < 1 || rating > 5) {
        return { message: "Please select a star rating.", success: false };
    }
    if (!comment || comment.length < 10) {
        return { message: "Review must be at least 10 characters long.", success: false };
    }

    // Verify Purchase (Server-Side Enforcement)
    const isVerified = await checkVerifiedPurchase(productId);
    if (!isVerified) {
        return { message: "Only verified buyers can review this product.", success: false };
    }

    // Fetch User Profile for Name
    const { data: userProfile } = await supabase
        .from('users')
        .select('full_name')
        .eq('id', user.id)
        .single();

    const authorName = userProfile?.full_name || user.user_metadata?.full_name || "Verified Customer";

    // Use Admin Client to Write Review (Bypassing RLS for is_approved=true)
    const { supabaseAdmin } = await import("@/lib/supabase/admin");

    // Upsert Review (Insert or Update if exists)
    const { error } = await supabaseAdmin
        .from('reviews')
        .upsert({
            user_id: user.id,
            product_id: productId,
            rating,
            comment,
            author_name: authorName,
            is_approved: true, // Auto-approve
            updated_at: new Date().toISOString()
        }, {
            onConflict: 'user_id, product_id'
        });

    if (error) {
        console.error("Review Error:", error);
        return { message: "Failed to submit review. Please try again.", success: false };
    }

    revalidatePath(`/products/${productId}`); // Revalidate product page
    return { message: "Review submitted successfully!", success: true };
}

// 3. Delete Review
export async function deleteReview(productId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return;

    // Use Admin Client to bypass RLS for deletion
    const { supabaseAdmin } = await import("@/lib/supabase/admin");

    await supabaseAdmin
        .from('reviews')
        .delete()
        .match({ user_id: user.id, product_id: productId });

    revalidatePath(`/products/${productId}`);
}

// 4. Get Featured Testimonials (5-Star Reviews)
export async function getFeaturedTestimonials() {
    const supabase = await createClient();

    const { data: reviews, error } = await supabase
        .from('reviews')
        .select('id, author_name, rating, comment')
        .eq('rating', 5)
        .eq('is_approved', true)
        .order('created_at', { ascending: false })
        .limit(10);

    if (error) {
        console.error("Error fetching testimonials:", error);
        return [];
    }

    return reviews.map(r => ({
        id: r.id,
        name: r.author_name || "Verified Customer",
        rating: r.rating,
        text: r.comment || "" // Fallback to empty string for Type safety
    }));
}
