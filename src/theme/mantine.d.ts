// Custom theme properties (see theme.ts)
import '@mantine/core'

declare module '@mantine/core' {
  export interface MantineSpacing {
    none: string
    hair: string
    xxxs: string
    xxs: string
    xxl: string
    xxxl: string
  }

  export interface MantineTheme {
    letterSpacing: {
      none: string
      xsmall: string
      small: string
      medium: string
      large: string
    }
    iconSizes: {
      xxsmall: string
      xsmall: string
      small: string
      medium: string
      large: string
      xlarge: string
      xxlarge: string
    }
    fontWeights: {
      regular: number
      medium: number
      semibold: number
      bold: number
    }
    fontFamilies: {
      sans: string
      mono: string
    }
    borderWidths: {
      xsmall: string
      small: string
      medium: string
      large: string
      xlarge: string
    }
  }
}
