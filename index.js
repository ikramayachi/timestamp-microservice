require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express(); // ✅ à définir avant les routes

app.use(cors({ optionsSuccessStatus: 200 }));
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// route home
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

// test API
app.get('/api/hello', (req, res) => {
  res.json({ greeting: 'hello API' });
});

// ---------------------------
// ici ton code avec `users`
// ---------------------------
const users = [];
let idCounter = 1;

app.post("/api/users", (req, res) => {
  const username = req.body.username;
  const user = { username, _id: idCounter.toString(), log: [] };
  users.push(user);
  idCounter++;
  res.json({ username: user.username, _id: user._id });
});

app.get("/api/users", (req, res) => {
  res.json(users.map(u => ({ username: u.username, _id: u._id })));
});

app.post("/api/users/:_id/exercises", (req, res) => {
  const user = users.find(u => u._id === req.params._id);
  if (!user) return res.status(404).json({ error: "User not found" });

  const { description, duration, date } = req.body;
  const exercise = {
    description,
    duration: parseInt(duration),
    date: date ? new Date(date).toDateString() : new Date().toDateString()
  };
  user.log.push(exercise);

  res.json({
    username: user.username,
    _id: user._id,
    description: exercise.description,
    duration: exercise.duration,
    date: exercise.date
  });
});

app.get("/api/users/:_id/logs", (req, res) => {
  const user = users.find(u => u._id === req.params._id);
  if (!user) return res.status(404).json({ error: "User not found" });

  let log = [...user.log];

  const { from, to, limit } = req.query;
  if (from) log = log.filter(e => new Date(e.date) >= new Date(from));
  if (to) log = log.filter(e => new Date(e.date) <= new Date(to));
  if (limit) log = log.slice(0, parseInt(limit));

  res.json({
    username: user.username,
    _id: user._id,
    count: log.length,
    log
  });
});

// ---------------------------
// démarrer le serveur
// ---------------------------
const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});
