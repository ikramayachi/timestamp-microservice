'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const apiRoutes = require('./routes/api.js');
const fccTestingRoutes = require('./routes/fcctesting.js');
const runner = require('./test-runner');

const app = express();

app.use('/public', express.static(process.cwd() + '/public'));
app.use(cors({origin: '*'}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Index page
app.get('/', (req, res) => res.sendFile(process.cwd() + '/views/index.html'));

// FCC testing routes
fccTestingRoutes(app);

// API routes
apiRoutes(app);

// 404 Middleware
app.use((req, res) => res.status(404).type('text').send('Not Found'));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
  if (process.env.NODE_ENV === 'test') {
    console.log('Running Tests...');
    setTimeout(() => {
      try { runner.run(); } 
      catch(e) { console.log('Tests are not valid:'); console.error(e); }
    }, 1500);
  }
});

module.exports = app;
