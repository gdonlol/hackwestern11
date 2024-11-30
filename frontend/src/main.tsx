import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from "react-router-dom";
import { Auth0Provider } from '@auth0/auth0-react';


createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Auth0Provider
      domain="dev-y3z8jvples0v2xmc.us.auth0.com"
      clientId="FKF49MUJgYdPbIhb7JmIYAMj4NkYBL7F"
      authorizationParams={{
        redirect_uri: window.location.origin
      }}
    >
      <App />
    </Auth0Provider>
  </BrowserRouter>,
)
