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

## Admin

Open `/admin` and sign in. From there you can upload, reorder, edit captions, hide and
delete photos. Uploads are resized in the browser to 480/1080/2000 px WebP before they
reach Storage.

Photos uploaded before that existed can be optimized with:

```bash
npm run optimize-photos -- --dry-run   # read-only, shows the savings
npm run optimize-photos                # asks for the admin password
```

Original files stay in Storage; only the Firestore documents change (the old URL is kept
in `originalUrl`).

## Profile data

Measurements, contact details and the Instagram handle live in `data/profile.ts`.
