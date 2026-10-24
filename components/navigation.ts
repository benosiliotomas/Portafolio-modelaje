import type { NavItem } from './Header';

const SECTIONS: NavItem[] = [
  { id: 'book', label: 'Book', desktopOnly: true },
  { id: 'digitals', label: 'Digitals' },
  { id: 'medidas', label: 'Medidas' },
  { id: 'contacto', label: 'Contacto' },
];

/**
 * The same menu on every page. On the portfolio the sections are in-page anchors;
 * elsewhere they point back to the portfolio (`/#book`). "Contenido" (/contenido) is always its own page.
 */
export function siteNav(onPortfolio: boolean): NavItem[] {
  return [
    ...SECTIONS.map(item => (onPortfolio ? item : { ...item, href: `/#${item.id}` })),
    { id: 'contenido', label: 'Contenido', href: '/contenido', isPage: true },
  ];
}
