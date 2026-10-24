import { parseInstagramUrl } from './instagram';

/** Result of reading the saved list of Instagram posts (Firestore document content/instagram). */
export type SavedPosts =
  | { status: 'saved'; posts: string[] }
  | { status: 'missing' }
  | { status: 'error' };

export interface AddResult {
  list: string[];
  error?: string;
}

/** Validates a pasted link and adds its clean permalink, or explains why it was not added. */
export function addPost(list: string[], input: string, position: 'top' | 'bottom' = 'bottom'): AddResult {
  const post = parseInstagramUrl(input);
  if (!post) return { list, error: 'Ese link no es un posteo, reel o video de Instagram.' };
  if (list.some(existing => parseInstagramUrl(existing)?.shortcode === post.shortcode)) {
    return { list, error: 'Ese posteo ya está en la lista.' };
  }
  return { list: position === 'top' ? [post.permalink, ...list] : [...list, post.permalink] };
}

export function movePost(list: string[], index: number, direction: -1 | 1): string[] {
  const target = index + direction;
  if (index < 0 || index >= list.length || target < 0 || target >= list.length) return list;
  const next = [...list];
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}

export function removePost(list: string[], index: number): string[] {
  return list.filter((_, i) => i !== index);
}

/**
 * Which links the public page shows. Until the admin saves for the first time the document
 * does not exist and the defaults from data/ugc.ts are used; after that the saved list wins,
 * even if it is empty. A failed read shows nothing rather than a possibly outdated list.
 */
export function resolvePostLinks(saved: SavedPosts, defaults: string[]): string[] {
  if (saved.status === 'saved') return saved.posts;
  if (saved.status === 'missing') return defaults;
  return [];
}
