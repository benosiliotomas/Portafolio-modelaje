import React from 'react';
import { profile, whatsappUrl } from '../data/profile';

interface ContactLink {
  label: string;
  value: string;
  href: string;
  external?: boolean;
}

const contactLinks = (): ContactLink[] => [
  { label: 'Email', value: profile.email, href: `mailto:${profile.email}` },
  { label: 'WhatsApp', value: profile.phoneDisplay, href: whatsappUrl, external: true },
  ...(profile.instagram
    ? [{ label: 'Instagram', value: `@${profile.instagram}`, href: `https://instagram.com/${profile.instagram}`, external: true }]
    : []),
];

const Contact: React.FC = () => (
  <section aria-labelledby="contacto-heading" className="fade-in max-w-4xl mx-auto px-4 sm:px-8 py-[var(--space-section)]">
    <h2 id="contacto-heading" className="text-4xl sm:text-5xl text-ink mt-0 mb-4">Contacto</h2>
    <p className="eyebrow text-stone mt-0 mb-12">{profile.location} · {profile.availability}</p>

    <ul className="list-none p-0 m-0 border-t border-hairline">
      {contactLinks().map(link => (
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
  </section>
);

export default Contact;
