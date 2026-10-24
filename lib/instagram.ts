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
