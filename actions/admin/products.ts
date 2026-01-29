"use server";

import { supabaseAdmin } from "@/lib/supabase/admin";
import { Database } from "@/types/database";
import { revalidatePath } from "next/cache";

type ProductInsert = Database['public']['Tables']['products']['Insert'];
type ProductUpdate = Database['public']['Tables']['products']['Update'];

export async function createProduct(data: ProductInsert) {
    try {
        const { error } = await supabaseAdmin
            .from('products')
            .insert(data);

        if (error) throw error;

        revalidatePath('/admin/products');
        revalidatePath('/products'); // Update public cache
        return { success: true };
    } catch (e: any) {
        console.error("Create Product Error:", e);
        return { success: false, error: e.message || "Failed to create product" };
    }
}

export async function updateProduct(id: string, data: ProductUpdate) {
    try {
        const { error } = await supabaseAdmin
            .from('products')
            .update(data)
            .eq('id', id);

        if (error) throw error;

        revalidatePath('/admin/products');
        revalidatePath(`/admin/products/${id}`);
        revalidatePath('/products');
        revalidatePath(`/products/${data.slug}`); // In case slug changed
        return { success: true };
    } catch (e: any) {
        console.error("Update Product Error:", e);
        return { success: false, error: e.message || "Failed to update product" };
    }
}

export async function deleteProduct(id: string) {
    try {
        const { error } = await supabaseAdmin
            .from('products')
            .delete()
            .eq('id', id);

        if (error) throw error;

        revalidatePath('/admin/products');
        revalidatePath('/products');
        return { success: true };
    } catch (e: any) {
        console.error("Delete Product Error:", e);
        return { success: false, error: e.message || "Failed to delete product" };
    }
}
