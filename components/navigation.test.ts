import { describe, it, expect } from 'vitest';
import { siteNav } from './navigation';

describe('siteNav', () => {
  it('uses in-page anchors on the portfolio and a separate page for UGC', () => {
    const items = siteNav(true);
    expect(items.map(i => i.href ?? `#${i.id}`)).toEqual(['#book', '#digitals', '#medidas', '#contacto', '/ugc']);
    expect(items.at(-1)?.isPage).toBe(true);
  });

  it('points sections back to the portfolio from other pages', () => {
    expect(siteNav(false).map(i => i.href)).toEqual(['/#book', '/#digitals', '/#medidas', '/#contacto', '/ugc']);
  });
});
