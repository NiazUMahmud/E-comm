-- ─────────────────────────────────────────────────────────────────────────────
-- Tires Inventory Upload  (23 products)
-- Prices: typical retail per-tire placeholders — update via admin dashboard
-- Stock: 1 unit each (no Pieces column in source data)
-- Run in: Supabase Dashboard → SQL Editor → New Query → RUN
-- ─────────────────────────────────────────────────────────────────────────────


-- ── Step 1: Create category + subcategories ───────────────────────────────────
DO $$
DECLARE
  cat_id uuid;
BEGIN
  INSERT INTO public.categories (name, slug, icon)
  VALUES ('Tires', 'tires', 'CircleDot')
  ON CONFLICT (slug) DO NOTHING;

  SELECT id INTO cat_id FROM public.categories WHERE slug = 'tires';

  INSERT INTO public.subcategories (category_id, name, slug)
  SELECT cat_id, s.name, s.slug
  FROM (VALUES
    ('Full-Size Truck',  'full-size-truck'),
    ('Compact SUV',      'compact-suv'),
    ('Electric SUV',     'electric-suv'),
    ('Midsize SUV',      'midsize-suv'),
    ('Midsize Sedan',    'midsize-sedan'),
    ('Compact Sedan',    'compact-sedan'),
    ('Midsize Truck',    'midsize-truck'),
    ('Compact Truck',    'compact-truck')
  ) AS s(name, slug)
  WHERE NOT EXISTS (
    SELECT 1 FROM public.subcategories
    WHERE category_id = cat_id AND slug = s.slug
  );

  RAISE NOTICE 'Tires category and subcategories ready.';
END $$;


-- ── Step 2: Insert 23 products ────────────────────────────────────────────────
INSERT INTO public.products
  (name, description, price, images, category, subcategory, brand,
   stock, rating, review_count, featured, tags, specifications)
VALUES

-- ── Full-Size Truck (4) ───────────────────────────────────────────────────────

('Ford F-150 All-Season Tire — 275/65R18',
 'OEM-spec all-season tire for Ford F-Series F-150. Size: 275/65R18. Load Index: 116, Speed Rating: T. Fits Base, XLT, and Lariat trims. Sold individually.',
 189.99, ARRAY['https://placehold.co/400x400/2d2d2d/ffffff?text=Tire'],
 'tires', 'full-size-truck', 'OEM Spec', 1, 0, 0, false,
 ARRAY['tire','all-season','truck','ford','f-150','275-65r18'],
 '{"serial":"TR-001","vehicle":"Ford F-Series (F-150)","tire_size":"275/65R18","rim_size":"18\"","load_index":"116","speed_rating":"T","tire_type":"All-Season / AT","bolt_pattern":"6×135mm","notes":"Base XLT; Lariat uses 275/65R18; Raptor 315/70R17"}'::jsonb),

('Chevrolet Silverado 1500 All-Season Tire — 265/65R18',
 'OEM-spec all-season tire for Chevrolet Silverado 1500. Size: 265/65R18. Load Index: 114, Speed Rating: T. Sold individually.',
 179.99, ARRAY['https://placehold.co/400x400/2d2d2d/ffffff?text=Tire'],
 'tires', 'full-size-truck', 'OEM Spec', 1, 0, 0, false,
 ARRAY['tire','all-season','truck','chevrolet','silverado','265-65r18'],
 '{"serial":"TR-002","vehicle":"Chevrolet Silverado 1500","tire_size":"265/65R18","rim_size":"18\"","load_index":"114","speed_rating":"T","tire_type":"All-Season","bolt_pattern":"6×139.7mm","notes":"LT trim varies; 20\" wheel option available"}'::jsonb),

('Ram 1500 All-Season Tire — 275/60R20',
 'OEM-spec all-season highway tire for Ram 1500 Pickup. Size: 275/60R20. Load Index: 115, Speed Rating: T. Sold individually.',
 199.99, ARRAY['https://placehold.co/400x400/2d2d2d/ffffff?text=Tire'],
 'tires', 'full-size-truck', 'OEM Spec', 1, 0, 0, false,
 ARRAY['tire','all-season','truck','ram','ram-1500','275-60r20'],
 '{"serial":"TR-006","vehicle":"Ram 1500 Pickup","tire_size":"275/60R20","rim_size":"20\"","load_index":"115","speed_rating":"T","tire_type":"All-Season / HT","bolt_pattern":"5×139.7mm","notes":"Big Horn base: 265/70R17; Rebel: 275/55R20"}'::jsonb),

