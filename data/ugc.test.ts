import { describe, it, expect } from 'vitest';
import { ugcMailto } from './ugc';

describe('ugcMailto', () => {
  it('pre-fills the subject line', () => {
    expect(ugcMailto('a@b.com')).toBe('mailto:a@b.com?subject=Consulta%20de%20contenido');
  });
});
