-- ─────────────────────────────────────────────────────────────────────────────
-- Hot Wheels Inventory Upload  (40 products)
-- Run in: Supabase Dashboard → SQL Editor → New Query → RUN
--
-- BEFORE RUNNING: make sure the "Hot Wheels" category exists in your categories
-- table (slug = 'hot-wheels'). Create it from the admin dashboard if it doesn't.
-- ─────────────────────────────────────────────────────────────────────────────


-- ── Step 1: Create category + subcategories ───────────────────────────────────
DO $$
DECLARE
  hw_cat_id uuid;
BEGIN
  -- Create the Hot Wheels category if it doesn't exist yet
  INSERT INTO public.categories (name, slug, icon)
  VALUES ('Hot Wheels', 'hot-wheels', 'Car')
  ON CONFLICT (slug) DO NOTHING;

  SELECT id INTO hw_cat_id FROM public.categories WHERE slug = 'hot-wheels';

  -- Insert each subcategory only if it does not already exist for this category
  INSERT INTO public.subcategories (category_id, name, slug)
  SELECT hw_cat_id, s.name, s.slug
  FROM (VALUES
    ('Boulevard',       'boulevard'),
    ('Timeless Icons',  'timeless-icons'),
    ('Circuit Legends', 'circuit-legends'),
    ('Euro Speed',      'euro-speed'),
    ('Fast & Furious',  'fast-furious'),
    ('Thrill Climbers', 'thrill-climbers'),
    ('Car Culture',     'car-culture'),
    ('JDM',             'jdm'),
    ('Race Day',        'race-day'),
    ('Silver Series',   'silver-series'),
    ('Pop Culture',     'pop-culture'),
    ('Matchbox',        'matchbox')
  ) AS s(name, slug)
  WHERE NOT EXISTS (
    SELECT 1 FROM public.subcategories
    WHERE category_id = hw_cat_id AND slug = s.slug
  );

  RAISE NOTICE 'Subcategories ready.';
END $$;


-- ── Step 2: Insert all 40 products ───────────────────────────────────────────
-- Prices : singles $9.99 | Car Culture 2-Pack $16.99
-- Stock  : from Pieces column in inventory sheet
-- Images : placeholder — update via admin dashboard

INSERT INTO public.products
  (name, description, price, images, category, subcategory, brand,
   stock, rating, review_count, featured, tags, specifications)
VALUES

-- ────────────────────────── BOULEVARD (6) ───────────────────────────────────

('''17 Ford GT',
 '1:64 scale Hot Wheels die-cast. ''17 Ford GT from the Boulevard series (#130). Color: Orange/Gold. Condition: New.',
 9.99, ARRAY['https://placehold.co/400x400/1c3557/ffffff?text=Hot+Wheels'],
 'hot-wheels', 'boulevard', 'Hot Wheels', 2, 0, 0, false,
 ARRAY['hot-wheels','die-cast','collectible','boulevard','ford'],
 '{"serial":"HW-001","series":"Boulevard","series_number":"130","color":"Orange/Gold","scale":"1:64","condition":"New"}'::jsonb),

('Nissan 300ZX Bi-Turbo',
 '1:64 scale Hot Wheels die-cast. Nissan 300ZX Bi-Turbo from the Boulevard series (#141). Color: White/Gray. Condition: New.',
 9.99, ARRAY['https://placehold.co/400x400/1c3557/ffffff?text=Hot+Wheels'],
 'hot-wheels', 'boulevard', 'Hot Wheels', 1, 0, 0, false,
 ARRAY['hot-wheels','die-cast','collectible','boulevard','nissan'],
 '{"serial":"HW-008","series":"Boulevard","series_number":"141","color":"White/Gray","scale":"1:64","condition":"New"}'::jsonb),

('''98 Toyota Altezza',
 '1:64 scale Hot Wheels die-cast. ''98 Toyota Altezza from the Boulevard series (#129). Color: Yellow. Condition: New.',
 9.99, ARRAY['https://placehold.co/400x400/1c3557/ffffff?text=Hot+Wheels'],
 'hot-wheels', 'boulevard', 'Hot Wheels', 1, 0, 0, false,
 ARRAY['hot-wheels','die-cast','collectible','boulevard','toyota'],
 '{"serial":"HW-015","series":"Boulevard","series_number":"129","color":"Yellow","scale":"1:64","condition":"New"}'::jsonb),

