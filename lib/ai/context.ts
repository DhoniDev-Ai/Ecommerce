import { supabase } from "@/lib/supabase/client";

export async function getProductContext() {
    try {
        const { data: products, error } = await supabase
            .from('products')
            .select('name, description, ingredients, benefits, wellness_goals, price, category, slug, image_urls')
            .order('name');

        if (error) {
            //console.error("Error fetching AI context:", error);
            return "Catalog currently unavailable.";
        }

        if (!products || products.length === 0) return "No products found in catalog.";

        // Format into a digestible string for the LLM
        const contextString = products.map(p => `
Product: ${p.name}
Slug: ${p.slug}
Category: ${p.category}
Price: ₹${p.price}
Image: ${p.image_urls?.[0] || ""}
Description: ${p.description}
Key Ingredients: ${Array.isArray(p.ingredients) ? p.ingredients.join(", ") : p.ingredients}
Benefits: ${Array.isArray(p.benefits) ? p.benefits.join(", ") : p.benefits}
Goals: ${Array.isArray(p.wellness_goals) ? p.wellness_goals.join(", ") : p.wellness_goals}
-------------------
`).join("\n");

        return `CURRENT PRODUCT CATALOG:\n${contextString}`;
    } catch (err) {
        //console.error("AI Context Error:", err);
        return "Catalog error.";
    }
}