('GMC Sierra 1500 All-Season Tire — 265/65R18',
 'OEM-spec all-season tire for GMC Sierra 1500. Size: 265/65R18. Load Index: 114, Speed Rating: T. Sold individually.',
 179.99, ARRAY['https://placehold.co/400x400/2d2d2d/ffffff?text=Tire'],
 'tires', 'full-size-truck', 'OEM Spec', 1, 0, 0, false,
 ARRAY['tire','all-season','truck','gmc','sierra','265-65r18'],
 '{"serial":"TR-007","vehicle":"GMC Sierra 1500","tire_size":"265/65R18","rim_size":"18\"","load_index":"114","speed_rating":"T","tire_type":"All-Season","bolt_pattern":"6×139.7mm","notes":"AT4 trim uses 265/60R20; Denali: 275/50R22"}'::jsonb),

-- ── Compact SUV (7) ───────────────────────────────────────────────────────────

('Toyota RAV4 All-Season Tire — 235/55R19',
 'OEM-spec all-season tire for Toyota RAV4. Size: 235/55R19. Load Index: 101, Speed Rating: V. Fits RAV4 Hybrid and PHEV. Sold individually.',
 169.99, ARRAY['https://placehold.co/400x400/2d2d2d/ffffff?text=Tire'],
 'tires', 'compact-suv', 'OEM Spec', 1, 0, 0, false,
 ARRAY['tire','all-season','suv','toyota','rav4','235-55r19'],
 '{"serial":"TR-003","vehicle":"Toyota RAV4","tire_size":"235/55R19","rim_size":"19\"","load_index":"101","speed_rating":"V","tire_type":"All-Season","bolt_pattern":"5×114.3mm","notes":"Hybrid & PHEV share same size; Adventure uses 225/65R17"}'::jsonb),

('Honda CR-V All-Season Tire — 235/55R18',
 'OEM-spec all-season tire for Honda CR-V. Size: 235/55R18. Load Index: 100, Speed Rating: V. Sold individually.',
 159.99, ARRAY['https://placehold.co/400x400/2d2d2d/ffffff?text=Tire'],
 'tires', 'compact-suv', 'OEM Spec', 1, 0, 0, false,
 ARRAY['tire','all-season','suv','honda','cr-v','235-55r18'],
 '{"serial":"TR-005","vehicle":"Honda CR-V","tire_size":"235/55R18","rim_size":"18\"","load_index":"100","speed_rating":"V","tire_type":"All-Season","bolt_pattern":"5×114.3mm","notes":"Hybrid uses same size; Sport Touring adds 19\""}'::jsonb),

('Chevrolet Equinox All-Season Tire — 225/65R17',
 'OEM-spec all-season tire for Chevrolet Equinox. Size: 225/65R17. Load Index: 102, Speed Rating: H. Sold individually.',
 144.99, ARRAY['https://placehold.co/400x400/2d2d2d/ffffff?text=Tire'],
 'tires', 'compact-suv', 'OEM Spec', 1, 0, 0, false,
 ARRAY['tire','all-season','suv','chevrolet','equinox','225-65r17'],
 '{"serial":"TR-009","vehicle":"Chevrolet Equinox","tire_size":"225/65R17","rim_size":"17\"","load_index":"102","speed_rating":"H","tire_type":"All-Season","bolt_pattern":"5×115mm","notes":"EV variant: 235/50R20; RS: 235/55R18"}'::jsonb),

('Nissan Rogue All-Season Tire — 225/65R17',
 'OEM-spec all-season tire for Nissan Rogue. Size: 225/65R17. Load Index: 102, Speed Rating: H. Sold individually.',
 149.99, ARRAY['https://placehold.co/400x400/2d2d2d/ffffff?text=Tire'],
 'tires', 'compact-suv', 'OEM Spec', 1, 0, 0, false,
 ARRAY['tire','all-season','suv','nissan','rogue','225-65r17'],
 '{"serial":"TR-012","vehicle":"Nissan Rogue","tire_size":"225/65R17","rim_size":"17\"","load_index":"102","speed_rating":"H","tire_type":"All-Season","bolt_pattern":"5×114.3mm","notes":"Sport trim: 225/55R19; same bolt as Altima"}'::jsonb),

