-- ─────────────────────────────────────────────────────────────────────────────
-- Funko Pop Inventory Upload  (9 products)
-- Prices: typical retail placeholders — update via admin dashboard
-- FP-005 (Doc Ock) uploaded with stock=0 (marked Sold on eBay in inventory)
-- Run in: Supabase Dashboard → SQL Editor → New Query → RUN
-- ─────────────────────────────────────────────────────────────────────────────


-- ── Step 1: Create category + subcategories ───────────────────────────────────
DO $$
DECLARE
  cat_id uuid;
BEGIN
  INSERT INTO public.categories (name, slug, icon)
  VALUES ('Funko Pop', 'funko-pop', 'Star')
  ON CONFLICT (slug) DO NOTHING;

  SELECT id INTO cat_id FROM public.categories WHERE slug = 'funko-pop';

  INSERT INTO public.subcategories (category_id, name, slug)
  SELECT cat_id, s.name, s.slug
  FROM (VALUES
    ('Marvel',       'marvel'),
    ('Star Wars',    'star-wars'),
    ('Television',   'television'),
    ('Disney Pixar', 'disney-pixar'),
    ('Pin Mate',     'pin-mate')
  ) AS s(name, slug)
  WHERE NOT EXISTS (
    SELECT 1 FROM public.subcategories
    WHERE category_id = cat_id AND slug = s.slug
  );

  RAISE NOTICE 'Funko Pop category and subcategories ready.';
END $$;


-- ── Step 2: Insert 9 products ─────────────────────────────────────────────────
INSERT INTO public.products
  (name, description, price, images, category, subcategory, brand,
   stock, rating, review_count, featured, tags, specifications)
VALUES

-- ── Marvel (4) ───────────────────────────────────────────────────────────────

('Funko Pop! Thor — Marvel Art Series #49',
 'Funko Pop! Art Series vinyl figure. Thor from Marvel (Pop! Art Series #49). Unique painted canvas-style artwork design. Condition: Mint.',
 19.99, ARRAY['https://placehold.co/400x400/d62828/ffffff?text=Funko+Pop'],
 'funko-pop', 'marvel', 'Funko', 1, 0, 0, true,
 ARRAY['funko-pop','vinyl','collectible','marvel','thor','art-series'],
 '{"serial":"FP-001","pop_number":"49","series":"Marvel Pop! Art Series","type":"Art Series","condition":"Mint","scale":"Standard"}'::jsonb),

('Funko Pop! Captain America — Avengers Endgame #573',
 'Funko Pop! bobble-head vinyl figure. Captain America from Marvel Avengers Endgame (#573). Condition: Mint.',
 14.99, ARRAY['https://placehold.co/400x400/d62828/ffffff?text=Funko+Pop'],
 'funko-pop', 'marvel', 'Funko', 1, 0, 0, true,
 ARRAY['funko-pop','vinyl','collectible','marvel','captain-america','avengers','bobble-head'],
 '{"serial":"FP-004","pop_number":"573","series":"Marvel Avengers Endgame","type":"Bobble-Head","condition":"Mint","scale":"Standard"}'::jsonb),

('Funko Pop! Doc Ock — Marvel Spider-Man #1163',
 'Funko Pop! vinyl figure. Doc Ock from Marvel Spider-Man (#1163). Condition: Mint.',
 14.99, ARRAY['https://placehold.co/400x400/d62828/ffffff?text=Funko+Pop'],
 'funko-pop', 'marvel', 'Funko', 0, 0, 0, false,
 ARRAY['funko-pop','vinyl','collectible','marvel','spider-man','doc-ock','villain'],
 '{"serial":"FP-005","pop_number":"1163","series":"Marvel Spider-Man","type":"Vinyl Figure","condition":"Mint","scale":"Standard","notes":"Sold on eBay"}'::jsonb),

('Funko Pop! Stan Lee — Marvel #655',
 'Funko Pop! vinyl figure. Stan Lee Marvel legend (#655). A must-have for any Marvel collector. Condition: Mint.',
 19.99, ARRAY['https://placehold.co/400x400/d62828/ffffff?text=Funko+Pop'],
 'funko-pop', 'marvel', 'Funko', 1, 0, 0, true,
 ARRAY['funko-pop','vinyl','collectible','marvel','stan-lee','legend'],
 '{"serial":"FP-006","pop_number":"655","series":"Marvel","type":"Vinyl Figure","condition":"Mint","scale":"Standard"}'::jsonb),

