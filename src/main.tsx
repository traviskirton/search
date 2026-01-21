import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { MantineProvider, createTheme } from '@mantine/core'
import App from './App.tsx'
import Components from './Components.tsx'
import { theme as baseTheme } from '../theme/dist/mantine'
import '@mantine/core/styles.css'
import './global.css'

const theme = createTheme({
  ...baseTheme,
  components: {
    Button: {
      defaultProps: {
        fz: 'md',
      },
      styles: () => ({
        root: {
          fontWeight: baseTheme.fontWeights?.medium,
          letterSpacing: baseTheme.letterSpacing?.small,
        },
      }),
    },
    Text: {
      defaultProps: {
        fz: 'md',
      },
      styles: () => ({
        root: {
          fontWeight: baseTheme.fontWeights?.medium,
          letterSpacing: baseTheme.letterSpacing?.small,
        },
      }),
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MantineProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/components" element={<Components />} />
        </Routes>
      </BrowserRouter>
    </MantineProvider>
  </React.StrictMode>,
)
