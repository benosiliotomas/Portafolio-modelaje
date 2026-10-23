import React from 'react';
import { profile } from '../data/profile';

export interface NavItem {
  id: string;
  label: string;
  /** Hidden on phones, where the name already links to the top of the book. */
  desktopOnly?: boolean;
}

interface HeaderProps {
  items: NavItem[];
  activeId: string | null;
}

const Header: React.FC<HeaderProps> = ({ items, activeId }) => (
  <header className="sticky top-0 z-40 h-14 bg-paper border-b border-hairline">
    <div className="h-full max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between gap-4">
      <a
        href="#top"
        className="font-display text-[15px] min-[400px]:text-[17px] sm:text-xl leading-none tracking-[0.01em] whitespace-nowrap text-ink hover:text-stone transition-colors duration-150"
      >
        {profile.name}
      </a>

      <nav aria-label="Navegación principal" className="flex items-center gap-2 min-[360px]:gap-3 min-[400px]:gap-4 sm:gap-8">
        {items.map(({ id, label, desktopOnly }) => {
          const isActive = activeId === id;
          return (
            <a
              key={id}
              href={`#${id}`}
              aria-current={isActive ? 'location' : undefined}
              className={`eyebrow nav-link py-2 border-b transition-colors duration-150 ${desktopOnly ? 'hidden sm:inline' : ''} ${isActive
                ? 'text-ink border-ink'
                : 'text-ash border-transparent hover:text-ink'
                }`}
            >
              {label}
            </a>
          );
        })}
      </nav>
    </div>
  </header>
);

export default Header;