('Maserati MC20',
 '1:64 scale Hot Wheels die-cast. Maserati MC20 from the Boulevard series (#127). Color: White. Condition: New.',
 9.99, ARRAY['https://placehold.co/400x400/1c3557/ffffff?text=Hot+Wheels'],
 'hot-wheels', 'boulevard', 'Hot Wheels', 1, 0, 0, false,
 ARRAY['hot-wheels','die-cast','collectible','boulevard','maserati'],
 '{"serial":"HW-016","series":"Boulevard","series_number":"127","color":"White","scale":"1:64","condition":"New"}'::jsonb),

('''80 Mercedes-Benz 500 SLC Rallye',
 '1:64 scale Hot Wheels die-cast. ''80 Mercedes-Benz 500 SLC Rallye from the Boulevard series (#131). Color: Silver. Condition: New.',
 9.99, ARRAY['https://placehold.co/400x400/1c3557/ffffff?text=Hot+Wheels'],
 'hot-wheels', 'boulevard', 'Hot Wheels', 1, 0, 0, false,
 ARRAY['hot-wheels','die-cast','collectible','boulevard','mercedes-benz'],
 '{"serial":"HW-024","series":"Boulevard","series_number":"131","color":"Silver","scale":"1:64","condition":"New"}'::jsonb),

('Mitsubishi Pajero Evolution',
 '1:64 scale Hot Wheels die-cast. Mitsubishi Pajero Evolution from the Boulevard series (#133). Color: White. Condition: New.',
 9.99, ARRAY['https://placehold.co/400x400/1c3557/ffffff?text=Hot+Wheels'],
 'hot-wheels', 'boulevard', 'Hot Wheels', 1, 0, 0, false,
 ARRAY['hot-wheels','die-cast','collectible','boulevard','mitsubishi'],
 '{"serial":"HW-027","series":"Boulevard","series_number":"133","color":"White","scale":"1:64","condition":"New"}'::jsonb),


-- ─────────────────────── TIMELESS ICONS (2) ─────────────────────────────────

('Porsche Carrera GT',
 '1:64 scale Hot Wheels die-cast. Porsche Carrera GT from the Timeless Icons series (3/5). Color: Yellow. Condition: New.',
 9.99, ARRAY['https://placehold.co/400x400/1c3557/ffffff?text=Hot+Wheels'],
 'hot-wheels', 'timeless-icons', 'Hot Wheels', 2, 0, 0, true,
 ARRAY['hot-wheels','die-cast','collectible','timeless-icons','porsche'],
 '{"serial":"HW-002","series":"Timeless Icons","series_number":"3/5","color":"Yellow","scale":"1:64","condition":"New"}'::jsonb),

('Koenigsegg Agera R',
 '1:64 scale Hot Wheels die-cast. Koenigsegg Agera R from the Timeless Icons series (2/5). Color: Purple. Condition: New.',
 9.99, ARRAY['https://placehold.co/400x400/1c3557/ffffff?text=Hot+Wheels'],
 'hot-wheels', 'timeless-icons', 'Hot Wheels', 2, 0, 0, true,
 ARRAY['hot-wheels','die-cast','collectible','timeless-icons','koenigsegg'],
 '{"serial":"HW-005","series":"Timeless Icons","series_number":"2/5","color":"Purple","scale":"1:64","condition":"New"}'::jsonb),


-- ─────────────────────── CIRCUIT LEGENDS (1) ────────────────────────────────

('Porsche 917KH',
 '1:64 scale Hot Wheels die-cast. Porsche 917KH from the Circuit Legends series (3/5). Color: Red/White. Condition: New.',
 9.99, ARRAY['https://placehold.co/400x400/1c3557/ffffff?text=Hot+Wheels'],
 'hot-wheels', 'circuit-legends', 'Hot Wheels', 1, 0, 0, true,
 ARRAY['hot-wheels','die-cast','collectible','circuit-legends','porsche','racing'],
 '{"serial":"HW-003","series":"Circuit Legends","series_number":"3/5","color":"Red/White","scale":"1:64","condition":"New"}'::jsonb),


-- ──────────────────────── EURO SPEED (4) ────────────────────────────────────

('Bugatti Bolide',
 '1:64 scale Hot Wheels die-cast. Bugatti Bolide from the Euro Speed series (1/5). Color: Blue. Condition: New.',
 9.99, ARRAY['https://placehold.co/400x400/1c3557/ffffff?text=Hot+Wheels'],
 'hot-wheels', 'euro-speed', 'Hot Wheels', 1, 0, 0, false,
 ARRAY['hot-wheels','die-cast','collectible','euro-speed','bugatti'],
 '{"serial":"HW-004","series":"Euro Speed","series_number":"1/5","color":"Blue","scale":"1:64","condition":"New"}'::jsonb),

('Aston Martin Vantage GTE',
 '1:64 scale Hot Wheels die-cast. Aston Martin Vantage GTE from the Euro Speed series (2/5). Color: Silver. Condition: New.',
 9.99, ARRAY['https://placehold.co/400x400/1c3557/ffffff?text=Hot+Wheels'],
 'hot-wheels', 'euro-speed', 'Hot Wheels', 1, 0, 0, false,
 ARRAY['hot-wheels','die-cast','collectible','euro-speed','aston-martin'],
 '{"serial":"HW-021","series":"Euro Speed","series_number":"2/5","color":"Silver","scale":"1:64","condition":"New"}'::jsonb),

('McLaren Solus GT',
 '1:64 scale Hot Wheels die-cast. McLaren Solus GT from the Euro Speed series (4/5). Color: Orange. Condition: New.',
 9.99, ARRAY['https://placehold.co/400x400/1c3557/ffffff?text=Hot+Wheels'],
 'hot-wheels', 'euro-speed', 'Hot Wheels', 1, 0, 0, false,
 ARRAY['hot-wheels','die-cast','collectible','euro-speed','mclaren'],
 '{"serial":"HW-022","series":"Euro Speed","series_number":"4/5","color":"Orange","scale":"1:64","condition":"New"}'::jsonb),

('Automobili Pininfarina Battista',
 '1:64 scale Hot Wheels die-cast. Automobili Pininfarina Battista from the Euro Speed series (5/5). Color: Green. Condition: New.',
 9.99, ARRAY['https://placehold.co/400x400/1c3557/ffffff?text=Hot+Wheels'],
 'hot-wheels', 'euro-speed', 'Hot Wheels', 1, 0, 0, false,
 ARRAY['hot-wheels','die-cast','collectible','euro-speed','pininfarina','electric'],
 '{"serial":"HW-023","series":"Euro Speed","series_number":"5/5","color":"Green","scale":"1:64","condition":"New"}'::jsonb),


-- ─────────────────────── FAST & FURIOUS (5) ─────────────────────────────────

('McLaren Senna',
 '1:64 scale Hot Wheels die-cast. McLaren Senna from the Fast & Furious series (5/5). Color: Red. Condition: New.',
 9.99, ARRAY['https://placehold.co/400x400/1c3557/ffffff?text=Hot+Wheels'],
 'hot-wheels', 'fast-furious', 'Hot Wheels', 1, 0, 0, false,
 ARRAY['hot-wheels','die-cast','collectible','fast-furious','mclaren'],
 '{"serial":"HW-006","series":"Fast & Furious","series_number":"5/5","color":"Red","scale":"1:64","condition":"New"}'::jsonb),

('Mercedes-Benz 500 SEL',
 '1:64 scale Hot Wheels die-cast. Mercedes-Benz 500 SEL from the Fast & Furious series (2/5). Color: Silver. Condition: New.',
 9.99, ARRAY['https://placehold.co/400x400/1c3557/ffffff?text=Hot+Wheels'],
 'hot-wheels', 'fast-furious', 'Hot Wheels', 1, 0, 0, false,
 ARRAY['hot-wheels','die-cast','collectible','fast-furious','mercedes-benz'],
 '{"serial":"HW-009","series":"Fast & Furious","series_number":"2/5","color":"Silver","scale":"1:64","condition":"New"}'::jsonb),

('W Motors Lykan HyperSport GT',
 '1:64 scale Hot Wheels die-cast. W Motors Lykan HyperSport GT from the Fast & Furious series (3/5). Color: Red. Condition: New.',
 9.99, ARRAY['https://placehold.co/400x400/1c3557/ffffff?text=Hot+Wheels'],
 'hot-wheels', 'fast-furious', 'Hot Wheels', 1, 0, 0, false,
 ARRAY['hot-wheels','die-cast','collectible','fast-furious','w-motors','hypercar'],
 '{"serial":"HW-010","series":"Fast & Furious","series_number":"3/5","color":"Red","scale":"1:64","condition":"New"}'::jsonb),

('1969 Ford Mustang Boss 302',
 '1:64 scale Hot Wheels die-cast. 1969 Ford Mustang Boss 302 from the Fast & Furious series (3/5). Color: White. Condition: New.',
 9.99, ARRAY['https://placehold.co/400x400/1c3557/ffffff?text=Hot+Wheels'],
 'hot-wheels', 'fast-furious', 'Hot Wheels', 1, 0, 0, false,
 ARRAY['hot-wheels','die-cast','collectible','fast-furious','ford','mustang','muscle-car'],
 '{"serial":"HW-011","series":"Fast & Furious","series_number":"3/5","color":"White","scale":"1:64","condition":"New"}'::jsonb),

('Nissan 370Z',
 '1:64 scale Hot Wheels die-cast. Nissan 370Z from the Fast & Furious series (3/5). Color: Silver. Condition: New.',
 9.99, ARRAY['https://placehold.co/400x400/1c3557/ffffff?text=Hot+Wheels'],
 'hot-wheels', 'fast-furious', 'Hot Wheels', 2, 0, 0, false,
 ARRAY['hot-wheels','die-cast','collectible','fast-furious','nissan','jdm'],
 '{"serial":"HW-020","series":"Fast & Furious","series_number":"3/5","color":"Silver","scale":"1:64","condition":"New"}'::jsonb),


-- ──────────────────────── CAR CULTURE (1) ───────────────────────────────────

('Mitsubishi Lancer Evo 2005 & Subaru Forester 2-Pack',
 '1:64 scale Hot Wheels Car Culture 2-Pack. Includes Mitsubishi Lancer Evolution 2005 (Red) and Subaru Forester (Blue). Condition: New.',
 16.99, ARRAY['https://placehold.co/400x400/1c3557/ffffff?text=Hot+Wheels'],
 'hot-wheels', 'car-culture', 'Hot Wheels', 1, 0, 0, false,
 ARRAY['hot-wheels','die-cast','collectible','car-culture','2-pack','mitsubishi','subaru','jdm'],
 '{"serial":"HW-007","series":"Car Culture 2-Pack","color":"Red/Blue","scale":"1:64","condition":"New","type":"2-Pack"}'::jsonb),


-- ─────────────────────── THRILL CLIMBERS (3) ────────────────────────────────

('Subaru Impreza WRX',
 '1:64 scale Hot Wheels die-cast. Subaru Impreza WRX from the Thrill Climbers series (1/5). Color: Yellow. Condition: New.',
 9.99, ARRAY['https://placehold.co/400x400/1c3557/ffffff?text=Hot+Wheels'],
 'hot-wheels', 'thrill-climbers', 'Hot Wheels', 1, 0, 0, false,
 ARRAY['hot-wheels','die-cast','collectible','thrill-climbers','subaru','rally'],
 '{"serial":"HW-012","series":"Thrill Climbers","series_number":"1/5","color":"Yellow","scale":"1:64","condition":"New"}'::jsonb),

('Mitsubishi Lancer Evolution VI',
 '1:64 scale Hot Wheels die-cast. Mitsubishi Lancer Evolution VI from the Thrill Climbers series (3/5). Color: Red. Condition: New.',
 9.99, ARRAY['https://placehold.co/400x400/1c3557/ffffff?text=Hot+Wheels'],
 'hot-wheels', 'thrill-climbers', 'Hot Wheels', 1, 0, 0, false,
 ARRAY['hot-wheels','die-cast','collectible','thrill-climbers','mitsubishi','rally'],
 '{"serial":"HW-013","series":"Thrill Climbers","series_number":"3/5","color":"Red","scale":"1:64","condition":"New"}'::jsonb),

('Mercedes-Benz 300 SEL 6.8 AMG',
 '1:64 scale Hot Wheels die-cast. Mercedes-Benz 300 SEL 6.8 AMG from the Thrill Climbers series (5/5). Color: Black. Condition: New.',
 9.99, ARRAY['https://placehold.co/400x400/1c3557/ffffff?text=Hot+Wheels'],
 'hot-wheels', 'thrill-climbers', 'Hot Wheels', 1, 0, 0, false,
 ARRAY['hot-wheels','die-cast','collectible','thrill-climbers','mercedes-benz','classic'],
 '{"serial":"HW-014","series":"Thrill Climbers","series_number":"5/5","color":"Black","scale":"1:64","condition":"New"}'::jsonb),


-- ───────────────────────── RACE DAY (1) ─────────────────────────────────────

('Corvette C8.R',
 '1:64 scale Hot Wheels die-cast. Corvette C8.R from the Race Day series (2/5). Color: White/Black. Condition: New.',
 9.99, ARRAY['https://placehold.co/400x400/1c3557/ffffff?text=Hot+Wheels'],
 'hot-wheels', 'race-day', 'Hot Wheels', 1, 0, 0, false,
 ARRAY['hot-wheels','die-cast','collectible','race-day','corvette','chevrolet','racing'],
 '{"serial":"HW-017","series":"Race Day","series_number":"2/5","color":"White/Black","scale":"1:64","condition":"New"}'::jsonb),


-- ──────────────────────────── JDM (2) ───────────────────────────────────────

('Toyota AE86 Sprinter Trueno',
 '1:64 scale Hot Wheels die-cast. Toyota AE86 Sprinter Trueno from the JDM series (2/5). Color: Orange/Brown. Condition: New.',
 9.99, ARRAY['https://placehold.co/400x400/1c3557/ffffff?text=Hot+Wheels'],
 'hot-wheels', 'jdm', 'Hot Wheels', 1, 0, 0, true,
 ARRAY['hot-wheels','die-cast','collectible','jdm','toyota','ae86','drift'],
 '{"serial":"HW-018","series":"JDM","series_number":"2/5","color":"Orange/Brown","scale":"1:64","condition":"New"}'::jsonb),

('Datsun 620',
 '1:64 scale Hot Wheels die-cast. Datsun 620 pickup from the JDM series (4/5). Color: Tan/Gold. Condition: New.',
 9.99, ARRAY['https://placehold.co/400x400/1c3557/ffffff?text=Hot+Wheels'],
 'hot-wheels', 'jdm', 'Hot Wheels', 1, 0, 0, false,
 ARRAY['hot-wheels','die-cast','collectible','jdm','datsun','nissan','truck'],
 '{"serial":"HW-019","series":"JDM","series_number":"4/5","color":"Tan/Gold","scale":"1:64","condition":"New"}'::jsonb),


-- ─────────────────────── SILVER SERIES (4) ──────────────────────────────────

('''70 Pontiac GTO Judge',
 '1:64 scale Hot Wheels die-cast. ''70 Pontiac GTO Judge from the Silver Series (4/5). Color: Green. Condition: New.',
 9.99, ARRAY['https://placehold.co/400x400/1c3557/ffffff?text=Hot+Wheels'],
 'hot-wheels', 'silver-series', 'Hot Wheels', 1, 0, 0, false,
 ARRAY['hot-wheels','die-cast','collectible','silver-series','pontiac','muscle-car','classic'],
 '{"serial":"HW-025","series":"Silver Series","series_number":"4/5","color":"Green","scale":"1:64","condition":"New"}'::jsonb),

