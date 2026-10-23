import { describe, it, expect } from 'vitest';
import { getMeasurements, headlineStats } from './profile';

const valueOf = (label: string): string => {
  const item = getMeasurements(new Date(2026, 9, 23)).find(m => m.label === label);
  if (!item) throw new Error(`Missing measurement: ${label}`);
  return item.imperial ? `${item.value} · ${item.imperial}` : item.value;
};

describe('measurements', () => {
  it('shows metric values with their imperial equivalents', () => {
    expect(valueOf('Altura')).toBe(`1,83 m · 6'0"`);
    expect(valueOf('Pecho')).toBe('95 cm · 37.5"');
    expect(valueOf('Cintura')).toBe('73 cm · 28.5"');
    expect(valueOf('Cadera')).toBe('95 cm · 37.5"');
  });

  it('keeps the intro line in sync with the measurements page', () => {
    expect(headlineStats).toEqual(['1,83 m', 'Pecho 95', 'Cintura 73', 'Calzado 43']);
  });
});
