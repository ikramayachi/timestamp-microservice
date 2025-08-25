require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const app = express();

// Middleware
app.use(cors({ optionsSuccessStatus: 200 }));
app.use(express.static('public'));

// Route homepage
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

// Configuration Multer
const upload = multer({ dest: 'uploads/' }); // fichiers stockés dans uploads/

// Endpoint pour le fichier
app.post('/api/fileanalyse', upload.single('upfile'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  res.json({
    name: req.file.originalname,
    type: req.file.mimetype,
    size: req.file.size
  });
});

// Optionnel : test simple API
app.get('/api/hello', (req, res) => {
  res.json({ greeting: 'hello API' });
});

// Lancer serveur
const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});
