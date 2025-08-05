# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Configuration Auth0

1. Dans le tableau de bord Auth0, ajouter `http://localhost:5173/callback` dans **Allowed Callback URLs** et `http://localhost:5173` dans **Allowed Logout URLs**.
2. Créer un fichier `.env` à partir de `.env.example` avec les variables suivantes :

   ```bash
   VITE_AUTH0_DOMAIN=...
   VITE_AUTH0_CLIENT_ID=...
   ```

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