('''06 Pontiac GTO',
 '1:64 scale Hot Wheels die-cast. ''06 Pontiac GTO from the Silver Series (2/5). Color: Yellow. Condition: New.',
 9.99, ARRAY['https://placehold.co/400x400/1c3557/ffffff?text=Hot+Wheels'],
 'hot-wheels', 'silver-series', 'Hot Wheels', 1, 0, 0, false,
 ARRAY['hot-wheels','die-cast','collectible','silver-series','pontiac','muscle-car'],
 '{"serial":"HW-029","series":"Silver Series","series_number":"2/5","color":"Yellow","scale":"1:64","condition":"New"}'::jsonb),

('''65 Pontiac Bonneville',
 '1:64 scale Hot Wheels die-cast. ''65 Pontiac Bonneville from the Silver Series (3/5). Color: Purple. Condition: New.',
 9.99, ARRAY['https://placehold.co/400x400/1c3557/ffffff?text=Hot+Wheels'],
 'hot-wheels', 'silver-series', 'Hot Wheels', 1, 0, 0, false,
 ARRAY['hot-wheels','die-cast','collectible','silver-series','pontiac','classic'],
 '{"serial":"HW-030","series":"Silver Series","series_number":"3/5","color":"Purple","scale":"1:64","condition":"New"}'::jsonb),

