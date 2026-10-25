export type InstagramKind = 'p' | 'reel' | 'tv';

export interface InstagramPost {
  kind: InstagramKind;
  shortcode: string;
  /** Canonical form Instagram's embed script expects. */
  permalink: string;
}

const HOSTS = new Set(['instagram.com', 'www.instagram.com', 'm.instagram.com']);
// Optional username segment, as in links copied from a profile grid: /user/reel/CODE/
const PATH = /^\/(?:[\w.]+\/)?(p|reel|tv)\/([\w-]+)\/?$/;

export function parseInstagramUrl(input: string): InstagramPost | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  let url: URL;
  try {
    url = new URL(/^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`);
  } catch {
    return null;
  }
  if (!HOSTS.has(url.hostname.toLowerCase())) return null;

  const match = url.pathname.match(PATH);
  if (!match) return null;
  const [, kind, shortcode] = match;
  return {
    kind: kind as InstagramKind,
    shortcode,
    permalink: `https://www.instagram.com/${kind}/${shortcode}/`,
  };
}

/** Parses a list of links, skipping anything that is not a post and repeated posts. */
export function parseInstagramUrls(inputs: string[]): InstagramPost[] {
  const seen = new Set<string>();
  const posts: InstagramPost[] = [];
  for (const input of inputs) {
    const post = parseInstagramUrl(input);
    if (post && !seen.has(post.shortcode)) {
      seen.add(post.shortcode);
      posts.push(post);
    }
  }
  return posts;
}

/** Grid for the embeds: as many columns as posts (up to three), centred, never an empty column.
 *  Each embed is capped at 420px so a vertical reel and its likes fit on a laptop screen. */
export function embedGridClass(count: number): string {
  if (count <= 1) return 'grid-cols-1 max-w-[420px] mx-auto';
  // Two embeds at their maximum width plus the 24px gap.
  if (count === 2) return 'grid-cols-1 md:grid-cols-2 max-w-[864px] mx-auto';
  return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
}

/** Instagram's own embed page for a post; the same URL its embed.js script would insert. */
export function embedUrl(post: InstagramPost): string {
  return `${post.permalink}embed/`;
}

const MAX_EMBED_HEIGHT = 3000;

/**
 * The embed page posts `{"type":"MEASURE","details":{"height":N}}` (as a JSON string) to its
 * parent once it has laid out. Returns that height, or null for any other message.
 */
export function parseMeasureMessage(data: unknown): number | null {
  if (typeof data !== 'string') return null;
  try {
    const message: unknown = JSON.parse(data);
    if (typeof message !== 'object' || message === null) return null;
    const { type, details } = message as { type?: unknown; details?: { height?: unknown } };
    const height = details?.height;
    if (type !== 'MEASURE' || typeof height !== 'number') return null;
    return height > 0 && height <= MAX_EMBED_HEIGHT ? Math.round(height) : null;
  } catch {
    return null;
  }
}
