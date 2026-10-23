export interface PhotoVariant {
  width: number;
  url: string;
}

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
}
