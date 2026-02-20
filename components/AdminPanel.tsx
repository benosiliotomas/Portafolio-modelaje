import React, { useState } from 'react';
import ImageGenerator from './ImageGenerator';
import ImageUploader from './ImageUploader';

interface AdminPanelProps {
  onPhotoAdded: (photoData: { alt: string; image: Blob }) => Promise<void>;
}

type ActiveTab = 'generate' | 'upload';

const AdminPanel: React.FC<AdminPanelProps> = ({ onPhotoAdded }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('upload');

  const tabStyles = "flex-1 py-3 text-sm font-semibold uppercase tracking-widest transition-all duration-300 rounded-t-lg";
  const activeTabStyles = "bg-white text-neutral-900 border-t border-l border-r border-neutral-200 shadow-[0_-5px_15px_-5px_rgba(0,0,0,0.05)]";
  const inactiveTabStyles = "bg-neutral-50 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700 border-b border-neutral-200";

  return (
    <div className="py-16 relative z-10 before:absolute before:inset-0 before:bg-gradient-to-b before:from-neutral-100/50 before:to-transparent before:-z-10">
      <div className="max-w-3xl mx-auto px-4">

        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-neutral-900 mb-2 font-['Bodoni_Moda'] tracking-wide">Panel de Control</h2>
          <p className="text-neutral-500 text-sm tracking-widest uppercase font-light">Galería Digital</p>
        </div>

        <div className="flex">
          <button
            onClick={() => setActiveTab('upload')}
            className={`${tabStyles} ${activeTab === 'upload' ? activeTabStyles : inactiveTabStyles}`}
          >
            Cargar Foto
          </button>
          <button
            onClick={() => setActiveTab('generate')}
            className={`${tabStyles} ${activeTab === 'generate' ? activeTabStyles : inactiveTabStyles}`}
          >
            Generar con IA
          </button>
        </div>

        <div className="bg-white p-6 md:p-10 rounded-b-xl border-x border-b border-neutral-200 shadow-xl">
          {activeTab === 'generate' && (
            <ImageGenerator onPhotoAdded={onPhotoAdded} />
          )}
          {activeTab === 'upload' && (
            <ImageUploader onPhotoAdded={onPhotoAdded} />
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
