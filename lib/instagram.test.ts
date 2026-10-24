import { describe, it, expect } from 'vitest';
import { parseInstagramUrl, parseInstagramUrls } from './instagram';

describe('parseInstagramUrl', () => {
  it('reads a reel link copied from the share button', () => {
    expect(parseInstagramUrl('https://www.instagram.com/reel/DeNkFoFydfE/?igsh=abc123')).toEqual({
      kind: 'reel',
      shortcode: 'DeNkFoFydfE',
      permalink: 'https://www.instagram.com/reel/DeNkFoFydfE/',
    });
  });

  it('reads a post link that includes the username, as profile links do', () => {
    expect(parseInstagramUrl('https://www.instagram.com/benosiliotomas/p/DZIxfsNltzK/')).toEqual({
      kind: 'p',
      shortcode: 'DZIxfsNltzK',
      permalink: 'https://www.instagram.com/p/DZIxfsNltzK/',
    });
  });

  it('accepts links without www, without https or without the trailing slash', () => {
    expect(parseInstagramUrl('instagram.com/p/DVuYFe_jRj0')?.permalink).toBe('https://www.instagram.com/p/DVuYFe_jRj0/');
    expect(parseInstagramUrl('  https://instagram.com/tv/ABC-123_x  ')?.kind).toBe('tv');
  });

  it('rejects profiles, stories and other sites', () => {
    expect(parseInstagramUrl('https://www.instagram.com/benosiliotomas/')).toBeNull();
    expect(parseInstagramUrl('https://www.instagram.com/stories/benosiliotomas/123/')).toBeNull();
    expect(parseInstagramUrl('https://www.tiktok.com/@x/video/123')).toBeNull();
    expect(parseInstagramUrl('https://evil.com/instagram.com/p/ABC/')).toBeNull();
    expect(parseInstagramUrl('')).toBeNull();
  });
});

describe('parseInstagramUrls', () => {
  it('keeps valid posts in order, drops invalid ones and duplicates', () => {
    const posts = parseInstagramUrls([
      'https://www.instagram.com/reel/AAA/',
      'not a url',
      'https://www.instagram.com/benosiliotomas/reel/AAA/?igsh=x',
      'https://www.instagram.com/p/BBB/',
    ]);
    expect(posts.map(p => p.shortcode)).toEqual(['AAA', 'BBB']);
  });
});
