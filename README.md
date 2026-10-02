# Moch Toriq Hisam – portfolio

Next.js 14 (App Router) + React Three Fiber + Rapier. Five pages: Home (with the draggable name-card lanyard), Projects, About, Skills, Contact.

## Run locally

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build check
```

## Deploy on Vercel

1. Push this folder to a new GitHub repository.
2. On vercel.com choose **Add New → Project**, import the repository, keep the defaults, **Deploy**.
3. Put the resulting URL on your CV and LinkedIn (Featured section).

## Where to edit things

| What | File |
| --- | --- |
| Projects, experience, education, skills, links | `data/content.ts` |
| Colors and type | `app/globals.css` (tokens at the top) |
| Text printed on the card and strap | `components/lanyard/textures.ts` |
| Card size, rope length, physics | `components/lanyard/Band.tsx` |
| CV file | replace `public/CV_Moch_Toriq_Hisam.pdf` |

### Put a photo on the card (optional)

1. Save a portrait as `public/photo.jpg`.
2. Create `.env.local` with `NEXT_PUBLIC_CARD_PHOTO=1` (also add it as an Environment Variable on Vercel).

## Notes

- The lanyard mechanism (a fixed point, three rope-joined bodies and a hanging card) is a common pattern; the code, the card and the strap here are written from scratch, so no assets from other repositories are used.
- Fonts come from `@fontsource` packages, so the build works offline.
- The 3D scene pauses when scrolled out of view and falls back to a static card when WebGL is unavailable.
- `public/CV_Moch_Toriq_Hisam.pdf` contains your phone number. The site itself does not show it.
