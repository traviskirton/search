// Starting point for theme/mantine — replaces the uncommitted theme/dist/mantine.js.
// Semantic values live in tokens.css (light + dark); this file maps Mantine onto them.
import { createTheme, MantineColorsTuple } from '@mantine/core';

const signal: MantineColorsTuple = [
  '#fffbe6', '#fff4bf', '#feec94', '#fbe36a', '#f9dc55',
  '#f7d84a', '#d6b928', '#b09a24', '#8a781c', '#665913',
];

// Light-mode neutrals, light → dark
const slate: MantineColorsTuple = [
  '#f0f2f5', '#e3e6eb', '#d7dbe1', '#ccd1d8', '#c9ced6',
  '#b5bcc6', '#8f98a6', '#5f6773', '#363d47', '#161a20',
];

// Mantine dark scale: [0] text … [7] body bg
const dark: MantineColorsTuple = [
  '#e6eaf0', '#c3c9d3', '#8f98a6', '#5f6773', '#313744',
  '#2d323b', '#222730', '#14171c', '#0f1115', '#090b0e',
];

const include: MantineColorsTuple = [
  '#e6f6f1', '#cdebe3', '#9fdccb', '#6fe2c0', '#3cd3a7',
  '#1bb48b', '#0f9e7a', '#0a7a5e', '#075c47', '#043d2f',
];
const exclude: MantineColorsTuple = [
  '#fdeef1', '#f7d2d9', '#f2a9b5', '#ff8695', '#ff5a6f',
  '#ea4359', '#e2364c', '#b8233a', '#8c1a2c', '#5e111e',
];

export const theme = createTheme({
  primaryColor: 'signal',
  primaryShade: { light: 5, dark: 5 },
  autoContrast: true,
  colors: { signal, slate, dark, include, exclude },
  white: '#f0f2f5',
  black: '#161a20',

  fontFamily: "'Chivo', system-ui, sans-serif",
  fontFamilyMonospace: "'Chivo Mono', ui-monospace, monospace",
  headings: { fontFamily: "'Chivo', system-ui, sans-serif", fontWeight: '700' },

  defaultRadius: 'md',
  radius: { xs: '4px', sm: '6px', md: '8px', lg: '12px', xl: '14px' },

  shadows: {
    xs: 'var(--sc-key-sm)',
    sm: 'var(--sc-key)',
    md: 'var(--sc-card)',
    lg: 'var(--sc-card-hover)',
    xl: 'var(--sc-menu)',
  },

  components: {
    Card: { defaultProps: { shadow: 'md', radius: 'lg', withBorder: false } },
    Paper: { defaultProps: { shadow: 'md', radius: 'lg', withBorder: false } },
    Menu: { defaultProps: { shadow: 'xl', radius: 'md' } },
    Popover: { defaultProps: { shadow: 'xl', radius: 'md' } },
    // Button / ActionIcon get variants 'key' | 'latched' | 'accent' via a CSS module —
    // see README § Mantine mapping.
  },
});
