-- ─────────────────────────────────────────────────────────────────────────────
-- Lego Inventory Upload  (2 products)
-- Prices: typical retail placeholders — update via admin dashboard
-- Pieces column = stock count (LG-001: 2 units, LG-002: 1 unit)
-- Run in: Supabase Dashboard → SQL Editor → New Query → RUN
-- ─────────────────────────────────────────────────────────────────────────────


-- ── Step 1: Create category + subcategories ───────────────────────────────────
DO $$
DECLARE
  cat_id uuid;
BEGIN
  INSERT INTO public.categories (name, slug, icon)
  VALUES ('Lego', 'lego', 'ToyBrick')
  ON CONFLICT (slug) DO NOTHING;

  SELECT id INTO cat_id FROM public.categories WHERE slug = 'lego';

  INSERT INTO public.subcategories (category_id, name, slug)
  SELECT cat_id, s.name, s.slug
  FROM (VALUES
    ('Speed Champions', 'speed-champions')
  ) AS s(name, slug)
  WHERE NOT EXISTS (
    SELECT 1 FROM public.subcategories
    WHERE category_id = cat_id AND slug = s.slug
  );

  RAISE NOTICE 'Lego category and subcategories ready.';
END $$;


-- ── Step 2: Insert 2 products ─────────────────────────────────────────────────
INSERT INTO public.products
  (name, description, price, images, category, subcategory, brand,
   stock, rating, review_count, featured, tags, specifications)
VALUES

('Lego Speed Champions GP XP 2 Formula 1 — Set 77252',
 'Lego Speed Champions Formula 1 set. GP XP 2 (#77252). Complete set. Build and race your favorite F1 car. Condition: Complete.',
 22.99, ARRAY['https://placehold.co/400x400/ffcf00/000000?text=Lego'],
 'lego', 'speed-champions', 'Lego', 2, 0, 0, true,
 ARRAY['lego','speed-champions','formula-1','f1','racing','building-set','complete'],
 '{"serial":"LG-001","set_number":"77252","theme":"Speed Champions Formula 1","condition":"Complete","pieces":"Not specified"}'::jsonb),

('Lego Speed Champions Flash & Lightning McQueen — Set 77255',
 'Lego Speed Champions Disney Pixar Cars set. Flash and Lightning McQueen (#77255). Complete set. Relive the magic of Pixar Cars in Lego form. Condition: Complete.',
 22.99, ARRAY['https://placehold.co/400x400/ffcf00/000000?text=Lego'],
 'lego', 'speed-champions', 'Lego', 1, 0, 0, true,
 ARRAY['lego','speed-champions','disney','pixar','cars','lightning-mcqueen','building-set','complete'],
 '{"serial":"LG-002","set_number":"77255","theme":"Speed Champions Disney Pixar Cars","condition":"Complete","pieces":"Not specified"}'::jsonb);

-- ─────────────────────────────────────────────────────────────────────────────
-- Done! 2 Lego products inserted.
-- ─────────────────────────────────────────────────────────────────────────────
