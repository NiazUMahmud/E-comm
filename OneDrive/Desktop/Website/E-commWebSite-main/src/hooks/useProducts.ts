import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Product } from '../types';

function mapRow(row: any): Product {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    price: row.price,
    originalPrice: row.original_price ?? undefined,
    images: row.images,
    category: row.category,
    subcategory: row.subcategory ?? undefined,
    brand: row.brand,
    stock: row.stock,
    rating: row.rating,
    reviewCount: row.review_count,
    featured: row.featured,
    tags: row.tags,
    specifications: row.specifications,
  };
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data, error: err }) => {
        if (err) {
          console.error('Supabase error full:', JSON.stringify(err));
          setError(err.message);
        } else setProducts((data ?? []).map(mapRow));
        setLoading(false);
      });
  }, []);

  return { products, loading, error };
}

export function useProduct(id: string) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single()
      .then(({ data, error: err }) => {
        if (err) setError(err.message);
        else setProduct(data ? mapRow(data) : null);
        setLoading(false);
      });
  }, [id]);

  return { product, loading, error };
}