-- ── Star Wars (1) ─────────────────────────────────────────────────────────────

('Funko Pop! Luke Skywalker & Yoda — Star Wars 40th ESB #363',
 'Funko Pop! bobble-head vinyl figure. Luke Skywalker and Yoda from Star Wars 40th Anniversary: The Empire Strikes Back (#363). Condition: Mint.',
 17.99, ARRAY['https://placehold.co/400x400/d62828/ffffff?text=Funko+Pop'],
 'funko-pop', 'star-wars', 'Funko', 1, 0, 0, true,
 ARRAY['funko-pop','vinyl','collectible','star-wars','luke-skywalker','yoda','40th-anniversary','bobble-head'],
 '{"serial":"FP-002","pop_number":"363","series":"Star Wars 40th Anniversary: The Empire Strikes Back","type":"Bobble-Head","condition":"Mint","scale":"Standard"}'::jsonb),

-- ── Television (2) ───────────────────────────────────────────────────────────

('Funko Pop! Michael Scott — The Office #1005',
 'Funko Pop! vinyl figure. Michael Scott from The Office — Pop! Television (#1005). That''s what she said! Condition: Mint.',
 14.99, ARRAY['https://placehold.co/400x400/d62828/ffffff?text=Funko+Pop'],
 'funko-pop', 'television', 'Funko', 1, 0, 0, false,
 ARRAY['funko-pop','vinyl','collectible','the-office','michael-scott','television'],
 '{"serial":"FP-003","pop_number":"1005","series":"The Office — Pop! Television","type":"Vinyl Figure","condition":"Mint","scale":"Standard"}'::jsonb),

('Funko Pop! Chandler Bing — Friends #700',
 'Funko Pop! vinyl figure. Chandler Bing from Friends — Pop! Television (#700). Could this BE any more collectible? Condition: Mint.',
 14.99, ARRAY['https://placehold.co/400x400/d62828/ffffff?text=Funko+Pop'],
 'funko-pop', 'television', 'Funko', 1, 0, 0, false,
 ARRAY['funko-pop','vinyl','collectible','friends','chandler-bing','television'],
 '{"serial":"FP-007","pop_number":"700","series":"Friends — Pop! Television","type":"Vinyl Figure","condition":"Mint","scale":"Standard"}'::jsonb),

-- ── Disney Pixar (1) ─────────────────────────────────────────────────────────

('Funko Dorbz! Joy — Disney Pixar Inside Out #294',
 'Funko Dorbz! vinyl figure. Joy from Disney Pixar Inside Out (#294). Rounded Dorbz collectible style. Condition: Mint.',
 11.99, ARRAY['https://placehold.co/400x400/d62828/ffffff?text=Funko+Pop'],
 'funko-pop', 'disney-pixar', 'Funko', 1, 0, 0, false,
 ARRAY['funko-pop','dorbz','vinyl','collectible','disney','pixar','inside-out','joy'],
 '{"serial":"FP-008","pop_number":"294","series":"Disney Pixar Inside Out","type":"Dorbz Vinyl Figure","condition":"Mint","scale":"Standard"}'::jsonb),

-- ── Pin Mate (1) ─────────────────────────────────────────────────────────────

('Pin Mate Batman Wooden Figure #24',
 'Pin Mate wooden collectible figure. Batman (#24). Hand-painted wood construction. A unique addition to any DC collection. Condition: Mint.',
 9.99, ARRAY['https://placehold.co/400x400/d62828/ffffff?text=Funko+Pop'],
 'funko-pop', 'pin-mate', 'Funko', 1, 0, 0, false,
 ARRAY['funko-pop','pin-mate','wood','collectible','dc','batman','wooden-figure'],
 '{"serial":"FP-009","pop_number":"24","series":"Pin Mate DC","type":"Wood Figure","condition":"Mint","scale":"Standard"}'::jsonb);

-- ─────────────────────────────────────────────────────────────────────────────
-- Done! 9 Funko Pop products inserted (FP-005 has stock=0 — sold on eBay).
-- ─────────────────────────────────────────────────────────────────────────────
