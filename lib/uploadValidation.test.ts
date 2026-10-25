import { describe, it, expect } from 'vitest';
import { pickImageFile, MAX_FILE_BYTES } from './uploadValidation';

const file = (name: string, type: string, size = 1000) => ({ name, type, size });

describe('pickImageFile', () => {
  it('accepts a JPG, PNG or WebP under the size limit', () => {
    for (const type of ['image/jpeg', 'image/png', 'image/webp']) {
      const f = file('foto', type);
      expect(pickImageFile([f])).toEqual({ file: f });
    }
  });

  it('rejects other formats, naming the file', () => {
    expect(pickImageFile([file('foto.png.zip', 'application/zip')])).toEqual({
      error: '"foto.png.zip" no es JPG, PNG ni WebP.',
    });
    expect(pickImageFile([file('video.mov', 'video/quicktime')]).error).toContain('no es JPG, PNG ni WebP');
  });

  it('explains how to fix iPhone HEIC photos, even when the browser gives no type', () => {
    const hint = '"IMG_0042.HEIC" es HEIC, el formato de fotos del iPhone. Exportala como JPG y probá de nuevo.';
    expect(pickImageFile([file('IMG_0042.HEIC', 'image/heic')])).toEqual({ error: hint });
    expect(pickImageFile([file('IMG_0042.HEIC', '')])).toEqual({ error: hint });
  });

  it('rejects files over the size limit', () => {
    expect(pickImageFile([file('grande.jpg', 'image/jpeg', MAX_FILE_BYTES + 1)])).toEqual({
      error: '"grande.jpg" pesa más de 25 MB.',
    });
  });

  it('takes the first file and says so when several are dropped', () => {
    const first = file('a.jpg', 'image/jpeg');
    expect(pickImageFile([first, file('b.jpg', 'image/jpeg')])).toEqual({
      file: first,
      notice: 'Soltaste 2 archivos: se usa el primero. Las fotos se suben de a una.',
    });
  });

  it('asks for a file when nothing was dropped', () => {
    expect(pickImageFile([])).toEqual({ error: 'No llegó ningún archivo. Probá arrastrar la foto otra vez.' });
  });
});
