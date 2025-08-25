// index.js
require('dotenv').config();
var express = require('express');
var app = express();
var cors = require('cors');
const bodyParser = require('body-parser');
const dns = require('dns');
const urlParser = require('url');

// Middleware
app.use(cors({ optionsSuccessStatus: 200 }));
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));

// Page d'accueil
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

// Exemple fourni
app.get('/api/hello', function (req, res) {
  res.json({ greeting: 'hello API' });
});

// -----------------------------
// URL Shortener Microservice
// -----------------------------
let urlDatabase = {};
let counter = 1;

// POST pour raccourcir l’URL
app.post('/api/shorturl', (req, res) => {
  const originalUrl = req.body.url;
  const parsedUrl = urlParser.parse(originalUrl);

  if (!parsedUrl.protocol || !parsedUrl.hostname) {
    return res.json({ error: 'invalid url' });
  }

  dns.lookup(parsedUrl.hostname, (err) => {
    if (err) {
      return res.json({ error: 'invalid url' });
    }

    const shortUrl = counter++;
    urlDatabase[shortUrl] = originalUrl;

    res.json({
      original_url: originalUrl,
      short_url: shortUrl,
    });
  });
});

// GET pour rediriger
app.get('/api/shorturl/:short_url', (req, res) => {
  const shortUrl = req.params.short_url;
  const originalUrl = urlDatabase[shortUrl];

  if (originalUrl) {
    res.redirect(originalUrl);
  } else {
    res.json({ error: 'No short URL found' });
  }
});

// Listen
var listener = app.listen(process.env.PORT || 3000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
