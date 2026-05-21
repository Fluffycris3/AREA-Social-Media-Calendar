# Social Media Calendar Dashboard

Apple-inspired social media calendar for planning 2026 brand content. The prototype is dependency-free: open `index.html` directly or serve the folder locally.

## Features

- Horizontal 2026 calendar with month, quarter, and year views.
- Brand selector rail on the left that changes the calendar content.
- Post cards with image previews, channel, time, owner, status, and caption.
- Click any post to view content details and save post-specific notes.
- Dashboard notes button for general team notes.
- SQL-ready schema and seed data in `database/`.

## Run locally

Open `index.html` in a browser, or run a local server:

```bash
cd social-media-calendar
python3 -m http.server 8080
```

Then visit `http://localhost:8080`.

## SQL integration path

The current prototype uses in-browser sample data and `localStorage` for notes. To connect a backend:

1. Create the SQL tables from `database/schema.sql`.
2. Load sample content from `database/seed.sql`.
3. Replace the `brands` and `posts` arrays in `app.js` with API calls.
4. Save post notes to `post_notes` and dashboard notes to `dashboard_notes`.

## Publish to GitHub

```bash
cd "/Users/cmera/Documents/New project/social-media-calendar"
git init
git add .
git commit -m "Create social media calendar dashboard"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
git push -u origin main
```

For GitHub Pages, enable Pages in the repository settings and set the source to the `main` branch root.
