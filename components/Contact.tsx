
import React from 'react';
import { EnvelopeIcon, PhoneIcon } from './icons';

const Contact: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-20 px-4 animate-fade-in relative">
      <h2
        className="text-4xl md:text-5xl font-bold text-center text-neutral-900 mb-12 tracking-wide font-['Bodoni_Moda']"
      >
        Contacto
      </h2>
      <div className="glass-panel p-10 md:p-14 rounded-2xl max-w-lg mx-auto relative overflow-hidden group">

        {/* Subtle hover gleam */}
        <div className="absolute top-0 left-[-100%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/50 to-transparent skew-x-[-20deg] group-hover:left-[200%] transition-all duration-1000 ease-in-out"></div>

        <ul className="space-y-8 text-neutral-700 font-light tracking-wide">
          <li className="border-b border-neutral-200 pb-4">
            <strong className="text-xs uppercase tracking-[0.2em] text-neutral-500 block mb-2 font-semibold font-['Lato']">Nombre completo</strong>
            <span className="text-xl text-neutral-900">Tomás Benosilio</span>
          </li>
          <li className="border-b border-neutral-200 pb-4">
            <strong className="text-xs uppercase tracking-[0.2em] text-neutral-500 block mb-2 font-semibold font-['Lato']">Correo electrónico</strong>
            <a href="mailto:benosiliotomas@gmail.com" className="flex items-center text-neutral-700 hover:text-neutral-900 transition-colors group/link w-fit">
              <EnvelopeIcon className="h-5 w-5 mr-3 text-neutral-400 group-hover/link:text-neutral-600 transition-colors" />
              <span className="text-lg relative">
                benosiliotomas@gmail.com
                <span className="absolute bottom-0 left-0 w-0 h-px bg-neutral-900 transition-all duration-300 group-hover/link:w-full"></span>
              </span>
            </a>
          </li>
          <li className="pb-2">
            <strong className="text-xs uppercase tracking-[0.2em] text-neutral-500 block mb-2 font-semibold font-['Lato']">Teléfono</strong>
            <a href="tel:+5492236352632" className="flex items-center text-neutral-700 hover:text-neutral-900 transition-colors group/link w-fit">
              <PhoneIcon className="h-5 w-5 mr-3 text-neutral-400 group-hover/link:text-neutral-600 transition-colors" />
              <span className="text-lg relative">
                +54 9 223 6352632
                <span className="absolute bottom-0 left-0 w-0 h-px bg-neutral-900 transition-all duration-300 group-hover/link:w-full"></span>
              </span>
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Contact;
