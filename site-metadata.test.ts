import { readFileSync } from 'node:fs';
import { describe, it, expect } from 'vitest';
import { profile } from './data/profile';
import { MODEL_NAME } from './lib/photoUtils';

const read = (file: string): string => readFileSync(new URL(file, import.meta.url), 'utf8');
const home = read('./index.html');
const contenido = read('./contenido.html');

const personSchema = (): Record<string, unknown> => {
  const block = home.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  if (!block) throw new Error('Missing JSON-LD block');
  return JSON.parse(block[1]);
};

describe('how the site names Tomas for search engines', () => {
  it('spells the name without an accent everywhere, the way people search it', () => {
    expect(profile.name).toBe('Tomas Benosilio');
    expect(MODEL_NAME).toBe('Tomas Benosilio');
    expect(home).not.toContain('Tomás Benosilio');
    expect(contenido).not.toContain('Tomás Benosilio');
  });

  it('leads the home title with the name and role', () => {
    expect(home).toContain('<title>Tomas Benosilio - Modelo &amp; Creador UGC · Buenos Aires</title>');
  });

  it('describes the same person and occupations in the structured data', () => {
    const person = personSchema();
    expect(person['@type']).toBe('Person');
    expect(person.name).toBe('Tomas Benosilio');
    expect(person.jobTitle).toEqual(['Modelo', 'Creador UGC', 'Creador de contenido']);
    expect(person.sameAs).toEqual([
      'https://www.instagram.com/benosiliotomas/',
      'https://www.tiktok.com/@tomasbenosilio',
    ]);
  });

  it('keeps the role line used by the heading and the about section', () => {
    expect(`${profile.name} - ${profile.role}`).toBe('Tomas Benosilio - Modelo & Creador UGC');
  });
});
