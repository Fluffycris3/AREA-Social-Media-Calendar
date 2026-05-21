# AREA Social Calendar

Internal AREA social media planning dashboard for the 2026 content calendar.

## What is included

- AREA-branded dashboard using the supplied logos.
- Default all-brand view with AREA, AREA Learn, AREA Wireless, and AREA DRIVE.
- Monday-Friday calendar grid with times down the left side.
- Search with clickable preview suggestions.
- Add-post form for title, brand, date, time, owner, status, channels, content, notes, image upload, and video upload.
- Post detail preview with social media sizing: `1080 x 1080`, `1080 x 1920`, or `1200 x 628`.
- SQL-ready schema in `database/schema.sql` with brands, posts, post channels, post notes, and dashboard notes.

## Run locally

Open `index.html` in a browser, or run a local server:

```bash
cd social-media-calendar
python3 -m http.server 8080
```

Then visit `http://localhost:8080`.

## GitHub Pages

If the files are inside a folder named `social-media-calendar`, the live URL will be:

```text
https://fluffycris3.github.io/AREA-Social-Media-Calendar/social-media-calendar/
```

If `index.html`, `styles.css`, `app.js`, `assets/`, and `database/` are moved to the repository root, the live URL will be:

```text
https://fluffycris3.github.io/AREA-Social-Media-Calendar/
```

## SQL integration path

The prototype currently stores added posts and notes in `localStorage`. For a production internal tool:

1. Create tables from `database/schema.sql`.
2. Load sample content from `database/seed.sql`.
3. Replace the in-browser `posts` array in `app.js` with API calls.
4. Store uploaded media in a file bucket or server directory and save the public/internal URL in `posts.media_url`.
5. Save channels to `post_channels`, post notes to `post_notes`, and dashboard notes to `dashboard_notes`.
