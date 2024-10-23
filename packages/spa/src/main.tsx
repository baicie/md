import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from '@baicie/md-core'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
