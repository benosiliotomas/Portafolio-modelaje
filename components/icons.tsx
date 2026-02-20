
import React from 'react';

export const ClothespinIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 100 130" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      {/* Realistic Chrome Gradient (High Contrast for Metallic Look) */}
      <linearGradient id="chrome-real" x1="0%" y1="0%" x2="100%" y2="0%" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#888" />
        <stop offset="15%" stopColor="#fff" />
        <stop offset="35%" stopColor="#bbb" />
        <stop offset="50%" stopColor="#666" />
        <stop offset="65%" stopColor="#fff" />
        <stop offset="85%" stopColor="#999" />
        <stop offset="100%" stopColor="#555" />
      </linearGradient>

      {/* Darker Chrome for Rear Handle (Depth) */}
      <linearGradient id="chrome-dark" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#444" />
        <stop offset="20%" stopColor="#999" />
        <stop offset="50%" stopColor="#222" />
        <stop offset="80%" stopColor="#777" />
        <stop offset="100%" stopColor="#333" />
      </linearGradient>

      {/* Black Oxide Steel Body (Matte with subtle shine) */}
      <linearGradient id="black-oxide" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#333" />
        <stop offset="10%" stopColor="#000" />
        <stop offset="80%" stopColor="#111" />
        <stop offset="95%" stopColor="#333" />
        <stop offset="100%" stopColor="#000" />
      </linearGradient>
      
      {/* Cylinder Highlight for Rolled Edge */}
      <linearGradient id="cylinder-shine" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#222" />
        <stop offset="30%" stopColor="#666" />
        <stop offset="50%" stopColor="#111" />
        <stop offset="100%" stopColor="#000" />
      </linearGradient>

      <filter id="soft-shadow" x="-50%" y="-50%" width="200%" height="200%">
        <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.4"/>
      </filter>
    </defs>

    {/* --- REAR HANDLE (Back wire) --- */}
    {/* Shape mimics the classic 'keyhole' wire profile of binder clips */}
    <path 
      d="M22 62 L 34 62 L 38 35 C 38 20, 30 10, 50 10 C 70 10, 62 20, 62 35 L 66 62 L 78 62" 
      fill="none" 
      stroke="url(#chrome-dark)" 
      strokeWidth="3.5" 
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    {/* --- CLIP BODY --- */}
    <g filter="url(#soft-shadow)">
        {/* Main Trapezoid Face */}
        <path d="M15 62 H 85 L 82 95 H 18 Z" fill="url(#black-oxide)" />
        
        {/* Rolled Top Edge (Simulated Cylinder) */}
        {/* This is the tube part at the top */}
        <path d="M12 60 A 5 5 0 0 1 20 60 V 64 A 5 5 0 0 1 12 64 Z" fill="url(#cylinder-shine)" /> {/* Left Cap */}
        <rect x="16" y="60" width="68" height="4" fill="url(#cylinder-shine)" /> {/* Main Tube */}
        <path d="M80 60 A 5 5 0 0 1 88 60 V 64 A 5 5 0 0 1 80 64 Z" fill="url(#cylinder-shine)" /> {/* Right Cap */}

        {/* Subtle highlight line on the front face edge */}
        <path d="M15 64 L 85 64" stroke="#555" strokeWidth="0.5" opacity="0.5" />
    </g>

    {/* --- FRONT HANDLE (Front wire) --- */}
    {/* The visible part of the wire interacting with the rolled edge */}
    
    {/* Wire entering the left cylinder */}
    <path d="M18 62 L 34 62" stroke="url(#chrome-real)" strokeWidth="3.5" strokeLinecap="round" />
    
    {/* Wire entering the right cylinder */}
    <path d="M82 62 L 66 62" stroke="url(#chrome-real)" strokeWidth="3.5" strokeLinecap="round" />

    {/* Main Loop Upwards */}
    <path 
      d="M34 62 L 38 38 C 38 22, 30 12, 50 12 C 70 12, 62 22, 62 38 L 66 62" 
      fill="none" 
      stroke="url(#chrome-real)" 
      strokeWidth="3.5" 
      strokeLinecap="round"
      strokeLinejoin="round"
      filter="url(#soft-shadow)"
    />

    {/* Highlight reflection on the top curve of the wire */}
    <path 
      d="M40 16 C 45 13, 55 13, 60 16" 
      fill="none" 
      stroke="white" 
      strokeWidth="1" 
      opacity="0.6" 
      strokeLinecap="round"
    />

  </svg>
);


export const CloseIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export const HamburgerIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
  </svg>
);

export const SparklesIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.562L16.25 22.5l-.648-1.938a3.375 3.375 0 00-2.6-2.6L11.25 18l1.938-.648a3.375 3.375 0 002.6-2.6l.648-1.938 1.938.648a3.375 3.375 0 002.6 2.6l.648 1.938-.648 1.938a3.375 3.375 0 00-2.6 2.6z" />
  </svg>
);

export const ChevronLeftIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
  </svg>
);

export const ChevronRightIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
  </svg>
);

export const TrashIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.067-2.09.921-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
  </svg>
);

export const UploadIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
  </svg>
);

export const EnvelopeIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
  </svg>
);

export const PhoneIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 6.75z" />
  </svg>
);

export const PencilIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
  </svg>
);
