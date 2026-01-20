import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { MantineProvider } from '@mantine/core'
import App from './App.tsx'
import Components from './Components.tsx'
import { theme } from '../theme/dist/mantine'
import '@mantine/core/styles.css'
import './global.css'

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
