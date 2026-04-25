# Recipe Web App

A Svelte recipe blog with client-side authentication.

## Setup

1. Install Node.js (if not already installed).
2. Run `npm install` to install dependencies.
3. Run `npm run dev` to start the development server.

The site will run on `http://localhost:5173` by default.

## Authentication

- The app shows a login screen on load.
- Enter the password `securepassword123`.
- After login, you can view the recipes and recipe detail.
- Click "Logga ut" to logout.

## Deployment

This is a static Svelte app and can be deployed to Vercel as a static site.

## Notes

- Client-side password protection is not secure for sensitive data.
- For a production app, add a proper server-side authentication backend.
