// server.js (example)
const express = require('express');
const app = express();
const routes = require('./routes/api');

app.use('/api', routes);

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});

module.exports = app; // export app for tests (chai-http)
