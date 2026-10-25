import React, { useCallback, useEffect, useState } from 'react';
import Header from './Header';
import { siteNav } from './navigation';
import Hero from './Hero';
import BookSection from './BookSection';
import DigitalsSection from './DigitalsSection';
import MeasurementsSection from './MeasurementsSection';
import Contact from './Contact';
import PhotoModal from './PhotoModal';
import AdminControls, { AdminActions } from './AdminControls';
import { useActiveSection } from '../hooks/useActiveSection';
import { splitPortfolio } from '../lib/portfolio';
import { getVisiblePhotos } from '../lib/photoUtils';
import { profile } from '../data/profile';
import type { Photo } from '../types';

const NAV_ITEMS = siteNav(true);
const OBSERVED_SECTIONS = ['top', ...NAV_ITEMS.filter(item => !item.isPage).map(item => item.id)];

interface PortfolioProps {
  photos: Photo[];
  isLoading: boolean;
  error: string | null;
  /** Present only in the admin bundle. */
  admin?: AdminActions;
  adminPanel?: React.ReactNode;
  footerAction?: React.ReactNode;
}

interface ViewerState {
  list: Photo[];
  index: number;
  editing: boolean;
}

const Portfolio: React.FC<PortfolioProps> = ({ photos, isLoading, error, admin, adminPanel, footerAction }) => {
  const { cover, book, digitals } = splitPortfolio(getVisiblePhotos(photos, Boolean(admin)));
  // "top" (the cover) is observed too, so scrolling back up clears the highlight.
  const activeId = useActiveSection(OBSERVED_SECTIONS);
  const [viewer, setViewer] = useState<ViewerState | null>(null);

  // Arriving from another page at /#medidas: the browser jumps before the photos exist and
  // they push the section down, so jump again once they are on the page.
  useEffect(() => {
    if (isLoading || !window.location.hash) return;
    const target = document.getElementById(window.location.hash.slice(1));
    if (target) requestAnimationFrame(() => target.scrollIntoView());
  }, [isLoading]);

  const open = (list: Photo[], editing = false) => (photo: Photo) =>
    setViewer({ list, index: Math.max(0, list.findIndex(p => p.id === photo.id)), editing });

  const close = useCallback(() => setViewer(null), []);
  const step = useCallback((direction: -1 | 1) => {
    setViewer(v => (v ? { ...v, index: Math.min(Math.max(v.index + direction, 0), v.list.length - 1), editing: false } : v));
  }, []);
  const next = useCallback(() => step(1), [step]);
  const previous = useCallback(() => step(-1), [step]);

  const controlsFor = (list: Photo[]) => admin
    ? (photo: Photo, index: number) => (
      <AdminControls
        photo={photo}
        actions={admin}
        onEdit={open(list, true)}
        canMovePrevious={index > 0}
        canMoveNext={index < list.length - 1}
      />
    )
    : undefined;

  // Keep the open photo in sync with live admin edits.
  const current = viewer ? viewer.list[viewer.index] : null;
  const currentPhoto = current ? photos.find(p => p.id === current.id) ?? current : null;
  const coverList = cover ? [cover] : [];

  return (
    <div className="min-h-screen flex flex-col">
      <Header items={NAV_ITEMS} activeId={activeId} />

      <main className="flex-1">
        {adminPanel}

        {error && (
          <div className="max-w-4xl mx-auto my-6 px-4">
            <div className="border-l-2 border-clay bg-surface text-stone p-4" role="alert">
              <p className="m-0 text-sm">{error}</p>
            </div>
          </div>
        )}

        <Hero
          cover={cover}
          onOpen={open(coverList)}
          controls={admin && cover ? controlsFor(coverList)?.(cover, 0) : undefined}
        />

        {isLoading ? (
          <p className="eyebrow text-center py-20 text-ash">Cargando…</p>
        ) : (
          <>
            <BookSection photos={book} onOpen={open(book)} renderControls={controlsFor(book)} />
            <DigitalsSection photos={digitals} onOpen={open(digitals)} renderControls={controlsFor(digitals)} />
          </>
        )}

        <MeasurementsSection />
        <Contact />
      </main>

      {viewer && currentPhoto && (
        <PhotoModal
          photo={currentPhoto}
          index={viewer.index}
          total={viewer.list.length}
          onClose={close}
          onUpdateCaption={(id, caption) => admin?.onUpdateCaption(id, caption)}
          onNext={next}
          onPrevious={previous}
          hasNext={viewer.index < viewer.list.length - 1}
          hasPrevious={viewer.index > 0}
          isReadOnly={!admin}
          startInEditMode={viewer.editing}
        />
      )}

      <footer className="border-t border-hairline">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6 flex items-center justify-between gap-4">
          <p className="eyebrow text-ash m-0">&copy; {new Date().getFullYear()} {profile.name}</p>
          {footerAction}
        </div>
      </footer>
    </div>
  );
};

export default Portfolio;