('Kia Sportage All-Season Tire — 235/55R18',
 'OEM-spec all-season tire for Kia Sportage. Size: 235/55R18. Load Index: 100, Speed Rating: V. Fits PHEV/Hybrid variants. Sold individually.',
 159.99, ARRAY['https://placehold.co/400x400/2d2d2d/ffffff?text=Tire'],
 'tires', 'compact-suv', 'OEM Spec', 1, 0, 0, false,
 ARRAY['tire','all-season','suv','kia','sportage','235-55r18'],
 '{"serial":"TR-018","vehicle":"Kia Sportage","tire_size":"235/55R18","rim_size":"18\"","load_index":"100","speed_rating":"V","tire_type":"All-Season","bolt_pattern":"5×114.3mm","notes":"PHEV/Hybrid share same; X-Pro: 235/55R18 AT"}'::jsonb),

('Chevrolet Trax All-Season Tire — 205/60R17',
 'OEM-spec all-season tire for Chevrolet Trax. Size: 205/60R17. Load Index: 93, Speed Rating: H. Standard across all configurations. Sold individually.',
 139.99, ARRAY['https://placehold.co/400x400/2d2d2d/ffffff?text=Tire'],
 'tires', 'compact-suv', 'OEM Spec', 1, 0, 0, false,
 ARRAY['tire','all-season','suv','chevrolet','trax','205-60r17'],
 '{"serial":"TR-019","vehicle":"Chevrolet Trax","tire_size":"205/60R17","rim_size":"17\"","load_index":"93","speed_rating":"H","tire_type":"All-Season","bolt_pattern":"5×105mm","notes":"Single trim level; 17\" standard across all configs"}'::jsonb),

('Hyundai Tucson All-Season Tire — 235/55R18',
 'OEM-spec all-season tire for Hyundai Tucson. Size: 235/55R18. Load Index: 100, Speed Rating: V. Fits PHEV variant. Sold individually.',
 159.99, ARRAY['https://placehold.co/400x400/2d2d2d/ffffff?text=Tire'],
 'tires', 'compact-suv', 'OEM Spec', 1, 0, 0, false,
 ARRAY['tire','all-season','suv','hyundai','tucson','235-55r18'],
 '{"serial":"TR-020","vehicle":"Hyundai Tucson","tire_size":"235/55R18","rim_size":"18\"","load_index":"100","speed_rating":"V","tire_type":"All-Season","bolt_pattern":"5×114.3mm","notes":"N-Line: 235/50R19; PHEV: same base size"}'::jsonb),

-- ── Electric SUV (1) ──────────────────────────────────────────────────────────

('Tesla Model Y All-Season LRR Tire — 255/45R19',
 'OEM-spec low rolling resistance (LRR) all-season tire for Tesla Model Y. Size: 255/45R19. Load Index: 104, Speed Rating: W. Optimized for EV efficiency. Sold individually.',
 184.99, ARRAY['https://placehold.co/400x400/2d2d2d/ffffff?text=Tire'],
 'tires', 'electric-suv', 'OEM Spec', 1, 0, 0, false,
 ARRAY['tire','all-season','lrr','suv','tesla','model-y','electric','ev','255-45r19'],
 '{"serial":"TR-004","vehicle":"Tesla Model Y","tire_size":"255/45R19","rim_size":"19\"","load_index":"104","speed_rating":"W","tire_type":"All-Season (LRR)","bolt_pattern":"5×114.3mm","notes":"Long Range uses 255/45R20; Performance 255/35R21"}'::jsonb),

-- ── Midsize SUV (3) ───────────────────────────────────────────────────────────

('Ford Explorer All-Season Tire — 255/50R20',
 'OEM-spec all-season tire for Ford Explorer. Size: 255/50R20. Load Index: 109, Speed Rating: V. Sold individually.',
 179.99, ARRAY['https://placehold.co/400x400/2d2d2d/ffffff?text=Tire'],
 'tires', 'midsize-suv', 'OEM Spec', 1, 0, 0, false,
 ARRAY['tire','all-season','suv','ford','explorer','255-50r20'],
 '{"serial":"TR-013","vehicle":"Ford Explorer","tire_size":"255/50R20","rim_size":"20\"","load_index":"109","speed_rating":"V","tire_type":"All-Season","bolt_pattern":"5×114.3mm","notes":"Base: 245/60R18; ST: 255/45R20"}'::jsonb),

