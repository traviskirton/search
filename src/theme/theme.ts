// Mantine theme for Search — Control Surface (Slate).
// Semantic values (surfaces, ink, depth) live in tokens.css, for light and dark;
// this file maps Mantine onto them and keeps the custom scales the app uses.
import { ActionIcon, Button, Input, createTheme, type MantineColorsTuple } from '@mantine/core'
import controls from './controls.module.css'

const signal: MantineColorsTuple = [
  '#fffbe6', '#fff4bf', '#feec94', '#fbe36a', '#f9dc55',
  '#f7d84a', '#d6b928', '#b09a24', '#8a781c', '#665913',
]

// Light-mode neutrals, light → dark
const slate: MantineColorsTuple = [
  '#f0f2f5', '#e3e6eb', '#d7dbe1', '#ccd1d8', '#c9ced6',
  '#b5bcc6', '#8f98a6', '#5f6773', '#363d47', '#161a20',
]

// Mantine dark scale: [0] text … [7] body bg
const dark: MantineColorsTuple = [
  '#e6eaf0', '#c3c9d3', '#8f98a6', '#5f6773', '#313744',
  '#2d323b', '#222730', '#14171c', '#0f1115', '#090b0e',
]

const include: MantineColorsTuple = [
  '#e6f6f1', '#cdebe3', '#9fdccb', '#6fe2c0', '#3cd3a7',
  '#1bb48b', '#0f9e7a', '#0a7a5e', '#075c47', '#043d2f',
]

const exclude: MantineColorsTuple = [
  '#fdeef1', '#f7d2d9', '#f2a9b5', '#ff8695', '#ff5a6f',
  '#ea4359', '#e2364c', '#b8233a', '#8c1a2c', '#5e111e',
]

const sans = "'Chivo', system-ui, -apple-system, sans-serif"
const mono = "'Chivo Mono', ui-monospace, monospace"

export const theme = createTheme({
  primaryColor: 'signal',
  primaryShade: { light: 5, dark: 5 },
  autoContrast: true,
  colors: { signal, slate, dark, include, exclude },
  white: '#f0f2f5',
  black: '#161a20',

  fontFamily: sans,
  fontFamilyMonospace: mono,

  headings: {
    fontFamily: sans,
    fontWeight: '700',
    sizes: {
      h1: { fontSize: '34px', lineHeight: '1.2', fontWeight: '800' },
      h2: { fontSize: '26px', lineHeight: '1.3', fontWeight: '700' },
      h3: { fontSize: '22px', lineHeight: '1.35', fontWeight: '700' },
      h4: { fontSize: '18px', lineHeight: '1.4', fontWeight: '700' },
      h5: { fontSize: '16px', lineHeight: '1.5', fontWeight: '700' },
      h6: { fontSize: '14px', lineHeight: '1.5', fontWeight: '700' },
    },
  },

  spacing: {
    none: '0px',
    hair: '1px',
    xxxs: '2px',
    xxs: '4px',
    xs: '8px',
    sm: '12px',
    md: '16px',
    lg: '20px',
    xl: '24px',
    xxl: '32px',
    xxxl: '64px',
  },

  defaultRadius: 'md',
  radius: {
    xs: '4px',   // badges
    sm: '6px',   // small buttons, icon tiles
    md: '8px',   // keys, chips
    lg: '12px',  // panels, cards
    xl: '14px',
  },

  shadows: {
    xs: 'var(--sc-key-sm)',
    sm: 'var(--sc-key)',
    md: 'var(--sc-card)',
    lg: 'var(--sc-card-hover)',
    xl: 'var(--sc-menu)',
  },

  fontSizes: {
    xs: '10px',
    sm: '12px',
    md: '14px',
    lg: '16px',
    xl: '18px',
  },

  lineHeights: {
    xs: '1.4',
    sm: '1.45',
    md: '1.5',
    lg: '1.55',
    xl: '1.6',
  },

  breakpoints: {
    xs: '25.75em',   // 412px
    sm: '35.125em',  // 562px
    md: '48em',      // 768px
    lg: '64em',      // 1024px
    xl: '83.75em',   // 1340px
  },

  letterSpacing: {
    none: '0',
    xsmall: '0.06em',  // tabs, sort
    small: '0.08em',   // type labels
    medium: '0.1em',   // badges
    large: '0.14em',   // section labels
  },

  iconSizes: {
    xxsmall: '8px',
    xsmall: '12px',
    small: '16px',
    medium: '24px',
    large: '32px',
    xlarge: '40px',
    xxlarge: '64px',
  },

  fontWeights: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },

  fontFamilies: { sans, mono },

  borderWidths: {
    xsmall: '1px',
    small: '2px',
    medium: '4px',
    large: '8px',
    xlarge: '16px',
  },

  components: {
    Card: { defaultProps: { shadow: 'md', radius: 'lg', withBorder: false } },
    Paper: { defaultProps: { shadow: 'md', radius: 'lg', withBorder: false } },
    Menu: { defaultProps: { shadow: 'xl', radius: 'md' } },
    Popover: { defaultProps: { shadow: 'xl', radius: 'md' } },
    Loader: { defaultProps: { color: 'var(--sc-muted)', type: 'dots' } },
    // Custom variants 'key' | 'latched' | 'accent' | 'danger' (see controls.module.css)
    Button: Button.extend({
      defaultProps: { fz: 'md' },
      classNames: { root: controls.control },
      styles: { root: { fontWeight: 500 } },
    }),
    Text: { defaultProps: { fz: 'md' } },
    ActionIcon: ActionIcon.extend({ classNames: { root: controls.control } }),
    Input: Input.extend({ classNames: { input: controls.well } }),
  },
})

export default theme
