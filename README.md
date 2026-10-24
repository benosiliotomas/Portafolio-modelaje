# Portfolio — Tomás Benosilio

React + Vite + Firebase (Firestore, Storage, Auth), deployed on Vercel.
Visual system: see [DESIGN.md](DESIGN.md).

## Local

```bash
npm install
npm run dev        # http://localhost:3000
npm test           # unit tests
npm run typecheck
npm run build
```

## Structure

- `PublicApp.tsx` — what visitors get. Reads photos through Firestore's REST API, so it ships
  no Firebase SDK.
- `admin/` — loaded only on `/admin`: sign-in, live updates, uploads and photo controls.
- `components/Portfolio.tsx` — the page itself, shared by both.

## Admin

Open `/admin` and sign in. From there you can upload (choosing Book or Digitals), pick the
cover (star), move photos between sections, reorder, edit captions, hide and delete. Uploads are resized in the browser to 480/1080/2000 px WebP before they
reach Storage.

Photos uploaded before that existed can be optimized with:

```bash
npm run optimize-photos -- --dry-run   # read-only, shows the savings
npm run optimize-photos                # asks for the admin password
```

Original files stay in Storage; only the Firestore documents change (the old URL is kept
in `originalUrl`).

## Comp card

```bash
npm run compcard   # writes public/comp-card.pdf from the published photos
```

Read-only. Re-run it after changing the cover, the photos or the measurements, then commit
the PDF.

## Pages

- `/` — portfolio (`index.html` → `index.tsx`)
- `/contenido` — page for brands (`contenido.html` → `contenido.tsx`, copy in `data/ugc.ts`).
  Linked from the menu as "Contenido". The old `/ugc` address redirects here (`vercel.json`).
- `/admin` — admin (loaded on demand from `index.tsx`)

`robots.txt` and `sitemap.xml` are generated at build time from `site.config.ts`.

## Custom domain

1. Buy the domain (e.g. `tomasbenosilio.com`; for `.com.ar`, nic.ar).
2. Vercel → project → Settings → Domains → add `tomasbenosilio.com` and
   `www.tomasbenosilio.com`, with `www` redirecting to the bare domain.
3. At the registrar, create the DNS records Vercel shows on that screen (typically an `A`
   record for `@` and a `CNAME` for `www`). Wait until Vercel marks the domain as valid.
4. Set `SITE_URL` in `site.config.ts` to the new address, run `npm run compcard`, commit and
   push. Canonical links, Open Graph, sitemap, robots.txt and the comp card follow.
5. Update the link in your Instagram bio, and submit `/sitemap.xml` in Google Search Console.

The `vercel.app` address keeps working after the switch.

## Profile data

Measurements, bio, contact details and the Instagram handle live in `data/profile.ts`.