('Jeep Grand Cherokee All-Season Tire — 265/50R20',
 'OEM-spec all-season tire for Jeep Grand Cherokee. Size: 265/50R20. Load Index: 107, Speed Rating: V. Sold individually.',
 179.99, ARRAY['https://placehold.co/400x400/2d2d2d/ffffff?text=Tire'],
 'tires', 'midsize-suv', 'OEM Spec', 1, 0, 0, false,
 ARRAY['tire','all-season','suv','jeep','grand-cherokee','265-50r20'],
 '{"serial":"TR-014","vehicle":"Jeep Grand Cherokee","tire_size":"265/50R20","rim_size":"20\"","load_index":"107","speed_rating":"V","tire_type":"All-Season","bolt_pattern":"5×127mm","notes":"Trailhawk: 245/65R17 MT; Summit: 265/45R21"}'::jsonb),

('Subaru Outback All-Season Tire — 225/65R17',
 'OEM-spec all-season tire for Subaru Outback. Size: 225/65R17. Load Index: 102, Speed Rating: H. Sold individually.',
 154.99, ARRAY['https://placehold.co/400x400/2d2d2d/ffffff?text=Tire'],
 'tires', 'midsize-suv', 'OEM Spec', 1, 0, 0, false,
 ARRAY['tire','all-season','suv','subaru','outback','225-65r17'],
 '{"serial":"TR-015","vehicle":"Subaru Outback","tire_size":"225/65R17","rim_size":"17\"","load_index":"102","speed_rating":"H","tire_type":"All-Season","bolt_pattern":"5×100mm","notes":"Wilderness: 225/60R18; Onyx: 225/60R18"}'::jsonb),

-- ── Midsize Sedan (3) ─────────────────────────────────────────────────────────

('Toyota Camry All-Season Tire — 235/45R18',
 'OEM-spec all-season tire for Toyota Camry. Size: 235/45R18. Load Index: 94, Speed Rating: V. Fits XSE and TRD trims. Sold individually.',
 149.99, ARRAY['https://placehold.co/400x400/2d2d2d/ffffff?text=Tire'],
 'tires', 'midsize-sedan', 'OEM Spec', 1, 0, 0, false,
 ARRAY['tire','all-season','sedan','toyota','camry','235-45r18'],
 '{"serial":"TR-008","vehicle":"Toyota Camry","tire_size":"235/45R18","rim_size":"18\"","load_index":"94","speed_rating":"V","tire_type":"All-Season","bolt_pattern":"5×114.3mm","notes":"LE/SE: 215/55R17; XSE/TRD: 235/45R18"}'::jsonb),

('Honda Accord All-Season Tire — 235/45R18',
 'OEM-spec all-season tire for Honda Accord. Size: 235/45R18. Load Index: 94, Speed Rating: V. Sold individually.',
 154.99, ARRAY['https://placehold.co/400x400/2d2d2d/ffffff?text=Tire'],
 'tires', 'midsize-sedan', 'OEM Spec', 1, 0, 0, false,
 ARRAY['tire','all-season','sedan','honda','accord','235-45r18'],
 '{"serial":"TR-016","vehicle":"Honda Accord","tire_size":"235/45R18","rim_size":"18\"","load_index":"94","speed_rating":"V","tire_type":"All-Season","bolt_pattern":"5×114.3mm","notes":"LX: 225/50R17; Touring Hybrid: 235/40R19"}'::jsonb),

('Nissan Altima All-Season Tire — 215/55R17',
 'OEM-spec all-season tire for Nissan Altima. Size: 215/55R17. Load Index: 94, Speed Rating: V. Sold individually.',
 144.99, ARRAY['https://placehold.co/400x400/2d2d2d/ffffff?text=Tire'],
 'tires', 'midsize-sedan', 'OEM Spec', 1, 0, 0, false,
 ARRAY['tire','all-season','sedan','nissan','altima','215-55r17'],
 '{"serial":"TR-023","vehicle":"Nissan Altima","tire_size":"215/55R17","rim_size":"17\"","load_index":"94","speed_rating":"V","tire_type":"All-Season","bolt_pattern":"5×114.3mm","notes":"SL: 235/40R19; SR: 235/45R18"}'::jsonb),

-- ── Compact Sedan (2) ─────────────────────────────────────────────────────────

