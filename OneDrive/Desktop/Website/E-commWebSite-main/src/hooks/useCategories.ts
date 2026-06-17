import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Category } from '../types';

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('categories')
      .select('id, name, slug, icon, subcategories(id, name, slug)')
      .order('name')
      .then(({ data, error }) => {
        if (error) {
          console.error('Failed to fetch categories:', error.message);
        } else {
          setCategories(
            (data ?? []).map(row => ({
              id: row.id,
              name: row.name,
              slug: row.slug,
              icon: row.icon,
              subcategories: (row.subcategories ?? []) as Category['subcategories'],
            }))
          );
        }
        setLoading(false);
      });
  }, []);

  return { categories, loading };
}
