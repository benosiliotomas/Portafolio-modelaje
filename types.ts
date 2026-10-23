export interface PhotoVariant {
  width: number;
  url: string;
}

export type PhotoSection = 'book' | 'digitals';

export interface Photo {
  id: string;
  /** Largest optimized variant, or the original upload for photos not yet optimized. */
  url: string;
  alt: string;
  /** Caption shown in the viewer: show, brand, photographer. */
  concept?: string;
  order: number;
  variants?: PhotoVariant[];
  width?: number;
  height?: number;
  hidden?: boolean;
  /** Missing on photos uploaded before sections existed; see getSection(). */
  section?: PhotoSection;
  /** The single photo used as the home page cover and comp card front. */
  featured?: boolean;
}