('Toyota Corolla All-Season Tire — 205/55R16',
 'OEM-spec all-season tire for Toyota Corolla. Size: 205/55R16. Load Index: 91, Speed Rating: V. Sold individually.',
 129.99, ARRAY['https://placehold.co/400x400/2d2d2d/ffffff?text=Tire'],
 'tires', 'compact-sedan', 'OEM Spec', 1, 0, 0, false,
 ARRAY['tire','all-season','sedan','toyota','corolla','205-55r16'],
 '{"serial":"TR-010","vehicle":"Toyota Corolla","tire_size":"205/55R16","rim_size":"16\"","load_index":"91","speed_rating":"V","tire_type":"All-Season","bolt_pattern":"5×100mm","notes":"XSE/XLE: 225/40R18; Hybrid: 195/65R15"}'::jsonb),

('Honda Civic All-Season Tire — 215/55R16',
 'OEM-spec all-season tire for Honda Civic. Size: 215/55R16. Load Index: 93, Speed Rating: V. Sold individually.',
 134.99, ARRAY['https://placehold.co/400x400/2d2d2d/ffffff?text=Tire'],
 'tires', 'compact-sedan', 'OEM Spec', 1, 0, 0, false,
 ARRAY['tire','all-season','sedan','honda','civic','215-55r16'],
 '{"serial":"TR-011","vehicle":"Honda Civic","tire_size":"215/55R16","rim_size":"16\"","load_index":"93","speed_rating":"V","tire_type":"All-Season","bolt_pattern":"5×114.3mm","notes":"Sport: 215/50R17; Si: 235/40R18; Type R: 265/30R19"}'::jsonb),

-- ── Midsize Truck (2) ─────────────────────────────────────────────────────────

('Toyota Tacoma All-Season Tire — 245/75R16',
 'OEM-spec all-season/AT tire for Toyota Tacoma. Size: 245/75R16. Load Index: 111, Speed Rating: S. Sold individually.',
 164.99, ARRAY['https://placehold.co/400x400/2d2d2d/ffffff?text=Tire'],
 'tires', 'midsize-truck', 'OEM Spec', 1, 0, 0, false,
 ARRAY['tire','all-season','at','truck','toyota','tacoma','245-75r16'],
 '{"serial":"TR-017","vehicle":"Toyota Tacoma","tire_size":"245/75R16","rim_size":"16\"","load_index":"111","speed_rating":"S","tire_type":"All-Season / AT","bolt_pattern":"6×139.7mm","notes":"TRD Pro: 265/70R16 BFG KO2; SR5: 245/75R16"}'::jsonb),

('GMC Canyon All-Season Tire — 255/70R17',
 'OEM-spec all-season/AT tire for GMC Canyon. Size: 255/70R17. Load Index: 112, Speed Rating: T. Sold individually.',
 169.99, ARRAY['https://placehold.co/400x400/2d2d2d/ffffff?text=Tire'],
 'tires', 'midsize-truck', 'OEM Spec', 1, 0, 0, false,
 ARRAY['tire','all-season','at','truck','gmc','canyon','255-70r17'],
 '{"serial":"TR-021","vehicle":"GMC Canyon","tire_size":"255/70R17","rim_size":"17\"","load_index":"112","speed_rating":"T","tire_type":"All-Season / AT","bolt_pattern":"6×139.7mm","notes":"AT4X: 265/65R17 MT; Denali: 255/55R20"}'::jsonb),

-- ── Compact Truck (1) ─────────────────────────────────────────────────────────

('Ford Maverick All-Season Tire — 225/65R17',
 'OEM-spec all-season tire for Ford Maverick compact truck. Size: 225/65R17. Load Index: 102, Speed Rating: H. Fits PHEV variant. Sold individually.',
 149.99, ARRAY['https://placehold.co/400x400/2d2d2d/ffffff?text=Tire'],
 'tires', 'compact-truck', 'OEM Spec', 1, 0, 0, false,
 ARRAY['tire','all-season','truck','ford','maverick','225-65r17'],
 '{"serial":"TR-022","vehicle":"Ford Maverick","tire_size":"225/65R17","rim_size":"17\"","load_index":"102","speed_rating":"H","tire_type":"All-Season","bolt_pattern":"5×114.3mm","notes":"FX4: 235/65R17 AT; PHEV uses same base"}'::jsonb);

-- ─────────────────────────────────────────────────────────────────────────────
-- Done! 23 tire products inserted.
-- ─────────────────────────────────────────────────────────────────────────────
