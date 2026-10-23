import { targetWidths } from './photoUtils';

export interface EncodedVariant {
  width: number;
  blob: Blob;
}

export interface ImageVariants {
  width: number;
  height: number;
  variants: EncodedVariant[];
}

const QUALITY = 0.82;

function canvasToBlob(canvas: HTMLCanvasElement, type: string): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      blob => (blob ? resolve(blob) : reject(new Error('No se pudo procesar la imagen.'))),
      type,
      QUALITY
    );
  });
}

// Safari can silently ignore WebP and hand back a PNG; JPEG keeps those files small.
async function encode(canvas: HTMLCanvasElement): Promise<Blob> {
  const webp = await canvasToBlob(canvas, 'image/webp');
  return webp.type === 'image/webp' ? webp : canvasToBlob(canvas, 'image/jpeg');
}

export async function createImageVariants(file: Blob): Promise<ImageVariants> {
  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
  } catch {
    throw new Error('El navegador no pudo leer la imagen. Probá con un JPG o PNG.');
  }

  try {
    const { width, height } = bitmap;
    const variants: EncodedVariant[] = [];

    for (const targetWidth of targetWidths(width)) {
      const canvas = document.createElement('canvas');
      canvas.width = targetWidth;
      canvas.height = Math.round((height * targetWidth) / width);
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('El navegador no permite procesar imágenes.');
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
      variants.push({ width: targetWidth, blob: await encode(canvas) });
    }

    return { width, height, variants };
  } finally {
    bitmap.close();
  }
}
