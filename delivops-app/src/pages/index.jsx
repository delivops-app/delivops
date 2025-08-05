import React from 'react';
import { createRoot } from 'react-dom/client';
import { Auth0Provider } from '@auth0/auth0-react';
import App from './App';

const root = createRoot(document.getElementById('root'));

root.render(
<Auth0Provider
    domain="login.delivops.app"
    clientId="cOLtyVzQ1bzFMtBXxKwibbM9mECWvSEy"
    authorizationParams={{
      redirect_uri: window.location.origin + "/callback"
    }}
  >
    <App />
  </Auth0Provider>,
);