"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Database } from "@/types/database";
import { createProduct, updateProduct } from "@/actions/admin/products";
import { Plus, X, Upload, Loader2, Save } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { cn } from "@/utils/cn";
import Image from "next/image";

type Product = Database['public']['Tables']['products']['Row'];
type ProductInsert = Database['public']['Tables']['products']['Insert'];

export function ProductForm({ initialData }: { initialData?: Product }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    // Initialize form with defaults or existing data
    const [formData, setFormData] = useState<Partial<ProductInsert>>({
        name: initialData?.name || '',
        slug: initialData?.slug || '',
        description: initialData?.description || '',
        price: initialData?.price || 0,
        category: initialData?.category || '',
        stock_quantity: initialData?.stock_quantity || 0,
        low_stock_threshold: initialData?.low_stock_threshold || 5,
        is_active: initialData?.is_active ?? true,
        ingredients: initialData?.ingredients || [],
        benefits: initialData?.benefits || [],
        wellness_goals: initialData?.wellness_goals || [],
        image_urls: initialData?.image_urls || [],
        lifestyle_images: (initialData as any)?.lifestyle_images || [], // Cast for now until types update
        usage_instructions: initialData?.usage_instructions || '',

        // Complex JSON fields defaults
        nutrition_facts: initialData?.nutrition_facts || {
            calories: 0,
            sugar: "0g",
            fiber: "0g",
            serving_size: "1 tbsp"
        },
        ingredient_details: initialData?.ingredient_details || [],

        // Sale fields
        is_on_sale: initialData?.is_on_sale || false,
        sale_price: initialData?.sale_price || 0,
        sale_badge_text: initialData?.sale_badge_text || '',

        // Schema for FAQ: [{ question: string, answer: string }]
        faq: initialData?.faq || [],

        // SEO
        meta_description: initialData?.meta_description || '',
        meta_title: initialData?.meta_title || ''
    });

    // --- Handlers ---

    const handleChange = (field: keyof ProductInsert, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleArrayAdd = (field: 'ingredients' | 'benefits' | 'wellness_goals', value: string) => {
        if (!value.trim()) return;
        setFormData(prev => ({
            ...prev,
            [field]: [...(prev[field] as string[] || []), value]
        }));
    };

    const handleArrayRemove = (field: 'ingredients' | 'benefits' | 'wellness_goals', index: number) => {
        setFormData(prev => ({
            ...prev,
            [field]: (prev[field] as string[]).filter((_, i) => i !== index)
        }));
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'image_urls' | 'lifestyle_images' = 'image_urls') => {
        if (!e.target.files || e.target.files.length === 0) return;

        setLoading(true);
        const file = e.target.files[0];
        const fileExt = file.name.split('.').pop();
        const fileName = `${field === 'lifestyle_images' ? 'lifestyle_' : ''}${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `product-images/${fileName}`;

        try {
            const { error: uploadError } = await supabase.storage
                .from('product-images')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('product-images')
                .getPublicUrl(filePath);

            setFormData(prev => ({
                ...prev,
                [field]: [...(prev[field] as string[] || []), publicUrl]
            }));
        } catch (error) {
            console.error('Upload failed:', error);
            alert('Upload failed');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            let result;
            if (initialData?.id) {
                result = await updateProduct(initialData.id, formData as any); // Cast as any to avoid strict JSON type match issues for now
            } else {
                result = await createProduct(formData as any);
            }

            if (result.success) {
                router.push('/admin/products');
            } else {
                alert(result.error);
            }
        } catch (error) {
            console.error(error);
            alert("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-12 max-w-5xl mx-auto pb-20">
            {/* Header Actions */}
            <div className="flex justify-end sticky top-4 z-10">
                <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 px-8 py-4 bg-[#2D3A3A] text-white rounded-full font-bold uppercase tracking-widest hover:shadow-xl transition-all disabled:opacity-50"
                >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    {initialData ? 'Update Ritual' : 'Create Ritual'}
                </button>
            </div>

            {/* 1. Basics */}
            <section className="bg-white p-10 rounded-[2.5rem] border border-[#E8E6E2]/60 space-y-8">
                <h2 className="font-heading text-2xl text-[#2D3A3A] mb-6 border-b pb-4">Core Identity</h2>

                <div className="grid grid-cols-2 gap-8">
                    <Input label="Product Name" value={formData.name || ''} onChange={v => handleChange('name', v)} required />
                    <Input label="Slug (URL)" value={formData.slug || ''} onChange={v => handleChange('slug', v)} />
                    <Input label="Category" value={formData.category || ''} onChange={v => handleChange('category', v)} required />
                </div>

                <Input type="textarea" label="Description" value={formData.description || ''} onChange={v => handleChange('description', v)} rows={4} />

                <div className="grid grid-cols-1 gap-8">
                    <Input type="number" label="Price (₹)" value={formData.price || 0} onChange={v => handleChange('price', parseFloat(v))} required />
                    <Input type="number" label="Stock" value={formData.stock_quantity || 0} onChange={v => handleChange('stock_quantity', parseInt(v))} />
                    <div className="flex items-center gap-4 pt-8">
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input type="checkbox" checked={formData.is_active} onChange={e => handleChange('is_active', e.target.checked)} className="w-5 h-5 accent-[#5A7A6A]" />
                            <span className="text-sm font-bold uppercase tracking-wider text-[#5A6A6A]">Active</span>
                        </label>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6  border-t border-[#E8E6E2]/60">
                        <div className="flex flex-col gap-3">
                            <span className="text-xs uppercase font-bold tracking-widest text-[#7A8A8A]">Status</span>
                            <label className="flex items-center gap-3 cursor-pointer px-4 h-[48px] rounded-xl border border-[#E8E6E2] hover:border-[#5A7A6A] transition-colors bg-[#FAF9F7]">
                                <input
                                    type="checkbox"
                                    checked={formData.is_on_sale}
                                    onChange={e => handleChange('is_on_sale', e.target.checked)}
                                    className="w-4 h-4 accent-[#5A7A6A]"
                                />
                                <span className={cn(
                                    "text-sm font-bold uppercase tracking-wider transition-colors",
                                    formData.is_on_sale ? "text-[#D97757]" : "text-[#7A8A8A]"
                                )}>
                                    On Sale
                                </span>
                            </label>
                        </div>
                        <div className={cn("transition-opacity duration-300", formData.is_on_sale ? "opacity-100" : "opacity-50 pointer-events-none")}>
                            <Input
                                type="number"
                                label="Sale Price (₹)"
                                value={formData.sale_price || 0}
                                onChange={v => handleChange('sale_price', parseFloat(v))}
                            />
                        </div>
                        <div className={cn("transition-opacity duration-300", formData.is_on_sale ? "opacity-100" : "opacity-50 pointer-events-none")}>
                            <Input
                                label="Sale Badge (e.g. 20% OFF)"
                                value={formData.sale_badge_text || ''}
                                onChange={v => handleChange('sale_badge_text', v)}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. Media */}
            <section className="bg-white p-10 rounded-[2.5rem] border border-[#E8E6E2]/60 space-y-8">
                <h2 className="font-heading text-2xl text-[#2D3A3A] mb-6 border-b pb-4">Visuals</h2>

                <div className="grid grid-cols-4 gap-4">
                    {formData.image_urls?.map((url, i) => (
                        <div key={i} className="relative aspect-square rounded-xl overflow-hidden group border border-[#E8E6E2]">
                            <Image width={500} height={500} src={url} alt="" className="w-full h-full object-cover" />
                            <button
                                type="button"
                                onClick={() => setFormData(p => ({ ...p, image_urls: p.image_urls?.filter((_, idx) => idx !== i) }))}
                                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                    <label className={`aspect-square rounded-xl border-2 border-dashed border-[#E8E6E2] flex flex-col items-center justify-center transition-all ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-[#5A7A6A] hover:bg-[#F3F1ED]'}`}>
                        {loading ? (
                            <Loader2 className="w-8 h-8 text-[#5A7A6A] mb-2 animate-spin" />
                        ) : (
                            <Upload className="w-8 h-8 text-[#5A7A6A] mb-2" />
                        )}
                        <span className="text-xs uppercase font-bold text-[#7A8A8A]">{loading ? 'Uploading...' : 'Upload'}</span>
                        <input type="file" onChange={(e) => handleImageUpload(e, 'image_urls')} className="hidden" accept="image/*" disabled={loading} />
                    </label>
                </div>
            </section>

            {/* 2b. Lifestyle Media (Landscape) */}
            <section className="bg-white p-10 rounded-[2.5rem] border border-[#E8E6E2]/60 space-y-8">
                <h2 className="font-heading text-2xl text-[#2D3A3A] mb-6 border-b pb-4">Lifestyle Visuals (Landscape)</h2>

                <div className="grid grid-cols-2 gap-4">
                    {(formData as any).lifestyle_images?.map((url: string, i: number) => (
                        <div key={i} className="relative aspect-video rounded-xl overflow-hidden group border border-[#E8E6E2]">
                            <Image width={800} height={450} src={url} alt="" className="w-full h-full object-cover" />
                            <button
                                type="button"
                                onClick={() => setFormData(p => ({ ...p, lifestyle_images: (p as any).lifestyle_images?.filter((_: any, idx: number) => idx !== i) }))}
                                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all"
                            >
                                <X className="w-4 h-4" />
                            </button>
                            <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/50 text-white text-[10px] rounded backdrop-blur-md">
                                #{i + 1}
                            </div>
                        </div>
                    ))}
                    <label className={`aspect-video rounded-xl border-2 border-dashed border-[#E8E6E2] flex flex-col items-center justify-center transition-all ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-[#5A7A6A] hover:bg-[#F3F1ED]'}`}>
                        {loading ? (
                            <Loader2 className="w-8 h-8 text-[#5A7A6A] mb-2 animate-spin" />
                        ) : (
                            <Upload className="w-8 h-8 text-[#5A7A6A] mb-2" />
                        )}
                        <span className="text-xs uppercase font-bold text-[#7A8A8A]">{loading ? 'Uploading...' : 'Upload Landscape'}</span>
                        <input type="file" onChange={(e) => handleImageUpload(e, 'lifestyle_images')} className="hidden" accept="image/*" disabled={loading} />
                    </label>
                </div>
            </section>

            {/* 3. Composition (Arrays) */}
            <section className="bg-white p-10 rounded-[2.5rem] border border-[#E8E6E2]/60 space-y-8">
                <h2 className="font-heading text-2xl text-[#2D3A3A] mb-6 border-b pb-4">Composition</h2>

                <ArrayInput
                    label="Ingredients List"
                    items={formData.ingredients || []}
                    onAdd={v => handleArrayAdd('ingredients', v)}
                    onRemove={i => handleArrayRemove('ingredients', i)}
                />
                <ArrayInput
                    label="Key Benefits"
                    items={formData.benefits || []}
                    onAdd={v => handleArrayAdd('benefits', v)}
                    onRemove={i => handleArrayRemove('benefits', i)}
                />
                <ArrayInput
                    label="Wellness Goals"
                    items={formData.wellness_goals || []}
                    onAdd={v => handleArrayAdd('wellness_goals', v)}
                    onRemove={i => handleArrayRemove('wellness_goals', i)}
                />
            </section>

            {/* 4. Technical Details (JSON) */}
            <section className="bg-white p-10 rounded-[2.5rem] border border-[#E8E6E2]/60 space-y-8">
                <h2 className="font-heading text-2xl text-[#2D3A3A] mb-6 border-b pb-4">Technical Specs</h2>

                <div className="grid grid-cols-4 gap-4">
                    <Input label="Calories"
                        value={(formData.nutrition_facts as any)?.calories || ''} // Cast any for JSON access
                        onChange={v => handleChange('nutrition_facts', { ...(formData.nutrition_facts as any), calories: v })}
                    />
                    <Input label="Sugar"
                        value={(formData.nutrition_facts as any)?.sugar || ''}
                        onChange={v => handleChange('nutrition_facts', { ...(formData.nutrition_facts as any), sugar: v })}
                    />
                    <Input label="Fiber"
                        value={(formData.nutrition_facts as any)?.fiber || ''}
                        onChange={v => handleChange('nutrition_facts', { ...(formData.nutrition_facts as any), fiber: v })}
                    />
                    <Input label="Serving Size"
                        value={(formData.nutrition_facts as any)?.serving_size || ''}
                        onChange={v => handleChange('nutrition_facts', { ...(formData.nutrition_facts as any), serving_size: v })}
                    />
                </div>

                <Input type="textarea" label="Usage Instructions" value={formData.usage_instructions || ''} onChange={v => handleChange('usage_instructions', v)} />
            </section>

            {/* 5. FAQ Section */}
            <section className="bg-white p-10 rounded-[2.5rem] border border-[#E8E6E2]/60 space-y-8">
                <h2 className="font-heading text-2xl text-[#2D3A3A] mb-6 border-b pb-4">FAQs & Details</h2>

                <FAQInput
                    items={(formData.faq as any[]) || []}
                    onChange={(newFaq) => setFormData(prev => ({ ...prev, faq: newFaq }))}
                />
            </section>

            {/* 6. SEO Section */}
            <section className="bg-white p-10 rounded-[2.5rem] border border-[#E8E6E2]/60 space-y-8">
                <h2 className="font-heading text-2xl text-[#2D3A3A] mb-6 border-b pb-4">SEO Metadata</h2>
                <div className="space-y-6">
                    <Input label="Meta Title" value={formData.meta_title || ''} onChange={v => handleChange('meta_title', v)} />
                    <Input type="textarea" rows={3} label="Meta Description" value={formData.meta_description || ''} onChange={v => handleChange('meta_description', v)} />
                    <p className="text-xs text-[#7A8A8A]">If left empty, the product description will be used automatically.</p>
                </div>
            </section>

        </form>
    );
}

// --- Helpers ---

function Input({ label, value, onChange, type = "text", rows, required }: {
    label: string;
    value: string | number;
    onChange: (value: string) => void;
    type?: string;
    rows?: number;
    required?: boolean;
}) {
    return (
        <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-[0.2em] text-[#7A8A8A] font-bold">{label}</label>
            {type === 'textarea' ? (
                <textarea
                    rows={rows || 3}
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    className="w-full p-4 bg-[#Fdfbf7] border border-[#E8E6E2] rounded-xl focus:outline-none focus:border-[#5A7A6A] transition-colors"
                />
            ) : (
                <input
                    type={type}
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    required={required}
                    className="w-full p-4 bg-[#Fdfbf7] border border-[#E8E6E2] rounded-xl focus:outline-none focus:border-[#5A7A6A] transition-colors"
                />
            )}
        </div>
    );
}

function ArrayInput({ label, items, onAdd, onRemove }: {
    label: string;
    items: string[];
    onAdd: (value: string) => void;
    onRemove: (index: number) => void;
}) {
    const [temp, setTemp] = useState('');
    return (
        <div className="space-y-4">
            <label className="text-[10px] uppercase tracking-[0.2em] text-[#7A8A8A] font-bold">{label}</label>
            <div className="flex gap-2">
                <input
                    value={temp}
                    onChange={e => setTemp(e.target.value)}
                    onKeyDown={e => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            onAdd(temp);
                            setTemp('');
                        }
                    }}
                    placeholder="Type and press Enter..."
                    className="grow p-4 bg-[#Fdfbf7] border border-[#E8E6E2] rounded-xl focus:outline-none focus:border-[#5A7A6A]"
                />
                <button
                    type="button"
                    onClick={() => { onAdd(temp); setTemp(''); }}
                    className="px-6 bg-[#2D3A3A] text-white rounded-xl hover:bg-[#5A7A6A] transition-colors"
                >
                    <Plus className="w-5 h-5" />
                </button>
            </div>
            <div className="flex flex-wrap gap-2">
                {items.map((item: string, i: number) => (
                    <span key={i} className="px-4 py-2 bg-[#F3F1ED] rounded-full text-xs font-medium text-[#5A6A6A] flex items-center gap-2">
                        {item}
                        <button type="button" onClick={() => onRemove(i)} className="hover:text-red-500"><X className="w-3 h-3" /></button>
                    </span>
                ))}
            </div>
        </div>
    );
}

function FAQInput({ items, onChange }: { items: any[], onChange: (items: any[]) => void }) {
    const [q, setQ] = useState('');
    const [a, setA] = useState('');

    const handleAdd = () => {
        if (!q || !a) return;
        onChange([...items, { question: q, answer: a }]);
        setQ('');
        setA('');
    };

    return (
        <div className="space-y-6">
            <label className="text-[10px] uppercase tracking-[0.2em] text-[#7A8A8A] font-bold">Frequently Asked Questions</label>

            <div className="grid grid-cols-2 gap-4 items-start bg-[#Fdfbf7] p-4 rounded-xl border border-[#E8E6E2]">
                <input
                    placeholder="Question"
                    value={q}
                    onChange={e => setQ(e.target.value)}
                    className="w-full p-3 bg-white border border-[#E8E6E2] rounded-lg text-sm"
                />
                <textarea
                    placeholder="Answer"
                    value={a}
                    onChange={e => setA(e.target.value)}
                    className="w-full p-3 bg-white border border-[#E8E6E2] rounded-lg text-sm"
                    rows={1}
                />
                <button
                    type="button"
                    onClick={handleAdd}
                    className="md:col-span-2 w-full py-3 bg-[#2D3A3A] text-white rounded-lg text-xs font-bold uppercase"
                >
                    Add FAQ
                </button>
            </div>

            <div className="space-y-3">
                {items.map((item, i) => (
                    <div key={i} className="flex justify-between items-center p-4 bg-white border border-[#E8E6E2] rounded-xl">
                        <div>
                            <p className="font-bold text-[#2D3A3A] text-sm">{item.question}</p>
                            <p className="text-xs text-[#7A8A8A] mt-1">{item.answer}</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => onChange(items.filter((_, idx) => idx !== i))}
                            className="p-2 text-red-400 hover:text-red-600"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
