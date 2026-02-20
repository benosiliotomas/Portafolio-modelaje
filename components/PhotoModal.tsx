import React, { useState, useEffect } from 'react';
import { CloseIcon, SparklesIcon, ChevronLeftIcon, ChevronRightIcon, PencilIcon } from './icons';
import type { Photo } from '../types';
import { generateArtisticConcept } from '../services/geminiService';

interface PhotoModalProps {
  photo: Photo | null;
  onClose: () => void;
  onUpdateConcept: (photoId: string, concept: string) => void;
  onUpdateDetails: (photoId: string, alt: string, concept: string) => void;
  onNext: () => void;
  onPrevious: () => void;
  hasNext: boolean;
  hasPrevious: boolean;
  isReadOnly?: boolean;
  startInEditMode?: boolean;
}

const PhotoModal: React.FC<PhotoModalProps> = ({
  photo, onClose, onUpdateConcept, onUpdateDetails, onNext, onPrevious, hasNext, hasPrevious, isReadOnly = false, startInEditMode = false
}) => {
  const [isRevealed, setIsRevealed] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Edit form state
  const [editAlt, setEditAlt] = useState('');
  const [editConcept, setEditConcept] = useState('');

  useEffect(() => {
    if (photo) {
      // Reset state for new photo
      setIsRevealed(false);
      setError(null);
      setIsEditing(startInEditMode);
      setEditAlt(photo.alt);
      setEditConcept(photo.concept || '');

      // Trigger the cinematic "reveal/focus" animation
      const timer = setTimeout(() => setIsRevealed(true), 150);
      return () => clearTimeout(timer);
    }
  }, [photo, startInEditMode]);

  if (!photo) return null;

  const handleGenerateConcept = async () => {
    setIsGenerating(true);
    setError(null);
    try {
      const concept = await generateArtisticConcept(photo.alt);
      if (isEditing) {
        setEditConcept(concept);
      } else {
        onUpdateConcept(photo.id, concept);
      }
    } catch (err: any) {
      setError(err.message || "Error al conectar con la IA.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveDetails = () => {
    onUpdateDetails(photo.id, editAlt, editConcept);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditAlt(photo.alt);
    setEditConcept(photo.concept || '');
    setIsEditing(false);
  };

  return (
    <div
      className="fixed inset-0 bg-white/95 backdrop-blur-3xl z-50 flex items-center justify-center p-4 md:p-12 transition-all duration-500 ease-out"
      onClick={onClose}
    >
      {/* Navigation Arrows */}
      {!isEditing && hasPrevious && (
        <button
          onClick={(e) => { e.stopPropagation(); onPrevious(); setIsRevealed(false); }}
          className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-50 p-4 bg-white/50 border border-neutral-200 backdrop-blur-md rounded-full text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 shadow-sm transition-all duration-300 group"
          aria-label="Previous photo"
        >
          <ChevronLeftIcon className="h-8 w-8 group-hover:-translate-x-1 transition-transform" />
        </button>
      )}

      {!isEditing && hasNext && (
        <button
          onClick={(e) => { e.stopPropagation(); onNext(); setIsRevealed(false); }}
          className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-50 p-4 bg-white/50 border border-neutral-200 backdrop-blur-md rounded-full text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 shadow-sm transition-all duration-300 group"
          aria-label="Next photo"
        >
          <ChevronRightIcon className="h-8 w-8 group-hover:translate-x-1 transition-transform" />
        </button>
      )}

      <div
        className={`relative w-full max-w-7xl h-full max-h-[90vh] flex flex-col md:flex-row items-center justify-center gap-8 transition-all duration-700 ease-out ${isRevealed ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 md:top-0 md:-right-16 text-neutral-400 hover:text-neutral-900 z-50 p-2 transition-colors duration-300"
          title="Cerrar (Esc)"
        >
          <CloseIcon className="h-8 w-8" />
        </button>

        {/* Photo Area */}
        <div className="w-full h-[50vh] md:h-full md:w-2/3 flex items-center justify-center relative group">
          <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-transparent to-transparent md:hidden z-10"></div>
          <img
            src={photo.url}
            alt={photo.alt}
            className={`object-contain max-h-full w-auto drop-shadow-xl transition-all duration-1000 ${isRevealed ? 'filter-none' : 'blur-2xl brightness-110'}`}
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Details Area */}
        <div className="w-full md:w-1/3 flex flex-col justify-center max-h-[40vh] md:max-h-full overflow-y-auto z-20 px-4 md:px-8 py-8 md:py-12 bg-white/80 backdrop-blur-xl rounded-2xl border border-neutral-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.06)]">

          <div className="flex justify-between items-start mb-6">
            {!isEditing ? (
              <div className="group/title relative inline-block">
                <h3 className="text-3xl md:text-4xl font-bold text-neutral-900 font-['Bodoni_Moda'] tracking-wide">
                  {photo.alt || 'Sin título'}
                </h3>
              </div>
            ) : (
              <div className="w-full">
                <label className="block text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2 font-['Lato']">Título</label>
                <input
                  type="text"
                  value={editAlt}
                  onChange={(e) => setEditAlt(e.target.value)}
                  className="w-full p-3 bg-white border border-neutral-200 rounded-lg font-['Bodoni_Moda'] text-xl text-neutral-900 focus:ring-1 focus:ring-neutral-900 focus:border-neutral-900 transition-all outline-none shadow-sm"
                />
              </div>
            )}

            {!isReadOnly && !isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="ml-4 text-neutral-400 hover:text-neutral-700 transition-colors p-2 bg-neutral-100 rounded-full hover:bg-neutral-200 shadow-sm"
                title="Editar información"
              >
                <PencilIcon className="h-5 w-5" />
              </button>
            )}
          </div>

          <div className="text-neutral-600 font-light tracking-wide leading-relaxed flex-grow">
            {isEditing ? (
              <div className="w-full mt-6">
                <label className="block text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2 font-['Lato']">Detalles / Concepto Visual</label>
                <textarea
                  value={editConcept}
                  onChange={(e) => setEditConcept(e.target.value)}
                  rows={8}
                  className="w-full p-4 bg-white border border-neutral-200 rounded-lg text-neutral-700 focus:ring-1 focus:ring-neutral-900 focus:border-neutral-900 transition-all outline-none resize-none font-['Lato'] shadow-sm"
                  placeholder="Describe la estética, la iluminación o la idea detrás de la toma..."
                />
              </div>
            ) : (
              <div className="space-y-6">
                {isGenerating && (
                  <div className="flex items-center space-x-3 text-neutral-500 animate-pulse">
                    <SparklesIcon className="w-5 h-5" />
                    <span className="italic text-sm">El estudio digital está redactando un concepto...</span>
                  </div>
                )}
                {error && <p className="text-red-600 text-sm p-3 bg-red-50 border border-red-100 rounded-lg">{error}</p>}

                <div className="prose prose-p:text-neutral-600 prose-p:font-light">
                  {photo.concept ? (
                    <p className="text-lg italic border-l-2 border-neutral-300 pl-4 py-1">"{photo.concept}"</p>
                  ) : (
                    <p className="text-neutral-400 italic">Captura cruda. Sin detalles conceptuales.</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="mt-10 pt-6 border-t border-neutral-200">
            {isEditing ? (
              <div className="flex space-x-4">
                <button
                  onClick={handleCancelEdit}
                  className="flex-1 py-3 px-4 bg-white border border-neutral-200 text-neutral-600 rounded-lg hover:bg-neutral-50 transition-all duration-300 text-sm uppercase tracking-widest shadow-sm"
                >
                  Descartar
                </button>
                <button
                  onClick={handleSaveDetails}
                  className="flex-1 py-3 px-4 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-all duration-300 font-bold text-sm uppercase tracking-widest shadow-md"
                >
                  Guardar
                </button>
              </div>
            ) : (
              !isReadOnly && (
                <button
                  onClick={handleGenerateConcept}
                  disabled={isGenerating}
                  className="w-full flex items-center justify-center px-4 py-3 bg-white border border-neutral-200 text-neutral-700 rounded-lg hover:bg-neutral-50 hover:text-neutral-900 disabled:opacity-50 transition-all duration-300 group shadow-sm"
                >
                  <SparklesIcon className="h-5 w-5 mr-3 text-neutral-400 group-hover:text-amber-500 transition-colors" />
                  <span className="text-sm uppercase tracking-widest font-semibold">
                    {isGenerating ? 'Revelando...' : 'Inspirar Concepto (IA)'}
                  </span>
                </button>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoModal;
