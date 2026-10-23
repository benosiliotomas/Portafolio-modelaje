import React from 'react';
import { profile } from '../data/profile';

export type Page = 'gallery' | 'model-data' | 'contact';

interface HeaderProps {
  activePage: Page;
  onNavigate: (page: Page) => void;
}

const NAV_ITEMS: { page: Page; label: string }[] = [
  { page: 'gallery', label: 'Book' },
  { page: 'model-data', label: 'Medidas' },
  { page: 'contact', label: 'Contacto' },
];

const Header: React.FC<HeaderProps> = ({ activePage, onNavigate }) => {
  return (
    <header className="sticky top-0 z-40 h-14 bg-paper border-b border-hairline">
      <div className="h-full max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between gap-4">
        <h1 className="m-0 text-[15px] min-[400px]:text-[17px] sm:text-xl leading-none tracking-[0.01em] whitespace-nowrap">
          <button
            onClick={() => onNavigate('gallery')}
            className="font-display text-ink hover:text-stone transition-colors duration-150"
          >
            {profile.name}
          </button>
        </h1>

        <nav aria-label="Navegación principal" className="flex items-center gap-3 min-[400px]:gap-4 sm:gap-8">
          {NAV_ITEMS.map(({ page, label }) => {
            const isActive = activePage === page;
            return (
              <button
                key={page}
                onClick={() => onNavigate(page)}
                aria-current={isActive ? 'page' : undefined}
                className={`eyebrow nav-link py-2 border-b transition-colors duration-150 ${isActive
                  ? 'text-ink border-ink'
                  : 'text-ash border-transparent hover:text-ink'
                  }`}
              >
                {label}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};

export default Header;
