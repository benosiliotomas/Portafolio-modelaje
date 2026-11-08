import React from 'react';
import { SectionHeading } from './BookSection';
import { profile } from '../data/profile';

const AboutSection: React.FC = () => (
  <section id="sobre-mi" aria-labelledby="sobre-mi-heading" className="max-w-7xl mx-auto px-4 sm:px-8 pt-[var(--space-section)] scroll-mt-14">
    <div className="-mx-4 sm:mx-0">
      <SectionHeading id="sobre-mi-heading" number="04" title="Sobre mí" />
    </div>
    <div className="max-w-3xl">
      <p className="font-display text-2xl sm:text-3xl leading-snug text-ink m-0">{profile.name} - {profile.role}</p>
      <p className="text-stone text-[15px] leading-relaxed mt-4 mb-0">{profile.about}</p>
    </div>
  </section>
);

export default AboutSection;
