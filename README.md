
# Ownhub_Franchisor# Buscemi's OwnHub

Franchisor dashboard that sits **above** the existing store POS.

- Store POS (franchisee): https://ilovechanel.github.io/POS_dashboard/
- Customer site: https://ilovechanel.github.io/buscemis-website/
- This repo: owner / franchisor control plane — **OwnHub**

## What it is

The individual location already has a light POS (login by Store ID + PIN, then Orders / Menu / Export). OwnHub is the missing owner layer:

1. **Owner login** — franchisor only
2. **All stores dashboard** — one card per location, unique Store ID
3. **Click a card** — opens that store exactly as the franchisee sees it (orders, menu, export)
4. **Active stores** — roster, status, open POS
5. **Add / upload stores** — single form or CSV batch
6. **Accounting** — network rollup + per-store royalties

Visual language matches the existing POS: wood / cream / Buscemi's red, Yellowtail wordmark, Fredoka + Nunito Sans.

## Demo login

| Role | Email | PIN |
|---|---|---|
| Franchisor (OwnHub) | `owner@buscemis.com` | `2468` |
| Franchisee (existing POS) | any Store ID | `1234` |

## Run it

This is static HTML. No build step.

### Option A — open locally
Open `index.html` in a browser.  
If a browser blocks `localStorage` on `file://`, serve the folder:

```bash
npx serve .
# or: python3 -m http.server 8080
```

### Option B — GitHub Pages (same as your other two sites)

1. Create a repo named `ownhub` (or `OwnHub`).
2. Upload this folder as the repo root (`index.html` must be at the root).
3. Settings → Pages → Deploy from `main` / root.
4. Site will be `https://<you>.github.io/ownhub/`

### Option C — Visual Studio Code
Open the `ownhub` folder in VS Code. Use Live Server if you want auto-reload.

## Files

```
index.html          Owner login
dashboard.html      All-store cards
stores.html         Active store roster
add-store.html      Create one store or upload CSV
accounting.html     Network accounting
store.html          Store POS — orders (what the franchisee sees)
store-menu.html     Store POS — menu
store-export.html   Store POS — export / accounting
css/ownhub.css
js/app.js           Stores, auth, seed data (localStorage)
sample-stores.csv   Example upload file
```

## Data

Demo stores and tickets live in `localStorage`. Clearing site data resets to the seeded Michigan locations.

Store IDs follow the same pattern as the POS data contract: `LOCATIONNAME-####`.

## Wiring to the live store POS later

OwnHub currently **replicas** the store screens so the owner can click in immediately. When you want the real POS to be the destination, change `openStore()` in `dashboard.html` / `stores.html` to:

```js
location.href = "https://ilovechanel.github.io/POS_dashboard/orders.html?store="
  + encodeURIComponent(store.name) + "&id=" + encodeURIComponent(store.id);
```

The existing POS already reads `?store=` and `?id=`.
