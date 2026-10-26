import React from 'react';
import PhotoImage from './PhotoImage';
import { profile, headlineStats, COMP_CARD_URL, COMP_CARD_FILENAME } from '../data/profile';
import type { Photo } from '../types';

interface HeroProps {
  cover: Photo | null;
  onOpen: (photo: Photo) => void;
  /** Admin-only overlay with photo controls. */
  controls?: React.ReactNode;
}

const Hero: React.FC<HeroProps> = ({ cover, onOpen, controls }) => (
  <section id="top" aria-labelledby="hero-name" className="max-w-7xl mx-auto sm:px-8 sm:pt-8 grid grid-cols-1 lg:grid-cols-12 lg:gap-12 lg:items-end">
    {/* The cover stays a vertical 4:5 frame. On desktop it is sized from the screen height so the
        name and contact link stay above the fold, instead of stretching into a square that crops
        the head off portrait photos. */}
    <div className="lg:col-span-7">
      <div className="relative group aspect-[4/5] lg:w-[min(100%,calc((100svh-6rem)*0.8))] bg-hairline overflow-hidden">
        {cover && (
          <button onClick={() => onOpen(cover)} className="block w-full h-full" aria-label="Ver la foto de portada en grande">
            {/* Faces sit in the upper part of a portrait, so the crop is anchored near the top. */}
            <PhotoImage photo={cover} index={0} sizes="(min-width: 1024px) 58vw, 100vw" priority className="object-[50%_15%]" />
          </button>
        )}
        {controls}
      </div>
    </div>

    <div className="px-4 sm:px-0 pt-6 pb-12 lg:pb-2 lg:col-span-5">
      <p className="eyebrow text-stone m-0">{profile.role} · {profile.location}</p>
      <h1 id="hero-name" className="text-5xl sm:text-6xl lg:text-7xl leading-[1.02] text-ink mt-4 mb-5">
        {profile.name}
      </h1>
      <p className="eyebrow text-ash m-0">
        {headlineStats.map((stat, i) => (
          <React.Fragment key={stat}>
            {i > 0 && ' · '}
            <span className="whitespace-nowrap">{stat}</span>
          </React.Fragment>
        ))}
      </p>
      <div className="flex flex-wrap gap-x-8 gap-y-3 mt-8">
        <a href="#contacto" className="eyebrow text-ink border-b border-ink pb-1 hover:text-clay hover:border-clay transition-colors duration-150">
          Contactar →
        </a>
        <a href={COMP_CARD_URL} download={COMP_CARD_FILENAME} className="eyebrow text-stone border-b border-hairline pb-1 hover:text-clay hover:border-clay transition-colors duration-150">
          Comp card (PDF)
        </a>
      </div>
    </div>
  </section>
);

export default Hero;
