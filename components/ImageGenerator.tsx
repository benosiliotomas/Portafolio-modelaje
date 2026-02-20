import React, { useState } from 'react';
import { SparklesIcon } from './icons';
import { generateImage } from '../services/geminiService';
import type { AspectRatio } from '../types';

interface ImageGeneratorProps {
  onPhotoAdded: (photoData: { alt: string, image: Blob }) => Promise<void>;
}

const ImageGenerator: React.FC<ImageGeneratorProps> = ({ onPhotoAdded }) => {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('3:4');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const aspectRatios: AspectRatio[] = ["1:1", "16:9", "9:16", "4:3", "3:4"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) {
      setError("Por favor describe lo que deseas generar.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const imageUrl = await generateImage(prompt, aspectRatio);
      const response = await fetch(imageUrl);
      const imageBlob = await response.blob();

      await onPhotoAdded({ alt: prompt, image: imageBlob });
      setPrompt('');
    } catch (err: any) {
      setError(err.message || 'Error al invocar la IA en el estudio.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in relative">

      {/* Decorative inner glow */}
      <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-full h-32 bg-neutral-200/20 blur-[80px] -z-10 rounded-full pointer-events-none"></div>

      <div>
        <label htmlFor="prompt" className="block text-xs font-bold text-neutral-500 uppercase tracking-widest mb-3 font-['Lato'] flex items-center">
          Visión Creativa
          <SparklesIcon className="w-4 h-4 ml-2 text-neutral-400" />
        </label>
        <textarea
          id="prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ej: Modelo vistiendo alta costura bajo el sol del mediodía, fotografía minimalista e iluminada..."
          rows={4}
          className="mt-1 block w-full px-4 py-3 bg-white border border-neutral-200 rounded-lg text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-900 focus:border-neutral-900 transition-all font-['Lato'] resize-none shadow-sm"
          disabled={isLoading}
        />
      </div>

      <div>
        <label htmlFor="aspectRatio" className="block text-xs font-bold text-neutral-500 uppercase tracking-widest mb-3 font-['Lato']">Formato</label>
        <div className="relative">
          <select
            id="aspectRatio"
            value={aspectRatio}
            onChange={(e) => setAspectRatio(e.target.value as AspectRatio)}
            className="appearance-none block w-full pl-4 pr-10 py-3 bg-white border border-neutral-200 rounded-lg text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900 focus:border-neutral-900 transition-all cursor-pointer font-['Lato'] shadow-sm"
            disabled={isLoading}
          >
            {aspectRatios.map(ar => <option key={ar} value={ar}>{ar}</option>)}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-neutral-400">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {error && <p className="text-sm text-red-600 font-medium p-3 bg-red-50 border border-red-100 rounded-lg">{error}</p>}

      <button
        type="submit"
        disabled={isLoading || !prompt.trim()}
        className="w-full flex justify-center items-center px-4 py-4 border border-transparent text-sm font-bold uppercase tracking-widest rounded-lg shadow-[0_0_20px_rgba(0,0,0,0.05)] text-white bg-neutral-900 hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-neutral-900 disabled:bg-neutral-200 disabled:text-neutral-500 disabled:shadow-none disabled:cursor-not-allowed transition-all duration-300 group overflow-hidden relative"
      >
        {isLoading && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-[100%] animate-[shimmer_2s_infinite]"></div>
        )}
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-neutral-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="relative z-10 text-neutral-500">Materializando Visión...</span>
          </>
        ) : (
          <>
            <SparklesIcon className="h-5 w-5 mr-3 group-hover:scale-110 transition-transform" />
            <span className="relative z-10 text-white font-extrabold">Generar Obra de Arte</span>
          </>
        )}
      </button>
    </form>
  );
};

export default ImageGenerator;
