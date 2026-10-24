import type { Photo } from '../types';

export interface UgcStep {
  title: string;
  text: string;
}

// Draft copy for /contenido. Formats and process are commitments to brands — adjust them to what
// you actually deliver before sharing the page.
export const ugc = {
  headline: 'Contenido para marcas',
  intro: 'Videos y fotos verticales para redes y anuncios, hechos por un modelo: pose, encuadre y el producto en primer plano.',
  formats: [
    'Video vertical 9:16 para Reels, TikTok y anuncios',
    'Fotos del producto en uso',
    'Unboxing y primeras impresiones',
    'Reseña o testimonio a cámara',
  ],
  steps: [
    { title: 'Brief', text: 'Me contás el producto, el objetivo y dónde se va a publicar.' },
    { title: 'Propuesta', text: 'Te paso la idea y un guion corto para aprobar antes de grabar.' },
    { title: 'Entrega', text: 'Recibís los archivos editados, listos para publicar.' },
  ] as UgcStep[],
  // Instagram posts or reels shown in "Muestras", in this order. Paste the link from
  // Instagram's share button; anything that is not a post is ignored. While the list is
  // empty the section shows a short "ask me for samples" line instead.
  instagramPosts: [
    'https://www.instagram.com/reel/DZLIEHEySqi/',
    'https://www.instagram.com/reel/DeNkFoFydfE/',
  ] as string[],
  whatsappMessage: 'Hola Tomás, vi tu página de contenido para marcas y quería hacerte una consulta.',
};

const UGC_LABEL = /comercial|commercial|lifestyle/i;
const STRIP_SIZE = 3;

export function pickUgcPhotos(photos: Photo[]): Photo[] {
  return photos.filter(p => !p.hidden && UGC_LABEL.test(p.alt)).slice(0, STRIP_SIZE);
}

export function ugcMailto(email: string): string {
  return `mailto:${email}?subject=${encodeURIComponent('Consulta de contenido')}`;
}
