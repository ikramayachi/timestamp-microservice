// server.js
'use strict';

const express = require('express');
const app = express();
const apiRoutes = require('./routes/api');
const path = require('path');

app.use('/api', apiRoutes);

// Serve index.html (page FCC)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

const PORT = process.env.PORT || 3000;
const listener = app.listen(PORT, () => {
  if (process.env.NODE_ENV !== 'test') {
    console.log('Your app is listening on port ' + listener.address().port);
  }
});

module.exports = app;
