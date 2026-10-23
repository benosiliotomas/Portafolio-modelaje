import React from 'react';
import { SectionHeading } from './BookSection';
import { profile, whatsappUrl, COMP_CARD_URL } from '../data/profile';

interface ContactLink {
  label: string;
  value: string;
  href: string;
  external?: boolean;
  download?: boolean;
}

const contactLinks = (): ContactLink[] => [
  { label: 'Email', value: profile.email, href: `mailto:${profile.email}` },
  { label: 'WhatsApp', value: profile.phoneDisplay, href: whatsappUrl, external: true },
  ...(profile.instagram
    ? [{ label: 'Instagram', value: `@${profile.instagram}`, href: `https://instagram.com/${profile.instagram}`, external: true }]
    : []),
  { label: 'Comp card', value: 'Descargar PDF', href: COMP_CARD_URL, download: true },
];

const Contact: React.FC = () => (
  <section id="contacto" aria-labelledby="contacto-heading" className="max-w-7xl mx-auto px-4 sm:px-8 py-[var(--space-section)] scroll-mt-14">
    <div className="-mx-4 sm:mx-0">
      <SectionHeading id="contacto-heading" number="04" title="Contacto" />
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <p className="eyebrow text-stone m-0 lg:col-span-5">{profile.location} · {profile.availability}</p>
      <ul className="list-none p-0 m-0 border-t border-hairline lg:col-span-7">
        {contactLinks().map(link => (
          <li key={link.label} className="border-b border-hairline">
            <a
              href={link.href}
              {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              {...(link.download ? { download: '' } : {})}
              className="group flex items-baseline justify-between gap-4 py-5"
            >
              <span className="eyebrow text-ash">{link.label}</span>
              <span className="text-ink text-[15px] break-all text-right group-hover:text-clay transition-colors duration-150">
                {link.value} <span aria-hidden="true">{link.download ? '↓' : '→'}</span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  </section>
);

export default Contact;
