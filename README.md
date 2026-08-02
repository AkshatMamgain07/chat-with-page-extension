# Chat with this Page — Day 3: UI Polish + Extraction Fix

## What's new since Day 2
1. **Fixed text spacing bug** — previously extracted text glued words together
   across paragraphs/headings (e.g. "CricketShaun" instead of "Cricket Shaun").
   Now `content.js` walks the article's HTML structure and inserts a newline
   after each block-level element (`<p>`, `<h1>`, `<li>`, etc.) before extracting text.
2. **Typing indicator** — three bouncing dots show while "thinking" (placeholder
   delay for now, will show real backend latency from Day 4-5 onward).
3. **Input disabled while waiting** — you can't send a second message until the
   first one's reply arrives, preventing overlapping/confusing state.
4. **Dev Tools collapsed by default** — the extraction test button now lives
   inside a collapsible "🔧 Dev Tools" section instead of always being visible,
   so the UI looks more like a real product.

## How to update
1. Go to `chrome://extensions` → click the refresh icon on "Chat with this Page"
2. Refresh (F5) any tab you're testing on

## Day 3 test steps
1. Open the same Wikipedia page you tested before
2. Click "🔧 Dev Tools" to expand it → click the extract test button
3. Check the preview text — words between paragraphs should now have proper spacing
4. Test the chat: type a message, hit Enter
   - Input box and Send button should grey out / become disabled
   - Three bouncing dots should appear briefly
   - Then the placeholder reply appears, and input re-enables automatically

## What to look for
- [ ] No more glued-together words in the extraction preview
- [ ] Typing indicator appears and disappears cleanly
- [ ] Can't send a message while one is "in flight"
- [ ] Dev Tools section is collapsed by default, expandable on click

---

# Chat with this Page — Day 2: Real Page Extraction

## What's new since Day 1
- `content.js` now uses Mozilla's Readability.js (Firefox Reader Mode's engine)
  to pull clean article text instead of the whole messy page.
- Added a temporary "🔍 Test: Extract this page's text" button in the side panel
  so you can verify extraction without waiting for the backend (Day 4-5).

## How to update your loaded extension
1. Go to `chrome://extensions`
2. Find "Chat with this Page" → click the **refresh/reload icon** on its card
   (you don't need to remove and re-add it)

## Day 2 test steps
1. Open a normal article — e.g. a Wikipedia page or a blog post
2. Click the extension icon → side panel opens
3. Click **"🔍 Test: Extract this page's text"**
4. You should see: extraction method (`readability` or `fallback`), title,
   character count, and a text preview
5. Try it on 3-4 different kinds of pages and compare:
   - A long article/blog (should say `readability`, clean text)
   - Wikipedia (should say `readability`)
   - GitHub file view or a dashboard-style site (likely `fallback` — this is fine and expected)
   - A `chrome://` internal page (will show an error — content scripts can't run there, that's normal)

## What to look for (this is the real Day 2 goal)
- [ ] On article-style pages, extracted text should NOT include navbar/ads/footer junk
- [ ] Character count should be a few hundred to a few thousand, not the whole page's HTML
- [ ] Title should match the actual page title
- [ ] Fallback pages still return *something* usable, not a crash

If a specific page you care about (docs, research paper site, etc.) gives bad results,
that's useful signal — tell me the site and we can special-case it.

---

# Chat with this Page — Day 1 Skeleton (original)

## What this is
Extension skeleton only. No backend, no real page-scraping yet — that's Day 2 onward.
Goal for today: prove the extension loads and the side panel UI works.

## How to test in Chrome (Windows)

1. Extract this folder somewhere on your machine, e.g. `C:\dev\chat-with-page`
   (avoid OneDrive-synced paths — same lesson as the Gate Pass project).
2. Open Chrome → go to `chrome://extensions`
3. Turn on **Developer mode** (top-right toggle)
4. Click **Load unpacked** → select the `chat-with-page` folder
5. You should see "Chat with this Page" appear in your extensions list
6. Click the extension's icon in the toolbar (pin it first if it's hidden under the puzzle icon)
7. The side panel should open on the right with a chat UI

## What to check works today
- [ ] Extension loads with no errors on `chrome://extensions`
- [ ] Clicking the icon opens the side panel
- [ ] Typing a message and hitting Send (or clicking Send) shows your message
- [ ] After ~400ms, a placeholder bot reply appears
- [ ] Open DevTools on any webpage (F12) → Console → you should see:
      `[Chat with Page] Content script loaded on: <url>`

## If something breaks
- Errors show up on `chrome://extensions` under the extension card — click "Errors" if red
- After editing any file, click the refresh icon on the extension card to reload changes
- Side panel not showing? Check `chrome://extensions` → Details → make sure "Site access" isn't blocked

## Folder structure
```
chat-with-page/
├── manifest.json       # extension config
├── background.js       # service worker (opens side panel)
├── content.js           # runs on every page (Day 2: real text extraction)
├── icons/                # toolbar icons
└── sidepanel/
    ├── sidepanel.html    # chat UI structure
    ├── sidepanel.css     # styling
    └── sidepanel.js       # chat logic (Day 1: fake echo, Day 5: real backend)
```

## Next (Day 2)
Add Readability.js to `content.js` and actually extract clean page text instead of
the rough `document.body.innerText` placeholder.