('1970 Road Runner',
 '1:64 scale Hot Wheels die-cast. 1970 Plymouth Road Runner from the Silver Series (4/5). Fast and Furious Tokyo Drift edition. Color: Silver. Condition: New.',
 9.99, ARRAY['https://placehold.co/400x400/1c3557/ffffff?text=Hot+Wheels'],
 'hot-wheels', 'silver-series', 'Hot Wheels', 1, 0, 0, false,
 ARRAY['hot-wheels','die-cast','collectible','silver-series','plymouth','muscle-car','fast-furious'],
 '{"serial":"HW-031","series":"Silver Series","series_number":"4/5","color":"Silver","scale":"1:64","condition":"New","notes":"Fast and Furious Tokyo Drift edition"}'::jsonb),


-- ─────────────────────── POP CULTURE (1) ────────────────────────────────────

('Back to the Future Time Machine 1955',
 '1:64 scale Hot Wheels die-cast. The iconic Back to the Future DeLorean Time Machine (1955 version) from the Pop Culture series. Color: Silver. Condition: New.',
 9.99, ARRAY['https://placehold.co/400x400/1c3557/ffffff?text=Hot+Wheels'],
 'hot-wheels', 'pop-culture', 'Hot Wheels', 1, 0, 0, true,
 ARRAY['hot-wheels','die-cast','collectible','pop-culture','back-to-the-future','delorean','movie-car'],
 '{"serial":"HW-028","series":"Pop Culture","color":"Silver","scale":"1:64","condition":"New"}'::jsonb),


