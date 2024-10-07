import { Auth0Provider } from '@auth0/auth0-react';
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Auth0Provider
      domain="dev-08rd6h45r6eslvu3.us.auth0.com"
      clientId="Ol6dHdL3W5MTPgr05nnQ1e9d7NN0weVy"
      authorizationParams={{
        redirect_uri: window.location.origin
      }}
    >
      <App />
    </Auth0Provider>
  </StrictMode>,
)
