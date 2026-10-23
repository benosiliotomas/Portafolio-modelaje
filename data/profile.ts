import { ageOn, cmToInches, metersToFeetInches } from '../lib/photoUtils';

export interface Measurement {
  label: string;
  value: string;
  /** Imperial equivalent for international clients. */
  imperial?: string;
}

const BIRTH_DATE = new Date(2006, 10, 6);
const HEIGHT_M = 1.85;
const CHEST_CM = 92;
const WAIST_CM = 75;
const HIPS_CM = 97;

export const profile = {
  name: 'Tomás Benosilio',
  role: 'Modelo',
  location: 'Mar del Plata',
  availability: 'Disponible en Buenos Aires',
  email: 'benosiliotomas@gmail.com',
  phoneDisplay: '+54 9 223 635 2632',
  phoneE164: '+5492236352632',
  whatsappMessage: 'Hola Tomás, vi tu portfolio y quería consultarte por un trabajo.',
  // Set the handle (without @) to show the Instagram link in Contacto.
  instagram: null as string | null,
};

export const whatsappUrl = `https://wa.me/${profile.phoneE164.replace('+', '')}?text=${encodeURIComponent(profile.whatsappMessage)}`;

export const getMeasurements = (today: Date = new Date()): Measurement[] => [
  { label: 'Altura', value: `${HEIGHT_M.toFixed(2).replace('.', ',')} m`, imperial: metersToFeetInches(HEIGHT_M) },
  { label: 'Edad', value: `${ageOn(BIRTH_DATE, today)}` },
  { label: 'Pecho', value: `${CHEST_CM} cm`, imperial: cmToInches(CHEST_CM) },
  { label: 'Cintura', value: `${WAIST_CM} cm`, imperial: cmToInches(WAIST_CM) },
  { label: 'Cadera', value: `${HIPS_CM} cm`, imperial: cmToInches(HIPS_CM) },
  { label: 'Pantalón', value: '30' },
  { label: 'Remera', value: 'M–L' },
  { label: 'Calzado', value: '43 EU', imperial: '10 US' },
  { label: 'Cabello', value: 'Negro' },
  { label: 'Ojos', value: 'Marrones' },
];

/** Stats shown under the name, in the order bookers scan them. */
export const headlineStats: string[] = [
  `${HEIGHT_M.toFixed(2).replace('.', ',')} m`,
  `Pecho ${CHEST_CM}`,
  `Cintura ${WAIST_CM}`,
  'Calzado 43',
];
