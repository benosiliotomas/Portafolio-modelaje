import React, { useState } from 'react';
import { UploadIcon } from '../components/icons';
import type { PhotoSection } from '../types';

const MAX_FILE_BYTES = 25 * 1024 * 1024;

interface ImageUploaderProps {
  onPhotoAdded: (photoData: { alt: string; image: Blob; section: PhotoSection }) => Promise<void>;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onPhotoAdded }) => {
  const [alt, setAlt] = useState('');
  const [section, setSection] = useState<PhotoSection>('book');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Photos are resized in the browser before upload, so the limit only guards memory.
      if (selectedFile.size > MAX_FILE_BYTES) {
        setError("El archivo es muy pesado. Máximo 25 MB.");
        return;
      }
      setError(null);
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !alt.trim()) {
      setError("Elegí una foto y escribí una descripción.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await onPhotoAdded({ alt, image: file, section });

      // Reset form on success
      setAlt('');
      setFile(null);
      setPreview(null);
      const fileInput = document.getElementById('file-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } catch (err: unknown) {
      setError(err instanceof Error && err.message ? err.message : "Ocurrió un error al subir la foto.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 animate-fade-in">
      <div>
        <label htmlFor="file-upload" className="block text-xs font-bold text-neutral-500 uppercase tracking-widest mb-3 font-mono">Archivo Fotográfico</label>
        <div className="mt-1 flex justify-center px-6 pt-8 pb-10 border-2 border-neutral-200 border-dashed rounded-xl bg-neutral-50 hover:bg-neutral-100 hover:border-neutral-300 transition-all duration-300 group">
          <div className="space-y-4 text-center">
            {preview ? (
              <img src={preview} alt="Preview" className="mx-auto h-48 w-auto object-contain rounded-md shadow-lg border border-neutral-200" />
            ) : (
              <div className="w-20 h-20 mx-auto rounded-full bg-white shadow-sm flex items-center justify-center group-hover:bg-neutral-50 transition-colors border border-neutral-200">
                <UploadIcon className="h-8 w-8 text-neutral-400 group-hover:text-clay transition-colors" />
              </div>
            )}
            <div className="flex flex-col items-center text-sm text-neutral-500">
              <label htmlFor="file-upload" className="relative cursor-pointer bg-white border border-neutral-200 px-4 py-2 mt-2 rounded-lg font-medium text-neutral-700 hover:text-neutral-900 hover:bg-neutral-50 transition-all shadow-sm">
                <span>Seleccionar Archivo</span>
                <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/png, image/jpeg, image/webp" />
              </label>
                          </div>
            <p className="text-xs text-neutral-400 font-medium">JPG, PNG o WebP · hasta 25 MB · se optimiza automáticamente</p>
          </div>
        </div>
      </div>

      <fieldset className="border-0 p-0 m-0">
        <legend className="block text-xs font-bold text-neutral-500 uppercase tracking-widest mb-3 font-mono">Sección</legend>
        <div className="flex gap-6">
          {(['book', 'digitals'] as const).map(option => (
            <label key={option} className="eyebrow text-ink flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="section"
                value={option}
                checked={section === option}
                onChange={() => setSection(option)}
                disabled={isLoading}
                className="accent-[var(--color-ink)]"
              />
              {option === 'book' ? 'Book' : 'Digitals'}
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor="alt" className="block text-xs font-bold text-neutral-500 uppercase tracking-widest mb-3 font-mono">Descripción (texto alternativo)</label>
        <input
          type="text"
          id="alt"
          value={alt}
          onChange={(e) => setAlt(e.target.value)}
          placeholder="Ej: Digital de frente, cuerpo entero"
          className="mt-1 block w-full px-4 py-3 bg-white border border-neutral-200 rounded-lg text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-900 focus:border-neutral-900 transition-all font-mono shadow-sm"
          disabled={isLoading}
        />
      </div>

      {error && <p className="text-sm text-red-600 font-medium p-3 bg-red-50 border border-red-100 rounded-lg">{error}</p>}

      <button
        type="submit"
        disabled={isLoading || !file || !alt}
        className="w-full flex justify-center items-center px-4 py-4 border border-transparent text-sm font-bold uppercase tracking-widest rounded-lg shadow-sm text-white bg-neutral-900 hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-neutral-900 disabled:bg-neutral-300 disabled:text-neutral-500 disabled:shadow-none disabled:cursor-not-allowed transition-all duration-300"
      >
        <UploadIcon className="h-5 w-5 mr-3" />
        {isLoading ? 'Optimizando y subiendo…' : 'Subir foto'}
      </button>
    </form>
  );
};

export default ImageUploader;
