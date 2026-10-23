---
name: Tomás Benosilio — Bone & Ink
description: A photography-first model portfolio on bone white. Light high-contrast serif for the name, uppercase tracked mono for every label and measurement, hairlines instead of cards. Synthesised from the Oura, Bugatti, Apple and ElevenLabs analyses in awesome-design-md.
colors:
  paper: "#f4f2ed"        # page canvas: bone white (Oura's cream #f7f1e8 desaturated)
  surface: "#ffffff"      # admin panel, polaroid frames (Phase 2)
  ink: "#1c1b1a"          # name, headings, values — 15.4:1 on paper
  stone: "#4a4741"        # secondary text — 8.3:1
  ash: "#6f6c67"          # labels, captions — 4.67:1 (Oura's #838280 darkened to pass AA)
  hairline: "#e2dfd8"     # every divider; decorative only
  clay: "#6b443d"         # the one accent: focus ring, hover on links, destructive actions — 7.45:1
typography:
  display:
    fontFamily: Bodoni Moda
    fontWeight: 400
    note: Name, section titles and the short bio (20px, optical sizing keeps it legible). Never bold, never UI text.
  eyebrow:
    fontFamily: IBM Plex Mono
    fontSize: 11px
    letterSpacing: 0.16em
    textTransform: uppercase
    note: Nav, labels, measurements, captions, buttons.
  value:
    fontFamily: IBM Plex Mono
    fontSize: 15px
rounded:
  none: 0px
spacing:
  base: 4px
  grid-gap: 12px
  section: clamp(4rem, 3rem + 5vw, 7.5rem)
  header: 56px
---

## Overview

The photos are the product; the interface is a spec sheet around them. The page sits on
bone white (`paper`) rather than pure white or a neutral chalk: chalk (#f3f3f1) matched the
grey studio backdrops so closely that the digitals dissolved into the page, while a hint of
warmth keeps their edges visible. Everything that isn't a photograph is either the name in a light Bodoni
or an 11px uppercase mono label — the same vocabulary as a comp card.

## What was taken from each reference

- **Oura** — off-white canvas (its cream desaturated to bone), warm ink/stone/ash ladder, warm hairline, light serif
  display paired with a quiet sans/mono, "don't default to white", generous section rhythm.
- **Bugatti** — emphasis through size and tracking, never weight; uppercase tracked
  monospace for nav, captions and buttons; no shadows, no gradients, no cards —
  photography is the only depth; inputs are underline-only.
- **Apple** — photography-first, near-invisible UI; no decorative gradients.
- **ElevenLabs** — display weight stays light; the primary action is ink, used sparingly.

Rejected: the dark canvases of Bugatti, Ferrari and Lamborghini (they fight skin tones and
the white-backdrop digitals), Nike's campaign loudness, and every SaaS gradient system.

## Rules

- One accent (`clay`) with a job: focus, link hover, destructive actions. Not decoration.
- Square corners everywhere. Hairlines, not boxes.
- Photos are straight, 4:5, edge to edge on phones, 12px apart. No rotation, no idle motion.
- Motion is limited to a 300ms fade and a 1.5% hover zoom; `prefers-reduced-motion` disables both.
- `ash` is the lightest colour allowed for text.

## Page structure

One page, shareable anchors: `#top` (cover) · `#book` · `#digitals` · `#medidas` · `#contacto`.

- **Cover** — the featured photo (falls back to the first book photo). Phones: full-width 4:5
  with the name below. Desktop: photo on 7 of 12 columns, capped to the screen height so the
  name and "Contactar" stay above the fold.
- **Book** — groups of three on a 12-column grid: one photo across 8 columns and two rows,
  two on 4 columns, sides alternating per group. Phones: one column. 12px gaps.
- **Digitals** — the polaroid frame lives only here, because digitals are what the industry
  calls polaroids: `surface` border, 4% sides, caption in the bottom margin. 2 columns on
  phones, 4 on desktop.
- **Medidas** — measurements (metric · imperial) beside the bio in Spanish and English.
- **Contacto** — email, WhatsApp, Instagram, comp card PDF.

## Comp card

A5, two pages, white. Front: cover photo, name in Bodoni 30pt, role line in tracked mono.
Back: 2×2 photos (two digitals, two book), eight measurements in two rows, name and contact
over a hairline. Generated from live data by `npm run compcard`.
