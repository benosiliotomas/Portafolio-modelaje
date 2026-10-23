import React from 'react';
import { profile } from '../data/profile';

export interface NavItem {
  id: string;
  label: string;
  /** Defaults to the in-page anchor `#id`. */
  href?: string;
  /** Hidden on phones, where the name already links to the top of the book. */
  desktopOnly?: boolean;
  /** A separate page rather than a section: set apart by a hairline divider. */
  isPage?: boolean;
}

interface HeaderProps {
  items: NavItem[];
  activeId: string | null;
  /** Where the name links to: the top of this page, or another page. */
  homeHref?: string;
}

const Header: React.FC<HeaderProps> = ({ items, activeId, homeHref = '#top' }) => (
  <header className="sticky top-0 z-40 h-14 bg-paper border-b border-hairline">
    <div className="h-full max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between gap-3">
      <a
        href={homeHref}
        className="font-display text-[15px] min-[400px]:text-[17px] sm:text-xl leading-none tracking-[0.01em] whitespace-nowrap text-ink hover:text-stone transition-colors duration-150"
      >
        {/* Phones under 400px get the short form so the menu fits on one line. */}
        <span className="min-[400px]:hidden" aria-hidden="true">T. Benosilio</span>
        <span className="sr-only min-[400px]:not-sr-only">{profile.name}</span>
      </a>

      <nav aria-label="Navegación principal" className="flex items-center gap-2 min-[360px]:gap-3 min-[400px]:gap-4 sm:gap-8">
        {items.map(({ id, label, href, desktopOnly, isPage }) => {
          const isActive = activeId === id;
          return (
            <React.Fragment key={id}>
              {/* A flex sibling, so the nav gap spaces it evenly at every breakpoint. */}
              {isPage && <span aria-hidden="true" className="h-3 border-l border-hairline" />}
              <a
                href={href ?? `#${id}`}
                aria-current={isActive ? (isPage ? 'page' : 'location') : undefined}
                className={`eyebrow nav-link py-2 border-b transition-colors duration-150 ${desktopOnly ? 'hidden sm:inline' : ''} ${isActive
                  ? 'text-ink border-ink'
                  : 'text-ash border-transparent hover:text-ink'
                  }`}
              >
                {label}
              </a>
            </React.Fragment>
          );
        })}
      </nav>
    </div>
  </header>
);

export default Header;
