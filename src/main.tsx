import React, { lazy, Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { MantineProvider } from '@mantine/core'
import { IconContext } from '@phosphor-icons/react'
import '@mantine/core/styles.css'
import './theme/tokens.css'
import './global.css'
import App from './App.tsx'
import { theme } from './theme/theme'

// The components gallery is for development only. Its chat demo calls OpenAI
// from the browser, so it must never ship in a deployed build
const Components = import.meta.env.DEV ? lazy(() => import('./Components.tsx')) : null

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MantineProvider theme={theme} defaultColorScheme="auto">
      <IconContext.Provider value={{ weight: 'bold' }}>
        <BrowserRouter basename={import.meta.env.BASE_URL}>
          <Routes>
            <Route path="/" element={<App />} />
            {Components && (
              <Route
                path="/components"
                element={
                  <Suspense>
                    <Components />
                  </Suspense>
                }
              />
            )}
          </Routes>
        </BrowserRouter>
      </IconContext.Provider>
    </MantineProvider>
  </React.StrictMode>,
)