-- ──────────────────────── MATCHBOX (10) ─────────────────────────────────────

('2023 Ford E-Transit Custom',
 '1:64 scale Matchbox die-cast. 2023 Ford E-Transit Custom (#117/125). Color: Silver. Condition: New.',
 9.99, ARRAY['https://placehold.co/400x400/e60000/ffffff?text=Matchbox'],
 'hot-wheels', 'matchbox', 'Matchbox', 1, 0, 0, false,
 ARRAY['matchbox','die-cast','collectible','ford','electric','van'],
 '{"serial":"HW-026","series":"Matchbox","series_number":"117/125","color":"Silver","scale":"1:64","condition":"New"}'::jsonb),

('1941 Cadillac Series 62 Convertible Coupe',
 '1:64 scale Matchbox die-cast. 1941 Cadillac Series 62 Convertible Coupe (#59/100). Color: Blue. Condition: New.',
 9.99, ARRAY['https://placehold.co/400x400/e60000/ffffff?text=Matchbox'],
 'hot-wheels', 'matchbox', 'Matchbox', 1, 0, 0, false,
 ARRAY['matchbox','die-cast','collectible','cadillac','classic','convertible'],
 '{"serial":"HW-032","series":"Matchbox","series_number":"59/100","color":"Blue","scale":"1:64","condition":"New"}'::jsonb),

