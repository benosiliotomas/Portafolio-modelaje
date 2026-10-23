// Builds public/comp-card.pdf: an A5 two-page comp card (front: cover photo and name;
// back: four photos, measurements and contact) from the live portfolio data.
//
//   npm run compcard
//
// Read-only against Firestore. Re-run it after changing photos, the cover or measurements.
import { PDFDocument, PDFFont, PDFPage, rgb } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import sharp from 'sharp';
import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { fetchPublicPhotos } from '../services/firestoreRest';
import { splitPortfolio } from '../lib/portfolio';
import { getVisiblePhotos } from '../lib/photoUtils';
import { profile, getMeasurements } from '../data/profile';
import { SITE_URL } from '../site.config';
import type { Photo } from '../types';

const OUTPUT = fileURLToPath(new URL('../public/comp-card.pdf', import.meta.url));
const SITE = new URL(SITE_URL).host;

// A5 in points, with the design tokens from DESIGN.md.
const PAGE = { width: 419.53, height: 595.28 };
const MARGIN = 22;
const GAP = 8;
const INK = rgb(0x1c / 255, 0x1b / 255, 0x1a / 255);
const ASH = rgb(0x6f / 255, 0x6c / 255, 0x67 / 255);
const HAIRLINE = rgb(0xe2 / 255, 0xdf / 255, 0xd8 / 255);
const WHITE = rgb(1, 1, 1);
// Vertical rhythm of the back page, from the bottom edge up.
const BACK = { contact: 24, name: 36, rule: 50, row2: 70, row1: 96, photosBottom: 122 };
// Roughly 216 dpi at the printed size: sharp enough for print, light enough to email.
const PIXELS_PER_POINT = 3;

const FONT_URLS = {
  display: 'https://fonts.gstatic.com/s/bodonimoda/v28/aFT67PxzY382XsXX63LUYL6GYFcan6NJrKp-VPjfJMShrpsGFUt8oU7awIA.ttf',
  // Google's Plex Mono TTF trips up fontkit; IBM's own release embeds fine.
  mono: 'https://cdn.jsdelivr.net/gh/IBM/plex@v6.4.0/IBM-Plex-Mono/fonts/complete/ttf/IBMPlexMono-Regular.ttf',
};

