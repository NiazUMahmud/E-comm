-- ─────────────────────────────────────────────────────────────────────────────
-- Miscellaneous Inventory Upload  (6 products)
-- Prices: typical retail placeholders — update via admin dashboard
-- M-003 through M-006 assigned to items missing serial numbers in source sheet
-- Run in: Supabase Dashboard → SQL Editor → New Query → RUN
-- ─────────────────────────────────────────────────────────────────────────────


-- ── Step 1: Create category + subcategories ───────────────────────────────────
DO $$
DECLARE
  cat_id uuid;
BEGIN
  INSERT INTO public.categories (name, slug, icon)
  VALUES ('Miscellaneous', 'miscellaneous', 'Package')
  ON CONFLICT (slug) DO NOTHING;

  SELECT id INTO cat_id FROM public.categories WHERE slug = 'miscellaneous';

  INSERT INTO public.subcategories (category_id, name, slug)
  SELECT cat_id, s.name, s.slug
  FROM (VALUES
    ('Chargers & Cables', 'chargers-cables'),
    ('Phone Cases',       'phone-cases'),
    ('Accessories',       'accessories')
  ) AS s(name, slug)
  WHERE NOT EXISTS (
    SELECT 1 FROM public.subcategories
    WHERE category_id = cat_id AND slug = s.slug
  );

  RAISE NOTICE 'Miscellaneous category and subcategories ready.';
END $$;


-- ── Step 2: Insert 6 products ─────────────────────────────────────────────────
INSERT INTO public.products
  (name, description, price, images, category, subcategory, brand,
   stock, rating, review_count, featured, tags, specifications)
VALUES

-- ── Chargers & Cables (2) ─────────────────────────────────────────────────────

('Apple 12W USB-A Power Adapter',
 'Apple 12W USB-A power adapter. Refurbished. Compatible with iPhone, iPad, and iPod. Fast and reliable charging for Apple devices.',
 19.99, ARRAY['https://placehold.co/400x400/555555/ffffff?text=Apple'],
 'miscellaneous', 'chargers-cables', 'Apple', 1, 0, 0, false,
 ARRAY['apple','charger','usb-a','12w','power-adapter','refurbished'],
 '{"serial":"M-001","brand":"Apple","type":"USB-A Power Adapter","wattage":"12W","connector":"USB-A","condition":"Refurbished"}'::jsonb),

('Apple Lightning Cable',
 'Apple Lightning to USB-A cable. Refurbished. Compatible with iPhone, iPad, and iPod models with a Lightning connector.',
 14.99, ARRAY['https://placehold.co/400x400/555555/ffffff?text=Apple'],
 'miscellaneous', 'chargers-cables', 'Apple', 1, 0, 0, false,
 ARRAY['apple','lightning','cable','usb-a','charging-cable','refurbished'],
 '{"serial":"M-002","brand":"Apple","type":"Lightning to USB-A Cable","connector_1":"USB-A","connector_2":"Lightning","condition":"Refurbished"}'::jsonb),

-- ── Phone Cases (2) ───────────────────────────────────────────────────────────

('Apple iPhone 13 Silicone Case — Blue',
 'Genuine Apple silicone case for iPhone 13. Color: Blue. Brand new, sealed. Soft-touch finish with microfiber lining. Precise cutouts for all buttons and ports.',
 29.99, ARRAY['https://placehold.co/400x400/3a86ff/ffffff?text=iPhone+Case'],
 'miscellaneous', 'phone-cases', 'Apple', 1, 0, 0, false,
 ARRAY['apple','iphone-13','silicone-case','blue','phone-case','sealed'],
 '{"serial":"M-003","brand":"Apple","compatible_with":"iPhone 13","type":"Silicone Case","color":"Blue","condition":"Brand New Sealed"}'::jsonb),

('OtterBox Symmetry Series Case — iPhone 14 Plus (Clear)',
 'OtterBox Symmetry Series case with PopGrip for iPhone 14 Plus. Clear plastic with slim profile. Brand new, sealed. Drop-test certified protection.',
 49.99, ARRAY['https://placehold.co/400x400/888888/ffffff?text=OtterBox'],
 'miscellaneous', 'phone-cases', 'OtterBox', 1, 0, 0, false,
 ARRAY['otterbox','iphone-14-plus','symmetry-series','clear-case','popsocket','sealed','drop-proof'],
 '{"serial":"M-005","brand":"OtterBox","model":"Symmetry Series + Pop","compatible_with":"iPhone 14 Plus","type":"Hard Case with PopGrip","color":"Clear","condition":"Brand New Sealed"}'::jsonb),

-- ── Accessories (2) ───────────────────────────────────────────────────────────

('PopSocket PopGrip',
 'PopSocket PopGrip phone grip and stand. Plastic construction. Brand new. Collapses flat and expands for a secure grip or hands-free viewing. Compatible with most phone cases.',
 14.99, ARRAY['https://placehold.co/400x400/ff6b6b/ffffff?text=PopSocket'],
 'miscellaneous', 'accessories', 'PopSocket', 2, 0, 0, false,
 ARRAY['popsocket','popgrip','phone-grip','phone-stand','accessories'],
 '{"serial":"M-004","brand":"PopSocket","type":"PopGrip","material":"Plastic","condition":"Brand New","quantity_in_pack":"2"}'::jsonb),

('Speck Presidio Hard Shell Case — AirPods Pro',
 'Speck Presidio hard shell protective case for AirPods Pro. Slim design with secure snap-on fit. Protects against drops and scratches.',
 24.99, ARRAY['https://placehold.co/400x400/888888/ffffff?text=Speck'],
 'miscellaneous', 'accessories', 'Speck', 1, 0, 0, false,
 ARRAY['speck','presidio','airpods-pro','hard-shell','case','accessories','apple'],
 '{"serial":"M-006","brand":"Speck","model":"Presidio","compatible_with":"AirPods Pro","type":"Hard Shell Case","condition":"New"}'::jsonb);

-- ─────────────────────────────────────────────────────────────────────────────
-- Done! 6 miscellaneous products inserted.
-- Serials M-003 through M-006 were assigned to items missing serials in source.
-- ─────────────────────────────────────────────────────────────────────────────
