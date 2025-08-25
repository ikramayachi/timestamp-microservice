// server.js
'use strict';

const express = require('express');
const app = express();
const apiRoutes = require('./routes/api');

app.use('/api', apiRoutes);

// basic index to satisfy the FCC project page
app.get('/', (req, res) => {
  res.sendFile(process.cwd() + '/views/index.html');
});

const PORT = process.env.PORT || 3000;
const listener = app.listen(PORT, () => {
  if (process.env.NODE_ENV !== 'test') {
    console.log('Your app is listening on port ' + listener.address().port);
  }
});

module.exports = app;
