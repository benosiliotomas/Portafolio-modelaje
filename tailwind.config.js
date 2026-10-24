/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './contenido.html',
    './ugc/**/*.tsx',
    './*.tsx',
    './components/**/*.tsx',
    './admin/**/*.tsx',
    // bookTileClass() returns grid classes as strings.
    './lib/**/*.ts',
  ],
  theme: {
    extend: {
      // Values live as CSS custom properties in index.css (see DESIGN.md).
      colors: {
        paper: 'var(--color-paper)',
        surface: 'var(--color-surface)',
        ink: 'var(--color-ink)',
        stone: 'var(--color-stone)',
        ash: 'var(--color-ash)',
        hairline: 'var(--color-hairline)',
        clay: 'var(--color-clay)',
      },
      fontFamily: {
        display: ['"Bodoni Moda"', 'Georgia', 'serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
};
