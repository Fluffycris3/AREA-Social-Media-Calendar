INSERT INTO brands (id, name, logo_text, color) VALUES
  ('luma', 'Luma Skincare', 'LU', 'linear-gradient(145deg, #f6b4c9, #be6b8b)'),
  ('north', 'North & Co.', 'NC', 'linear-gradient(145deg, #9fc4ee, #426d9d)'),
  ('terra', 'Terra Home', 'TH', 'linear-gradient(145deg, #afdfbf, #4c8767)'),
  ('atlas', 'Atlas Studio', 'AS', 'linear-gradient(145deg, #f1d765, #a67b2f)');

INSERT INTO posts (id, brand_id, publish_date, publish_time, title, channel, status, caption, thumbnail_url, card_color, audience, owner) VALUES
  (1, 'luma', '2026-01-07', '09:00', 'Winter glow launch', 'IG', 'Ready', 'Hydrated skin is the quiet luxury of January. Meet the new barrier cream, made for frosty mornings and late-night routines.', 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=900&q=80', '#f1d3df', 'Skincare loyalists', 'Mia'),
  (2, 'luma', '2026-01-14', '12:30', 'Creator routine reel', 'TT', 'Review', 'A 22-second routine showing cleanser, serum, cream, and SPF with a soft voiceover and pinned product links.', NULL, '#c8dcf7', 'New customers', 'Theo'),
  (3, 'north', '2026-01-08', '08:00', 'Founder note', 'LI', 'Draft', 'A calm reflection on building better client onboarding rituals for the new year.', NULL, '#f4df78', 'B2B prospects', 'Avery'),
  (4, 'north', '2026-01-21', '16:00', 'Case study carousel', 'IG', 'Scheduled', 'Five slides unpacking how one client reduced campaign review time by 38 percent.', NULL, '#d9d5cb', 'Marketing leads', 'Sam'),
  (5, 'terra', '2026-01-10', '10:30', 'Kitchen reveal', 'IG', 'Ready', 'Warm woods, practical storage, and the small design choices that make weekday cooking easier.', 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=900&q=80', '#bddfc7', 'Home renovators', 'Jules'),
  (6, 'terra', '2026-01-19', '14:00', 'Design tips thread', 'X', 'Draft', 'A practical thread on choosing finishes that age well instead of chasing fast trends.', NULL, '#f1d3df', 'DIY planners', 'Nora'),
  (7, 'atlas', '2026-01-13', '11:00', 'Brand refresh teaser', 'IG', 'Scheduled', 'A cropped first look at the new identity system with motion, type, and color details.', NULL, '#f4df78', 'Creative directors', 'Rae'),
  (8, 'atlas', '2026-01-27', '13:30', 'Process breakdown', 'LI', 'Review', 'A short written breakdown of naming, positioning, and design system handoff.', NULL, '#c8dcf7', 'Startup founders', 'Kai');

INSERT INTO post_notes (post_id, body, author_name) VALUES
  (1, 'Confirm final product claims before publishing.', 'Mia'),
  (2, 'Needs legal review on before/after framing.', 'Theo'),
  (3, 'Add two customer proof points.', 'Avery'),
  (4, 'Export final carousel at 1080x1350.', 'Sam');
