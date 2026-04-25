# Recipe Web App

A simple recipe blog with cookie-based password authentication.

## Setup

1. Install Node.js (if not already installed).
2. Run `npm install` to install dependencies.
3. Create a `.env` file in the root directory with `PASSWORD=your_secure_password`.
4. Run `npm start` to start the server.

The server will run on http://localhost:3000.

## Authentication

- Visit the site, you'll be redirected to /login.
- Enter the password from the `.env` file.
- After login, you can access all pages.
- Click "Logga ut" to logout.

## Notes

- The password is stored in an environment variable for security.
- Do not commit the `.env` file to version control.