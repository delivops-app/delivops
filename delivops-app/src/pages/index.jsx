import React from 'react';
import { createRoot } from 'react-dom/client';
import { Auth0Provider } from '@auth0/auth0-react';
import App from './App';

const root = createRoot(document.getElementById('root'));

root.render(
<Auth0Provider
    domain="dev-or3c4n80x1rba26g.eu.auth0.com"
    clientId="cOLtyVzQ1bzFMtBXxKwibbM9mECWvSEy"
    authorizationParams={{
      redirect_uri: window.location.origin
    }}
  >
    <App />
  </Auth0Provider>,
);