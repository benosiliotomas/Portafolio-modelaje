import { describe, it, expect } from 'vitest';
import { decodeValue, documentToPhoto, documentToSavedPosts } from './firestoreRest';

describe('decodeValue', () => {
  it('decodes scalar values', () => {
    expect(decodeValue({ stringValue: 'hola' })).toBe('hola');
    expect(decodeValue({ integerValue: '12' })).toBe(12);
    expect(decodeValue({ doubleValue: 1.5 })).toBe(1.5);
    expect(decodeValue({ booleanValue: true })).toBe(true);
    expect(decodeValue({ nullValue: null })).toBeNull();
  });

  it('decodes nested arrays of maps', () => {
    const value = {
      arrayValue: {
        values: [{ mapValue: { fields: { width: { integerValue: '480' }, url: { stringValue: 'u' } } } }],
      },
    };
    expect(decodeValue(value)).toEqual([{ width: 480, url: 'u' }]);
  });

  it('treats an empty array as an empty list', () => {
    expect(decodeValue({ arrayValue: {} })).toEqual([]);
  });
});

describe('documentToPhoto', () => {
  it('maps a Firestore document to a Photo using the id from its name', () => {
    const photo = documentToPhoto({
      name: 'projects/p/databases/(default)/documents/photos/abc123',
      fields: {
        url: { stringValue: 'https://x/2000.webp' },
        alt: { stringValue: 'Pasarela' },
        order: { integerValue: '4' },
        hidden: { booleanValue: false },
      },
    });
    expect(photo).toEqual({ id: 'abc123', url: 'https://x/2000.webp', alt: 'Pasarela', order: 4, hidden: false });
  });

  it('rejects documents without a url', () => {
    expect(documentToPhoto({ name: 'x/photos/a', fields: { alt: { stringValue: 'a' } } })).toBeNull();
  });

  it('fills safe defaults for missing alt and order', () => {
    const photo = documentToPhoto({ name: 'x/photos/a', fields: { url: { stringValue: 'u' } } });
    expect(photo).toMatchObject({ alt: '', order: 0 });
  });
});

describe('documentToSavedPosts', () => {
  it('reads the ordered list of links', () => {
    expect(documentToSavedPosts({
      name: 'x/content/instagram',
      fields: { posts: { arrayValue: { values: [{ stringValue: 'a' }, { stringValue: 'b' }] } } },
    })).toEqual({ status: 'saved', posts: ['a', 'b'] });
  });

  it('treats a saved empty list as saved', () => {
    expect(documentToSavedPosts({ name: 'x', fields: { posts: { arrayValue: {} } } })).toEqual({ status: 'saved', posts: [] });
  });

  it('ignores anything in the list that is not a string', () => {
    expect(documentToSavedPosts({
      name: 'x',
      fields: { posts: { arrayValue: { values: [{ stringValue: 'a' }, { integerValue: '3' }] } } },
    })).toEqual({ status: 'saved', posts: ['a'] });
  });
});
