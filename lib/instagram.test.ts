import { describe, it, expect } from 'vitest';
import { parseInstagramUrl, parseInstagramUrls, embedGridClass, embedUrl, parseMeasureMessage } from './instagram';

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

describe('embedGridClass', () => {
  it('never leaves empty columns for one or two posts', () => {
    expect(embedGridClass(1)).toBe('grid-cols-1 max-w-[420px] mx-auto');
    expect(embedGridClass(2)).toBe('grid-cols-1 md:grid-cols-2 max-w-[864px] mx-auto');
  });

  it('uses three columns on desktop from three posts on', () => {
    expect(embedGridClass(3)).toBe('grid-cols-1 md:grid-cols-2 lg:grid-cols-3');
    expect(embedGridClass(7)).toBe('grid-cols-1 md:grid-cols-2 lg:grid-cols-3');
  });
});

describe('embedUrl', () => {
  it('points at Instagram\'s embed page for the post', () => {
    expect(embedUrl({ kind: 'reel', shortcode: 'AAA', permalink: 'https://www.instagram.com/reel/AAA/' }))
      .toBe('https://www.instagram.com/reel/AAA/embed/');
  });
});

describe('parseMeasureMessage', () => {
  it('reads the height Instagram reports for its embed', () => {
    expect(parseMeasureMessage('{"details":{"height":709},"type":"MEASURE"}')).toBe(709);
  });

  it('ignores other messages and malformed data', () => {
    expect(parseMeasureMessage('{"details":{},"type":"LOADING"}')).toBeNull();
    expect(parseMeasureMessage('not json')).toBeNull();
    expect(parseMeasureMessage({ type: 'MEASURE', details: { height: 500 } })).toBeNull();
  });

  it('rejects implausible heights', () => {
    expect(parseMeasureMessage('{"details":{"height":-5},"type":"MEASURE"}')).toBeNull();
    expect(parseMeasureMessage('{"details":{"height":99999},"type":"MEASURE"}')).toBeNull();
    expect(parseMeasureMessage('{"details":{"height":"709"},"type":"MEASURE"}')).toBeNull();
  });
});
