
export interface Photo {
  id: string;
  url: string;
  alt: string;
  concept?: string;
  order: number;
}

export type AspectRatio = "1:1" | "16:9" | "9:16" | "4:3" | "3:4";