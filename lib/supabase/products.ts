import { supabase } from './client';
import { Product } from '@/types';

export interface ProductFilters {
  category?: string;
  wellness_goal?: string;
  ingredient?: string;
  search?: string;
}

export type ProductSortOption = 'popularity' | 'newest' | 'price_asc' | 'price_desc';

/**
 * Fetches products with optional filters and sorting
 */
export async function getProducts(
  filters?: ProductFilters,
  sort: ProductSortOption = 'popularity'
): Promise<Product[]> {
  let query = supabase
    .from('products')
    .select('*');

  // Apply filters
  if (filters?.category) {
    query = query.eq('category', filters.category);
  }
  if (filters?.wellness_goal) {
    query = query.contains('wellness_goals', [filters.wellness_goal]);
  }
  if (filters?.ingredient) {
    query = query.contains('ingredients', [filters.ingredient]);
  }
  if (filters?.search) {
    query = query.ilike('name', `%${filters.search}%`);
  }

  // Apply sorting
  switch (sort) {
    case 'popularity':
      query = query.order('popularity_score', { ascending: false });
      break;
    case 'newest':
      query = query.order('created_at', { ascending: false });
      break;
    case 'price_asc':
      query = query.order('price', { ascending: true });
      break;
    case 'price_desc':
      query = query.order('price', { ascending: false });
      break;
  }

  const { data, error } = await query;

  if (error) {
    if (error.name === 'AbortError' || error.message?.includes('AbortError')) return []; // Suppress AbortError
    //console.error('Error fetching products:', error);
    return [];
  }

  return data.map(mapProduct);
}

/**
 * Fetches a single product by slug
 */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    if (error.name === 'AbortError' || error.message?.includes('AbortError')) return null; // Suppress AbortError
    //console.error('Error fetching product:', error);
    return null;
  }

  return mapProduct(data);
}

/**
 * Fetches featured products for homepage
 */
export async function getFeaturedProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_featured', true)
    .order('popularity_score', { ascending: false })
    .limit(6);

  if (error) {
    if (error.name === 'AbortError' || error.message?.includes('AbortError')) return []; // Suppress AbortError
    //console.error('Error fetching featured products:', error);
    return [];
  }

  return data.map(mapProduct);
}

/**
 * Gets unique wellness goals from all products
 */
export async function getWellnessGoals(): Promise<string[]> {
  const { data, error } = await supabase
    .from('products')
    .select('wellness_goals');

  if (error) {
    //console.error('Error fetching wellness goals:', error);
    return [];
  }

  const allGoals = data.flatMap((p: { wellness_goals: string[] | null | undefined }) => p.wellness_goals || []);
  return [...new Set(allGoals)];
}

/**
 * Gets unique categories
 */
export async function getCategories(): Promise<string[]> {
  const { data, error } = await supabase
    .from('products')
    .select('category');

  if (error) {
    //console.error('Error fetching categories:', error);
    return [];
  }

  const allCategories = data.map((p: { category: string }) => p.category);
  return [...new Set(allCategories)];
}

function mapProduct(data: any): Product {
  return {
    ...data,
    stock_quantity: data.stock_quantity || 0,
    image_urls: Array.isArray(data.image_urls)
      ? data.image_urls
      : (typeof data.image_urls === 'string' ? [data.image_urls] : []),
    slug: data.slug || '',
    wellness_goals: data.wellness_goals || [],
    ingredients: data.ingredients || [],
    benefits: data.benefits || [],
  } as Product;
}
