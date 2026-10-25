/** Photos are resized in the browser before upload, so this limit only guards memory. */
export const MAX_FILE_BYTES = 25 * 1024 * 1024;
export const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

interface FileLike {
  name: string;
  type: string;
  size: number;
}

export interface PickResult<T extends FileLike> {
  file?: T;
  /** Shown instead of uploading. */
  error?: string;
  /** Shown alongside a valid file, e.g. when extra files were ignored. */
  notice?: string;
}

/** Chooses the photo to upload from a file picker or a drop, with a message when it can't. */
export function pickImageFile<T extends FileLike>(files: T[]): PickResult<T> {
  const [file] = files;
  if (!file) return { error: 'No llegó ningún archivo. Probá arrastrar la foto otra vez.' };
  if (!ACCEPTED_TYPES.includes(file.type)) {
    // iPhone and Mac photos default to HEIC, which browsers other than Safari cannot read.
    const isHeic = /hei[cf]/i.test(file.type) || /\.hei[cf]$/i.test(file.name);
    return {
      error: isHeic
        ? `"${file.name}" es HEIC, el formato de fotos del iPhone. Exportala como JPG y probá de nuevo.`
        : `"${file.name}" no es JPG, PNG ni WebP.`,
    };
  }
  if (file.size > MAX_FILE_BYTES) return { error: `"${file.name}" pesa más de 25 MB.` };
  return files.length > 1
    ? { file, notice: `Soltaste ${files.length} archivos: se usa el primero. Las fotos se suben de a una.` }
    : { file };
}

/** Below this width a photo gets visibly soft in the cover and the full-screen viewer. */
export const RECOMMENDED_MIN_WIDTH = 1600;

export function resolutionWarning(width: number): string | null {
  return width < RECOMMENDED_MIN_WIDTH
    ? `Esta foto mide ${width} px de ancho: en pantallas grandes se va a ver poco nítida. Para la mejor calidad, exportala a 2000 px de ancho.`
    : null;
}
