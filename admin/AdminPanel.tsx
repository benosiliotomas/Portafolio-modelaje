import React from 'react';
import ImageUploader from './ImageUploader';
import type { PhotoSection } from '../types';

interface AdminPanelProps {
  onPhotoAdded: (photoData: { alt: string; image: Blob; section: PhotoSection }) => Promise<void>;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onPhotoAdded }) => (
  <section aria-labelledby="admin-heading" className="border-b border-hairline bg-surface">
    <div className="max-w-3xl mx-auto px-4 sm:px-8 py-10">
      <h2 id="admin-heading" className="eyebrow text-stone mt-0 mb-6">Panel de administración · Subir foto</h2>
      <ImageUploader onPhotoAdded={onPhotoAdded} />
    </div>
  </section>
);

export default AdminPanel;
