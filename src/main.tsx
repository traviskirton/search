import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { MantineProvider } from '@mantine/core'
import { IconContext } from '@phosphor-icons/react'
import '@mantine/core/styles.css'
import './theme/tokens.css'
import './global.css'
import App from './App.tsx'
import Components from './Components.tsx'
import { theme } from './theme/theme'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MantineProvider theme={theme} defaultColorScheme="auto">
      <IconContext.Provider value={{ weight: 'bold' }}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/components" element={<Components />} />
          </Routes>
        </BrowserRouter>
      </IconContext.Provider>
    </MantineProvider>
  </React.StrictMode>,
)
