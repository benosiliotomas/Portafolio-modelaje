import { describe, it, expect } from 'vitest';
import { buildSitemap, buildRobots, absoluteUrl } from './seo';

const SITE = 'https://tomasbenosilio.com';

describe('absoluteUrl', () => {
  it('joins the site and a path without doubling slashes', () => {
    expect(absoluteUrl('https://tomasbenosilio.com/', '/ugc')).toBe('https://tomasbenosilio.com/ugc');
    expect(absoluteUrl(SITE, '/')).toBe('https://tomasbenosilio.com/');
  });
});

describe('buildSitemap', () => {
  it('lists every public page with an absolute URL', () => {
    const xml = buildSitemap(SITE, ['/', '/ugc']);
    expect(xml).toContain('<loc>https://tomasbenosilio.com/</loc>');
    expect(xml).toContain('<loc>https://tomasbenosilio.com/ugc</loc>');
    expect(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true);
  });
});

describe('buildRobots', () => {
  it('keeps the admin out of search results and points to the sitemap', () => {
    const robots = buildRobots(SITE);
    expect(robots).toContain('Disallow: /admin');
    expect(robots).toContain('Sitemap: https://tomasbenosilio.com/sitemap.xml');
  });
});
