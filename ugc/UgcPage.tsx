import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import PhotoImage from '../components/PhotoImage';
import { siteNav } from '../components/navigation';
import { SectionHeading } from '../components/BookSection';
import { fetchPublicPhotos } from '../services/firestoreRest';
import { profile } from '../data/profile';
import { ugc, pickUgcPhotos, ugcMailto } from '../data/ugc';
import type { Photo } from '../types';

const instagramUrl = profile.instagram ? `https://instagram.com/${profile.instagram}` : null;
const whatsappUrl = `https://wa.me/${profile.phoneE164.replace('+', '')}?text=${encodeURIComponent(ugc.whatsappMessage)}`;

const linkClass = 'eyebrow text-ink border-b border-ink pb-1 hover:text-clay hover:border-clay transition-colors duration-150';

const UgcPage: React.FC = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);

  useEffect(() => {
    let cancelled = false;
    fetchPublicPhotos()
      .then(all => { if (!cancelled) setPhotos(pickUgcPhotos(all)); })
      // The page reads fine without the photo strip, so a failed fetch only hides it.
      .catch((err: unknown) => console.error('Failed to load photos:', err));
    return () => { cancelled = true; };
  }, []);

  const contacts = [
    { label: 'Email', value: profile.email, href: ugcMailto(profile.email), external: false },
    { label: 'WhatsApp', value: profile.phoneDisplay, href: whatsappUrl, external: true },
    ...(instagramUrl ? [{ label: 'Instagram', value: `@${profile.instagram}`, href: instagramUrl, external: true }] : []),
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header items={siteNav(false)} activeId="contenido" homeHref="/" />

      <main className="flex-1">
        <section aria-labelledby="ugc-heading" className="max-w-7xl mx-auto px-4 sm:px-8 pt-12 sm:pt-20 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 lg:items-end">
          <div className="lg:col-span-6">
            <p className="eyebrow text-stone m-0">{profile.name} · Creador de contenido</p>
            <h1 id="ugc-heading" className="text-5xl sm:text-6xl lg:text-7xl leading-[1.02] text-ink mt-4 mb-6">{ugc.headline}</h1>
            <p className="font-display text-xl leading-relaxed text-stone m-0 max-w-lg">{ugc.intro}</p>
            <div className="flex flex-wrap gap-x-8 gap-y-3 mt-8">
              <a href="#contacto" className={linkClass}>Pedir propuesta →</a>
              {instagramUrl && (
                <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="eyebrow text-stone border-b border-hairline pb-1 hover:text-clay hover:border-clay transition-colors duration-150">
                  Ver Instagram
                </a>
              )}
            </div>
          </div>

          {photos.length > 0 && (
            <ul className="lg:col-span-6 grid grid-cols-3 gap-2 sm:gap-3 list-none p-0 m-0" aria-label="Fotos comerciales">
              {photos.map((photo, index) => (
                <li key={photo.id} className="aspect-[4/5] overflow-hidden bg-hairline">
                  <PhotoImage photo={photo} index={index} sizes="(min-width: 1024px) 16vw, 32vw" priority={index === 0} />
                </li>
              ))}
            </ul>
          )}
        </section>

        <section aria-labelledby="formatos-heading" className="max-w-7xl mx-auto px-4 sm:px-8 pt-[var(--space-section)]">
          <div className="-mx-4 sm:mx-0"><SectionHeading id="formatos-heading" number="01" title="Formatos" /></div>
          <ol className="list-none p-0 m-0 border-t border-hairline grid grid-cols-1 md:grid-cols-2 md:gap-x-12">
            {ugc.formats.map((format, i) => (
              <li key={format} className="flex items-baseline gap-6 py-5 border-b border-hairline">
                <span className="eyebrow text-ash">{String(i + 1).padStart(2, '0')}</span>
                <span className="text-ink text-[15px]">{format}</span>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="proceso-heading" className="max-w-7xl mx-auto px-4 sm:px-8 pt-[var(--space-section)]">
          <div className="-mx-4 sm:mx-0"><SectionHeading id="proceso-heading" number="02" title="Cómo trabajamos" /></div>
          <ol className="list-none p-0 m-0 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {ugc.steps.map((step, i) => (
              <li key={step.title} className="border-t border-ink pt-5">
                <p className="eyebrow text-ash m-0">{String(i + 1).padStart(2, '0')}</p>
                <h3 className="text-2xl text-ink mt-3 mb-2">{step.title}</h3>
                <p className="text-stone text-[15px] leading-relaxed m-0">{step.text}</p>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="muestras-heading" className="max-w-7xl mx-auto px-4 sm:px-8 pt-[var(--space-section)]">
          <div className="-mx-4 sm:mx-0"><SectionHeading id="muestras-heading" number="03" title="Muestras" /></div>
          {ugc.samples.length > 0 ? (
            <ul className="list-none p-0 m-0 border-t border-hairline">
              {ugc.samples.map(sample => (
                <li key={sample.url} className="border-b border-hairline">
                  <a href={sample.url} target="_blank" rel="noopener noreferrer" className="group flex items-baseline justify-between gap-4 py-5">
                    <span className="eyebrow text-ash">{sample.brand ?? 'Muestra'}</span>
                    <span className="text-ink text-[15px] text-right group-hover:text-clay transition-colors duration-150">{sample.title} →</span>
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-stone text-[15px] m-0">
              Te mando ejemplos según tu rubro.{' '}
              <a href="#contacto" className="text-ink border-b border-ink hover:text-clay hover:border-clay">Pedilos acá</a>.
            </p>
          )}
        </section>

        <section id="contacto" aria-labelledby="contacto-heading" className="max-w-7xl mx-auto px-4 sm:px-8 py-[var(--space-section)] scroll-mt-14">
          <div className="-mx-4 sm:mx-0"><SectionHeading id="contacto-heading" number="04" title="Contacto" /></div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <p className="eyebrow text-stone m-0 lg:col-span-5">{profile.location} · {profile.availability}</p>
            <ul className="list-none p-0 m-0 border-t border-hairline lg:col-span-7">
              {contacts.map(link => (
                <li key={link.label} className="border-b border-hairline">
                  <a
                    href={link.href}
                    {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    className="group flex items-baseline justify-between gap-4 py-5"
                  >
                    <span className="eyebrow text-ash">{link.label}</span>
                    <span className="text-ink text-[15px] break-all text-right group-hover:text-clay transition-colors duration-150">
                      {link.value} <span aria-hidden="true">→</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>

      <footer className="border-t border-hairline">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6">
          <p className="eyebrow text-ash m-0">&copy; {new Date().getFullYear()} {profile.name}</p>
        </div>
      </footer>
    </div>
  );
};

export default UgcPage;
