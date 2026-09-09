# Editing your website — a practical guide

This site is plain HTML + CSS + a little JavaScript. **No build step, no frameworks.**
You edit a file, save, and refresh the browser. That's it.

---

## 1. Preview it on your computer

From a terminal, run this once (from inside the `website/` folder):

```bash
cd ~/Desktop/Personal_website/website
python3 -m http.server 8747
```

Then open **http://localhost:8747** in your browser. Leave that terminal open while you work;
every time you save a file and refresh the page, you'll see your changes. Press `Ctrl+C` in the
terminal to stop the server.

> You can also just double-click an `.html` file to open it — but the local server is more accurate
> (some things behave differently over `file://`).

---

## 2. What each file is

```
website/
├── index.html          ← Home page
├── research.html       ← Research
├── publications.html   ← Publications
├── talks.html          ← Talks
├── experience.html     ← Experience (positions, teaching, summer schools)
├── leadership.html     ← Leadership & Outreach
├── awards.html         ← Awards & Achievements
├── news.html           ← In the News
├── assets/
│   ├── css/style.css   ← ALL styling / colors live here
│   ├── js/main.js      ← theme toggle, menu, hero animation
│   ├── favicon.svg     ← the little browser-tab icon
│   ├── Phong_Dang_CV.pdf   ← your CV (the "CV" link downloads this)
│   └── img/
│       ├── headshot.jpg    ← your photo
│       └── og-image.png    ← the social-media preview card
└── EDITING-GUIDE.md    ← this file
```

**Rule of thumb:** to change *words*, edit the `.html` file for that page. To change *looks*
(colors, spacing, fonts), edit `assets/css/style.css`.

---

## 3. The most common edits

Each "item" on a page is a repeating block. **The easiest way to add one is to copy an existing
block, paste it right below, and change the text.** Keep the `<tags>` intact.

### Add a publication  (`publications.html`)
Find a block like this and copy it. `<strong>` is what makes your name bold. Change the year
group by placing it under the right `<h2 class="year-head">`.

```html
<li class="pub">
  <span class="pub__idx">09</span>
  <div class="pub__body">
    <h3>Your new paper title</h3>
    <p class="pub__authors"><strong>P. Dang</strong>, A. Coauthor, B. Coauthor</p>
    <p class="pub__venue">Journal Name · vol. X, page · Year</p>
    <div class="pub__links"><a class="badge badge--link" href="https://doi.org/..." target="_blank" rel="noopener">DOI ↗</a></div>
  </div>
</li>
```

### Add a talk  (`talks.html`)  — also used on Experience & Leadership
```html
<li class="talk">
  <span class="talk__date">Mon 2026</span>
  <div>
    <p class="talk__title">Title of the talk</p>
    <p class="talk__meta"><strong>Meeting name</strong> · City, State</p>
    <div class="talk__tags"><span class="badge badge--talk">Talk</span><a class="badge badge--link" href="https://..." target="_blank" rel="noopener">Event ↗</a></div>
  </div>
</li>
```
Badge options: `badge--talk` (cyan), `badge--invited` (gold), `badge--poster` (grey). The text
inside the badge (e.g. "Talk", "Poster", "Chair") is up to you.

### Add a news item  (`news.html`)
```html
<a class="news-card" href="https://..." target="_blank" rel="noopener">
  <div class="news-card__top"><span class="news-card__src">Source name</span><span class="news-card__date">Mon 2026</span></div>
  <p class="news-card__title">Headline of the article</p>
  <span class="news-card__cta">Read ↗</span>
</a>
```
Add `news-card--feature` to the class (`class="news-card news-card--feature"`) to make one span the
full width and stand out.

### Add an award or grant  (`awards.html`)
Same `<li class="talk">` block as talks. For a dollar amount use a gold badge:
`<span class="badge badge--invited">$5,000</span>`.

### Just change wording
Open the page, find the sentence, type over it. Save. Refresh. Special characters: write
`&amp;` for `&`, and you can paste `α`, `⊃`, `≈` etc. directly.

---

## 4. ⚠️ The navigation menu is on every page

There's no shared header file, so the top menu is copied into all 9 `.html` files. **If you add or
rename a nav item, you must make the same change in every file** (search for `nav__links` in each).
The current menu lives between `<nav class="nav__links" ...>` and `</nav>` near the top of each file.
The page you're currently on has `class="is-active"` on its own link — keep that pattern.

The footer links are likewise repeated on every page.

---

## 5. Change colors / fonts

Open `assets/css/style.css`. The very top has the color palette:

```css
:root {
  --accent:  #5b7cfa;   /* electric indigo — buttons, highlights */
  --accent-2:#22d3ee;   /* cyan — small labels, links */
  --gold:    #f5b301;   /* warm accent */
}
```
Change a hex value and *everything* using it updates at once. Dark and light theme backgrounds are
in the `[data-theme="dark"]` and `[data-theme="light"]` blocks just below.

Fonts are loaded from Google Fonts in each page's `<head>` (`Sora`, `Inter`, `JetBrains Mono`) and
set near the top of the CSS under `--font-display` / `--font-body`.

---

## 6. Replace your CV, photo, or social card

- **CV:** save your new PDF over `assets/Phong_Dang_CV.pdf` (keep the same filename).
- **Headshot:** save your new photo over `assets/img/headshot.jpg` (a roughly square photo works best).
- **Social preview card** (`assets/img/og-image.png`): this is a generated image; ask me to
  regenerate it if your headshot or title changes.

---

## 7. When you're ready to go live

Publishing to GitHub Pages makes the site public at **https://phongdang14.github.io**. Ask me and
I'll give you the exact step-by-step commands. (Nothing is public until you do that — right now it
only exists on your computer.)

---

### Golden rules
1. **Copy an existing block** rather than writing tags from scratch.
2. Every opening tag like `<li>` needs its closing `</li>`.
3. Save → refresh the browser to check. If something looks broken, undo your last change.
4. Keep a copy/backup before big edits (or use Git once it's set up).