async function download(url: string): Promise<Buffer> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Download failed (${response.status}): ${url}`);
  return Buffer.from(await response.arrayBuffer());
}

const largestUrl = (photo: Photo): string =>
  photo.variants?.length ? [...photo.variants].sort((a, b) => b.width - a.width)[0].url : photo.url;

async function drawPhoto(pdf: PDFDocument, page: PDFPage, photo: Photo, x: number, y: number, width: number, height: number) {
  const jpeg = await sharp(await download(largestUrl(photo)))
    .rotate()
    .resize({ width: Math.round(width * PIXELS_PER_POINT), height: Math.round(height * PIXELS_PER_POINT), fit: 'cover' })
    .jpeg({ quality: 85, mozjpeg: true })
    .toBuffer();
  page.drawImage(await pdf.embedJpg(jpeg), { x, y, width, height });
}

/** pdf-lib has no letter-spacing, so uppercase labels are set glyph by glyph. */
function drawTracked(page: PDFPage, text: string, x: number, y: number, font: PDFFont, size: number, color = ASH, tracking = 0.16) {
  let cursor = x;
  for (const char of text) {
    page.drawText(char, { x: cursor, y, size, font, color });
    cursor += font.widthOfTextAtSize(char, size) + size * tracking;
  }
}

function trackedWidth(text: string, font: PDFFont, size: number, tracking = 0.16): number {
  return [...text].reduce((sum, char) => sum + font.widthOfTextAtSize(char, size) + size * tracking, 0);
}

/** Two cover photos, a digital front and a profile read best; fill from the book if digitals run short. */
function pickBackPhotos(book: Photo[], digitals: Photo[]): Photo[] {
  const picks = [...digitals.slice(0, 2), ...book.slice(0, 2)];
  const rest = [...digitals.slice(2), ...book.slice(2)];
  return [...picks, ...rest].slice(0, 4);
}

async function main() {
  const { cover, book, digitals } = splitPortfolio(getVisiblePhotos(await fetchPublicPhotos(), false));
  if (!cover) throw new Error('No hay fotos publicadas para armar la comp card.');
  const backPhotos = pickBackPhotos(book, digitals);

  const pdf = await PDFDocument.create();
  pdf.registerFontkit(fontkit);
  const display = await pdf.embedFont(await download(FONT_URLS.display), { subset: true });
  const mono = await pdf.embedFont(await download(FONT_URLS.mono), { subset: true });
  pdf.setTitle(`${profile.name} — Comp card`);
  pdf.setAuthor(profile.name);

  const innerWidth = PAGE.width - MARGIN * 2;
  const addPage = () => {
    const page = pdf.addPage([PAGE.width, PAGE.height]);
    page.drawRectangle({ x: 0, y: 0, width: PAGE.width, height: PAGE.height, color: WHITE });
    return page;
  };

  // Front: one photo, the name, the role line.
  const front = addPage();
  const frontPhotoHeight = 470;
  await drawPhoto(pdf, front, cover, MARGIN, PAGE.height - MARGIN - frontPhotoHeight, innerWidth, frontPhotoHeight);
  front.drawText(profile.name, { x: MARGIN, y: 58, size: 30, font: display, color: INK });
  drawTracked(front, `${profile.role} · ${profile.location} / Buenos Aires`.toUpperCase(), MARGIN, 38, mono, 6.5);

  // Back: 2×2 photos, measurements, contact.
  const back = addPage();
  const tileWidth = (innerWidth - GAP) / 2;
  const tileHeight = (PAGE.height - MARGIN - BACK.photosBottom - GAP) / 2;
  for (const [i, photo] of backPhotos.entries()) {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = MARGIN + col * (tileWidth + GAP);
    const y = PAGE.height - MARGIN - tileHeight - row * (tileHeight + GAP);
    await drawPhoto(pdf, back, photo, x, y, tileWidth, tileHeight);
  }

  const shown = ['Altura', 'Pecho', 'Cintura', 'Cadera', 'Pantalón', 'Calzado', 'Cabello', 'Ojos'];
  const measurements = getMeasurements().filter(m => shown.includes(m.label));
  const columnWidth = innerWidth / 4;
  measurements.forEach((item, i) => {
    const x = MARGIN + (i % 4) * columnWidth;
    const y = i < 4 ? BACK.row1 : BACK.row2;
    drawTracked(back, item.label.toUpperCase(), x, y + 10, mono, 5.5);
    const value = item.imperial ? `${item.value} · ${item.imperial}` : item.value;
    back.drawText(value, { x, y, size: 7.5, font: mono, color: INK });
  });

  back.drawLine({ start: { x: MARGIN, y: BACK.rule }, end: { x: PAGE.width - MARGIN, y: BACK.rule }, thickness: 0.5, color: HAIRLINE });
  back.drawText(profile.name, { x: MARGIN, y: BACK.contact + 3, size: 12, font: display, color: INK });
  const nameWidth = display.widthOfTextAtSize(profile.name, 12);
  const contactLines = [
    [profile.email, profile.phoneDisplay],
    [profile.instagram ? `@${profile.instagram}` : null, SITE],
  ].map(parts => parts.filter((part): part is string => part !== null).join('  ·  ').toUpperCase());
  contactLines.forEach((line, i) => {
    const width = trackedWidth(line, mono, 5.5, 0.08);
    const x = PAGE.width - MARGIN - width;
    if (x < MARGIN + nameWidth + GAP) throw new Error('El contacto no entra al lado del nombre en la comp card.');
    drawTracked(back, line, x, BACK.name - i * 10, mono, 5.5, ASH, 0.08);
  });

  await writeFile(OUTPUT, await pdf.save());
  console.log(`Comp card guardada en public/comp-card.pdf (portada: ${cover.id}, dorso: ${backPhotos.map(p => p.id).join(', ')})`);
}

main().catch((error: unknown) => {
  console.error('Error:', error instanceof Error ? error.message : error);
  process.exit(1);
});
