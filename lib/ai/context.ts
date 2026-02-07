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

        return `
CURRENT PRODUCT CATALOG:
${contextString}

=================================
AYUNIV POLICY CONTEXT (Use for Q&A)
=================================

1. SHIPPING RITUAL:
   - Processing: 1-2 business days (Jaipur Studio).
   - Cutoff: Orders before 12:00 PM IST ship next business morning ("The Sacred Hour").
   - Delivery: 5-7 business days across India. (Metro cities faster).
   - Cost: FREE for orders > ₹899. Standard fee below that. but for 1st moth there is an offer of free
   - Carriers: Shiprocket / Delhivery / Bluedart.

2. RETURN & REFUND RITUAL:
   - Window: before 7 days of delivery.
   -for cancel: before shipped only.
   - Eligibility: Item must be unused, sealed, and in original packaging.
   - Non-Returnable: Perishable goods (opened juices), personal care items (used oils/creams).
   - Process: Email info@ayuniv.com or use Dashboard -> Returns.
   - Timeline: Approval -> Ship Back -> Inspection -> Refund (5-7 business days to original method).
   - Damaged Items: Report within 24 hours with photos for immediate replacement.

3. CONTACT / SUPPORT:
   - Email: info@ayuniv.com (Replies ~1 hour).
   - WhatsApp: +91 7852011211 (Chat available on Contact Page).
   - Social: @ayuniv_official (Instagram).
`;
    } catch (err) {
        //console.error("AI Context Error:", err);
        return "Catalog error.";
    }
}
