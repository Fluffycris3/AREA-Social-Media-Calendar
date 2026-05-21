INSERT INTO brands (id, name, logo_path, accent_color) VALUES
  ('area', 'AREA', './assets/area-logo.svg', '#003a5d'),
  ('learn', 'AREA Learn', './assets/area-learn-logo.svg', '#05ce7c'),
  ('wireless', 'AREA Wireless', './assets/area-wireless-logo.svg', '#03846d'),
  ('drive', 'AREA DRIVE', './assets/area-drive-logo.svg', '#1a7599');

INSERT INTO posts (id, brand_id, publish_date, publish_time, title, status, caption, owner, format, media_type, media_url, card_color) VALUES
  (101, 'area', '2026-05-18', '09:00', 'Weekly member update', 'Approved', 'A clean Monday update for Alberta REALTORS with reminders, deadlines, and links to member resources.', 'Communications', 'square', 'image', NULL, '#d8ecf5'),
  (102, 'learn', '2026-05-19', '10:30', 'Course registration reminder', 'Scheduled', 'Last call to register for the next AREA Learn session. Highlight CE value and the registration deadline.', 'Education', 'reel', 'image', NULL, '#dbf9ec'),
  (103, 'wireless', '2026-05-20', '13:00', 'Wireless savings carousel', 'In review', 'Show the Rogers offer in three clear slides: plan value, member benefit, and how to activate.', 'Partnerships', 'square', 'image', NULL, '#d8f2ed'),
  (104, 'area', '2026-05-21', '08:30', 'Market insights clip', 'Draft', 'Short post linking to the latest market insight with one stat, one takeaway, and one link.', 'Policy', 'fourFive', 'video', NULL, '#cfe4ef'),
  (105, 'drive', '2026-05-21', '15:00', 'AREA DRIVE testimonial', 'Approved', 'Member testimonial about fuel savings and why the program is easy to use on the road.', 'Partnerships', 'reel', 'video', NULL, '#d6edf7'),
  (106, 'learn', '2026-05-22', '11:30', 'Instructor spotlight', 'Draft', 'Introduce the instructor, their expertise, and why members should join the upcoming class.', 'Education', 'square', 'image', NULL, '#e0f8ee');

INSERT INTO post_channels (post_id, channel) VALUES
  (101, 'IG'), (101, 'FB'), (101, 'LinkedIn'),
  (102, 'IG'), (102, 'FB'),
  (103, 'IG'), (103, 'LinkedIn'),
  (104, 'X'), (104, 'LinkedIn'),
  (105, 'IG'), (105, 'FB'),
  (106, 'IG'), (106, 'FB'), (106, 'LinkedIn');

INSERT INTO post_notes (post_id, body, author_name) VALUES
  (101, 'Use the blue AREA frame and keep the CTA short.', 'Communications'),
  (102, 'Story version needs sticker space at bottom.', 'Education'),
  (103, 'Confirm partner logo spacing before approval.', 'Partnerships'),
  (104, 'Needs final stat from the report.', 'Policy'),
  (105, 'Use captions on the video for silent viewing.', 'Partnerships');
