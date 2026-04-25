const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Authentication middleware
function requireAuth(req, res, next) {
  const authCookie = req.cookies.auth;
  if (authCookie === 'authenticated') {
    next();
  } else {
    res.redirect('/login');
  }
}

// Routes
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.post('/login', (req, res) => {
  const { password } = req.body;
  if (password === process.env.PASSWORD) {
    res.cookie('auth', 'authenticated', { maxAge: 24 * 60 * 60 * 1000 }); // 1 day
    res.redirect('/');
  } else {
    res.send('Invalid password. <a href="/login">Try again</a>');
  }
});

app.get('/logout', (req, res) => {
  res.clearCookie('auth');
  res.redirect('/login');
});

// Protect all other routes
app.get('/', requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Catch all other routes and protect them
app.get('*', requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', req.path));
});

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});