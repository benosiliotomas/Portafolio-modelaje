import React from 'react';
import { profile, headlineStats } from '../data/profile';

interface IntroProps {
  onContact: () => void;
}

const Intro: React.FC<IntroProps> = ({ onContact }) => (
  <section aria-label="Presentación" className="max-w-7xl mx-auto px-4 sm:px-8 pt-8 pb-6 sm:pt-12 sm:pb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
    <div>
      <p className="eyebrow text-stone m-0">{profile.role} · {profile.location} / Buenos Aires</p>
      <p className="eyebrow text-ash mt-2 mb-0">
        {headlineStats.map((stat, i) => (
          <React.Fragment key={stat}>
            {i > 0 && ' · '}
            <span className="whitespace-nowrap">{stat}</span>
          </React.Fragment>
        ))}
      </p>
    </div>
    <button
      onClick={onContact}
      className="eyebrow self-start sm:self-auto text-ink border-b border-ink pb-1 hover:text-clay hover:border-clay transition-colors duration-150"
    >
      Contactar →
    </button>
  </section>
);

export default Intro;