('Morgan Plus Four',
 '1:64 scale Matchbox die-cast. Morgan Plus Four (#66/100). Color: Cream. Condition: New.',
 9.99, ARRAY['https://placehold.co/400x400/e60000/ffffff?text=Matchbox'],
 'hot-wheels', 'matchbox', 'Matchbox', 1, 0, 0, false,
 ARRAY['matchbox','die-cast','collectible','morgan','british','roadster'],
 '{"serial":"HW-033","series":"Matchbox","series_number":"66/100","color":"Cream","scale":"1:64","condition":"New"}'::jsonb),

('''19 Jeep Renegade',
 '1:64 scale Matchbox die-cast. ''19 Jeep Renegade (#16/100). Color: Red. Condition: New.',
 9.99, ARRAY['https://placehold.co/400x400/e60000/ffffff?text=Matchbox'],
 'hot-wheels', 'matchbox', 'Matchbox', 1, 0, 0, false,
 ARRAY['matchbox','die-cast','collectible','jeep','suv','off-road'],
 '{"serial":"HW-034","series":"Matchbox","series_number":"16/100","color":"Red","scale":"1:64","condition":"New"}'::jsonb),

('1968 Chevy C10',
 '1:64 scale Matchbox die-cast. 1968 Chevy C10 pickup (#19/100). Color: Blue. Condition: New.',
 9.99, ARRAY['https://placehold.co/400x400/e60000/ffffff?text=Matchbox'],
 'hot-wheels', 'matchbox', 'Matchbox', 1, 0, 0, false,
 ARRAY['matchbox','die-cast','collectible','chevrolet','truck','classic'],
 '{"serial":"HW-035","series":"Matchbox","series_number":"19/100","color":"Blue","scale":"1:64","condition":"New"}'::jsonb),

('2016 Nissan Sentra',
 '1:64 scale Matchbox die-cast. 2016 Nissan Sentra (#9/100). Color: Red. Condition: New.',
 9.99, ARRAY['https://placehold.co/400x400/e60000/ffffff?text=Matchbox'],
 'hot-wheels', 'matchbox', 'Matchbox', 1, 0, 0, false,
 ARRAY['matchbox','die-cast','collectible','nissan','sedan'],
 '{"serial":"HW-036","series":"Matchbox","series_number":"9/100","color":"Red","scale":"1:64","condition":"New"}'::jsonb),

('Audi E-Tron',
 '1:64 scale Matchbox die-cast. Audi E-Tron (#5/100). Color: Red. Condition: New.',
 9.99, ARRAY['https://placehold.co/400x400/e60000/ffffff?text=Matchbox'],
 'hot-wheels', 'matchbox', 'Matchbox', 1, 0, 0, false,
 ARRAY['matchbox','die-cast','collectible','audi','electric','suv'],
 '{"serial":"HW-037","series":"Matchbox","series_number":"5/100","color":"Red","scale":"1:64","condition":"New"}'::jsonb),

('Tesla Model S',
 '1:64 scale Matchbox die-cast. Tesla Model S (#89/100). Color: Red. Condition: New.',
 9.99, ARRAY['https://placehold.co/400x400/e60000/ffffff?text=Matchbox'],
 'hot-wheels', 'matchbox', 'Matchbox', 1, 0, 0, false,
 ARRAY['matchbox','die-cast','collectible','tesla','electric','sedan'],
 '{"serial":"HW-038","series":"Matchbox","series_number":"89/100","color":"Red","scale":"1:64","condition":"New"}'::jsonb),

('2004 Mazda RX-8',
 '1:64 scale Matchbox die-cast. 2004 Mazda RX-8 (#19/125). Color: White. Condition: New.',
 9.99, ARRAY['https://placehold.co/400x400/e60000/ffffff?text=Matchbox'],
 'hot-wheels', 'matchbox', 'Matchbox', 1, 0, 0, false,
 ARRAY['matchbox','die-cast','collectible','mazda','sports-car','rotary'],
 '{"serial":"HW-039","series":"Matchbox","series_number":"19/125","color":"White","scale":"1:64","condition":"New"}'::jsonb),

('''65 Austin Mini Van Lesney Edition',
 '1:64 scale Matchbox Lesney Edition die-cast. ''65 Austin Mini Van (2011 series). Color: Blue. Condition: New.',
 9.99, ARRAY['https://placehold.co/400x400/e60000/ffffff?text=Matchbox'],
 'hot-wheels', 'matchbox', 'Matchbox', 1, 0, 0, false,
 ARRAY['matchbox','die-cast','collectible','austin','mini','classic','lesney','british'],
 '{"serial":"HW-040","series":"Matchbox","series_number":"2011","color":"Blue","scale":"1:64","condition":"New"}'::jsonb);

-- ─────────────────────────────────────────────────────────────────────────────
-- Done! 40 products inserted.
-- Next steps:
--   1. Go to the admin dashboard → Products to verify all 40 appear
--   2. Update product images (click edit on each product)
--   3. Adjust "featured" flag on any products you want on the homepage
-- ─────────────────────────────────────────────────────────────────────────────
