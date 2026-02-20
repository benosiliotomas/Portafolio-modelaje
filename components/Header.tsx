import React from 'react';

export type Page = 'gallery' | 'model-data' | 'contact';

interface HeaderProps {
  activePage: Page;
  onNavigate: (page: Page) => void;
}

const NavButton: React.FC<{
  page: Page;
  activePage: Page;
  onNavigate: (page: Page) => void;
  children: React.ReactNode;
}> = ({ page, activePage, onNavigate, children }) => {
  const isActive = activePage === page;
  return (
    <button
      onClick={() => onNavigate(page)}
      className={`px-4 py-2 rounded-full text-sm font-bold tracking-wider transition-all duration-300 relative overflow-hidden group ${isActive
          ? 'text-neutral-900'
          : 'text-neutral-500 hover:text-neutral-700'
        }`}
      aria-current={isActive ? 'page' : undefined}
    >
      <span className="relative z-10">{children}</span>
      {isActive && (
        <span className="absolute inset-0 bg-white shadow-sm border border-neutral-200/60 rounded-full -z-0"></span>
      )}
      {!isActive && (
        <span className="absolute inset-0 bg-neutral-100 rounded-full -z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 scale-95 group-hover:scale-100"></span>
      )}
    </button>
  );
};

const Header: React.FC<HeaderProps> = ({ activePage, onNavigate }) => {
  return (
    <header className="text-center pt-16 pb-12 px-4 border-b border-neutral-200 bg-white/70 backdrop-blur-xl sticky top-0 z-40 transition-all duration-500">
      <h1
        className="text-5xl md:text-7xl font-bold text-neutral-900 animate-fade-in font-['Bodoni_Moda']"
      >
        Tomás Benosilio
      </h1>
      <p className="mt-6 text-sm md:text-base text-neutral-500 font-bold tracking-[0.2em] uppercase font-['Lato']">Modelo Profesional</p>

      <nav className="mt-10 flex justify-center items-center space-x-2 md:space-x-6 bg-neutral-100/50 p-1 rounded-full w-max mx-auto border border-neutral-200/80 shadow-inner" aria-label="Main navigation">
        <NavButton page="gallery" activePage={activePage} onNavigate={onNavigate}>
          GALERÍA
        </NavButton>
        <NavButton page="model-data" activePage={activePage} onNavigate={onNavigate}>
          MEDIDAS
        </NavButton>
        <NavButton page="contact" activePage={activePage} onNavigate={onNavigate}>
          CONTACTO
        </NavButton>
      </nav>
    </header>
  );
};

export default Header;
