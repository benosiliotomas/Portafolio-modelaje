// Creates 480/1080/2000 px WebP variants for photos uploaded before upload-time
// compression existed, and points each Firestore document at them.
//
//   npm run optimize-photos -- --dry-run   # read-only: shows the size savings
//   npm run optimize-photos                # asks for the admin password, then writes
//   npm run optimize-photos -- --force     # rebuilds variants from the stored originals
//
// Original files stay in Storage untouched; only the documents change. Photos uploaded
// from /admin after compression existed have no stored original and are skipped by --force.
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import sharp from 'sharp';
import { createInterface } from 'node:readline';
import { Writable } from 'node:stream';

const firebaseConfig = {
  apiKey: 'AIzaSyAF0670ZL8fJHGQufNbdn9WaYTko0r0Su4',
  authDomain: 'modelo-portafolio.firebaseapp.com',
  projectId: 'modelo-portafolio',
  storageBucket: 'modelo-portafolio.firebasestorage.app',
  messagingSenderId: '945440806728',
  appId: '1:945440806728:web:2f7a5ab78d0b13865d057d',
};
const ADMIN_EMAIL = 'benosiliotomas@gmail.com';
const VARIANT_WIDTHS = [480, 1080, 2000];
const WEBP_QUALITY = 82;
const CACHE_CONTROL = 'public, max-age=31536000, immutable';

const dryRun = process.argv.includes('--dry-run');
const force = process.argv.includes('--force');

// The prompt goes to stdout; readline gets a silent stream so keystrokes are never echoed
// and its line redraws can't erase the prompt.
function askHidden(question) {
  return new Promise((resolve) => {
    process.stdout.write(question);
    const silent = new Writable({ write(_chunk, _encoding, callback) { callback(); } });
    const rl = createInterface({ input: process.stdin, output: silent, terminal: true });
    rl.question('', (answer) => { rl.close(); process.stdout.write('\n'); resolve(answer); });
  });
}

const mb = (bytes) => `${(bytes / 1024 / 1024).toFixed(2)} MB`;

async function buildVariants(buffer) {
  const { width, height } = await sharp(buffer).rotate().metadata();
  // Same rule as lib/photoUtils.targetWidths: the largest size is the original width, capped at 2000px.
  const largest = Math.min(width, VARIANT_WIDTHS[VARIANT_WIDTHS.length - 1]);
  const targets = [...VARIANT_WIDTHS.filter((w) => w < largest), largest];
  const variants = await Promise.all(targets.map(async (w) => ({
    width: w,
    data: await sharp(buffer).rotate().resize({ width: w }).webp({ quality: WEBP_QUALITY }).toBuffer(),
  })));
  return { width, height, variants };
}

async function main() {
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const storage = getStorage(app);

  if (!dryRun) {
    if (!process.env.ADMIN_PASSWORD && !process.stdin.isTTY) {
      throw new Error('Corré el script en una terminal interactiva para poder escribir la contraseña.');
    }
    const password = process.env.ADMIN_PASSWORD || await askHidden(`Contraseña de ${ADMIN_EMAIL} (no se ve mientras escribís): `);
    if (!password) throw new Error('No se escribió ninguna contraseña.');
    await signInWithEmailAndPassword(getAuth(app), ADMIN_EMAIL, password);
    console.log('Sesión iniciada. Optimizando…\n');
  }

  const snapshot = await getDocs(collection(db, 'photos'));
  const photos = snapshot.docs
    .map((d) => ({ id: d.id, ...d.data() }))
    .sort((a, b) => a.order - b.order);

  let before = 0;
  let after = 0;

  for (const photo of photos) {
    if (photo.variants?.length && !force) {
      console.log(`- ${photo.id} ya optimizada, se omite`);
      continue;
    }
    if (photo.variants?.length && !photo.originalUrl) {
      console.log(`- ${photo.id} se subió desde /admin y no tiene original guardado: para mejorarla, volvé a subirla`);
      continue;
    }
    const sourceUrl = photo.originalUrl ?? photo.url;
    const response = await fetch(sourceUrl);
    if (!response.ok) {
      console.error(`! ${photo.id}: no se pudo descargar (${response.status})`);
      continue;
    }
    const original = Buffer.from(await response.arrayBuffer());
    const { width, height, variants } = await buildVariants(original);

    // Grid thumbnails load the 480/1080 files; compare against what the old grid downloaded.
    const gridVariant = variants.find((v) => v.width === 1080) ?? variants[variants.length - 1];
    before += original.length;
    after += gridVariant.data.length;
    console.log(`${dryRun ? '·' : '✓'} ${photo.id} ${width}×${height}  ${mb(original.length)} → ${variants.map((v) => `${v.width}px ${mb(v.data.length)}`).join(' · ')}`);

    if (dryRun) continue;

    const uploaded = [];
    for (const v of variants) {
      const storageRef = ref(storage, `photos/${photo.id}_${v.width}.webp`);
      await uploadBytes(storageRef, v.data, { contentType: 'image/webp', cacheControl: CACHE_CONTROL });
      uploaded.push({ width: v.width, url: await getDownloadURL(storageRef) });
    }
    await updateDoc(doc(db, 'photos', photo.id), {
      originalUrl: sourceUrl,
      url: uploaded[uploaded.length - 1].url,
      variants: uploaded,
      width,
      height,
    });
  }

  console.log(`\nGalería en escritorio: ${mb(before)} → ${mb(after)}${dryRun ? ' (simulación, no se escribió nada)' : ''}`);
  process.exit(0);
}

main().catch((error) => {
  const messages = {
    'auth/missing-password': 'No se escribió ninguna contraseña.',
    'auth/invalid-credential': 'Contraseña incorrecta.',
    'auth/too-many-requests': 'Demasiados intentos. Esperá unos minutos y probá de nuevo.',
  };
  console.error('Error:', messages[error.code] || error.code || error.message);
  process.exit(1);
});
