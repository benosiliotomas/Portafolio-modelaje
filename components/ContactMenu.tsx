import React, { useState, useEffect } from 'react';
import { HamburgerIcon, CloseIcon } from './icons';

const ContactMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-6 right-6 z-50 p-2 bg-white/50 rounded-full text-stone-800 hover:bg-white/80 transition-all shadow-md"
        aria-label="Open contact menu"
      >
        <HamburgerIcon className="h-6 w-6" />
      </button>

      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-[60] transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
      >
        <div
          className={`fixed top-0 right-0 h-full w-80 max-w-full bg-stone-50 shadow-2xl transform transition-transform duration-300 ease-in-out ${
            isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6 h-full flex flex-col">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-stone-900">Datos de contacto</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-stone-500 hover:text-stone-900 p-1"
                aria-label="Close contact menu"
              >
                <CloseIcon className="h-6 w-6" />
              </button>
            </div>
            <ul className="space-y-4 text-stone-700 font-light">
              <li>
                <strong className="font-medium text-stone-800 block">Nombre completo:</strong>
                Tomás Benosilio
              </li>
              <li>
                <strong className="font-medium text-stone-800 block">Correo electrónico:</strong>
                <a href="mailto:benosiliotomas@gmail.com" className="hover:underline text-amber-700">benosiliotomas@gmail.com</a>
              </li>
              <li>
                <strong className="font-medium text-stone-800 block">Número de teléfono:</strong>
                <a href="tel:+5492236352632" className="hover:underline text-amber-700">+54 9 223 6352632</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactMenu;
