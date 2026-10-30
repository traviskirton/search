// Mantine theme for Search — Control Surface (Slate).
// tokens.css holds every design value, for light and dark;
// this file maps Mantine's scales and the app's custom scales onto it.
import { ActionIcon, Button, Input, createTheme, type MantineColorsTuple } from '@mantine/core'
import controls from './controls.module.css'

// Every value is a var() into tokens.css, the single source
const v = (name: string) => `var(--sc-${name})`

// A Mantine colour ramp from a tokens.css palette: ten var(--sc-<name>-N) steps
const ramp = (name: string) =>
  Array.from({ length: 10 }, (_, i) => v(`${name}-${i}`)) as unknown as MantineColorsTuple

const sans = v('font-sans')
const mono = v('font-mono')

const heading = (level: number, weight = 'bold') => ({
  fontSize: v(`h${level}-size`),
  lineHeight: v(`h${level}-line-height`),
  fontWeight: v(`font-weight-${weight}`),
})

export const theme = createTheme({
  primaryColor: 'signal',
  primaryShade: { light: 5, dark: 5 },
  // No autoContrast: it can't read a var() colour, and every control sets its own ink
  colors: {
    signal: ramp('signal'),
    slate: ramp('slate'),
    dark: ramp('dark'),
    include: ramp('include'),
    exclude: ramp('exclude'),
  },
  white: v('slate-0'),
  black: v('slate-9'),

  fontFamily: sans,
  fontFamilyMonospace: mono,

  headings: {
    fontFamily: sans,
    fontWeight: v('font-weight-bold'),
    sizes: {
      h1: heading(1, 'extrabold'),
      h2: heading(2),
      h3: heading(3),
      h4: heading(4),
      h5: heading(5),
      h6: heading(6),
    },
  },

  spacing: {
    none: v('space-none'),
    hair: v('space-hair'),
    xxxs: v('space-xxxs'),
    xxs: v('space-xxs'),
    xs: v('space-xs'),
    sm: v('space-sm'),
    md: v('space-md'),
    lg: v('space-lg'),
    xl: v('space-xl'),
    xxl: v('space-xxl'),
    xxxl: v('space-xxxl'),
  },

  defaultRadius: 'md',
  radius: {
    xs: v('radius-xs'),
    sm: v('radius-sm'),
    md: v('radius-md'),
    lg: v('radius-lg'),
    xl: v('radius-xl'),
  },

  shadows: {
    xs: v('key-sm'),
    sm: v('key'),
    md: v('card'),
    lg: v('card-hover'),
    xl: v('menu'),
  },

  fontSizes: {
    xs: v('font-size-xs'),
    sm: v('font-size-sm'),
    md: v('font-size-md'),
    lg: v('font-size-lg'),
    xl: v('font-size-xl'),
  },

  lineHeights: {
    xs: v('line-height-xs'),
    sm: v('line-height-sm'),
    md: v('line-height-md'),
    lg: v('line-height-lg'),
    xl: v('line-height-xl'),
  },

  // Literal: CSS can't read var() inside @media. The app uses no breakpoints today
  breakpoints: {
    xs: '25.75em',   // 412px
    sm: '35.125em',  // 562px
    md: '48em',      // 768px
    lg: '64em',      // 1024px
    xl: '83.75em',   // 1340px
  },

  letterSpacing: {
    none: v('tracking-none'),
    xsmall: v('tracking-xsmall'),
    small: v('tracking-small'),
    medium: v('tracking-medium'),
    large: v('tracking-large'),
  },

  iconSizes: {
    xxsmall: v('icon-xxsmall'),
    xsmall: v('icon-xsmall'),
    small: v('icon-small'),
    medium: v('icon-medium'),
    large: v('icon-large'),
    xlarge: v('icon-xlarge'),
    xxlarge: v('icon-xxlarge'),
  },

  fontWeights: {
    regular: v('font-weight-regular'),
    medium: v('font-weight-medium'),
    semibold: v('font-weight-semibold'),
    bold: v('font-weight-bold'),
  },

  fontFamilies: { sans, mono },

  borderWidths: {
    xsmall: v('border-xsmall'),
    small: v('border-small'),
    medium: v('border-medium'),
    large: v('border-large'),
    xlarge: v('border-xlarge'),
  },

  components: {
    Card: { defaultProps: { shadow: 'md', radius: 'lg', withBorder: false } },
    Paper: { defaultProps: { shadow: 'md', radius: 'lg', withBorder: false } },
    Menu: { defaultProps: { shadow: 'xl', radius: 'md' } },
    Popover: { defaultProps: { shadow: 'xl', radius: 'md' } },
    Loader: { defaultProps: { color: v('muted'), type: 'dots' } },
    // Custom variants 'key' | 'latched' | 'accent' | 'danger' (see controls.module.css)
    Button: Button.extend({
      defaultProps: { fz: 'md' },
      classNames: { root: controls.control },
      styles: { root: { fontWeight: v('font-weight-medium') } },
    }),
    Text: { defaultProps: { fz: 'md' } },
    ActionIcon: ActionIcon.extend({ classNames: { root: controls.control } }),
    Input: Input.extend({ classNames: { input: controls.well } }),
  },
})

export default theme
