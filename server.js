const express = require('express');

const app = express();
const bodyParser = require('body-parser');
const path = require('path');

const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const db = require('knex')(configuration);
const cors = require('express-cors');

app.locals.title = 'Teams';

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, PATCH');
  next();
});

app.set('port', process.env.PORT || 3001);

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});

app.get('/api/v1/users', (request, response) =>
  db('users')
    .select()
    .then(users => response.status(200).json(users))
    .catch(error => response.status(500).json({ error }))
);

app.get('/api/v1/users/:username/:password', (request, response) => {
  const { username, password } = request.params;
  const user = { username, password };
  db('users')
    .where(user)
    .select()
    .then(
      user =>
        !user.length
          ? response.status(404).json({ error: 'Username does not exist' })
          : response.status(200).json(user[0])
    );
});

app.get('/api/v1/teams', (request, response) => {
  db('teams')
    .select()
    .then(teams => response.status(200).json(teams))
    .catch(error => response.status(500).json({ error }));
});

app.get('/api/v1/teams/:user_id', (request, response) => {
  const { user_id } = request.params;
  db('teams')
    .where('user_id', user_id)
    .select()
    .then(
      teams =>
        !teams.length
          ? response
              .status(404)
              .json({ error: 'No teams found for given user_id' })
          : response.status(200).json(teams)
    );
});

app.post('/api/v1/users', (request, response) => {
  const requiredKeys = ['username', 'password'];

  for (const keys of requiredKeys) {
    if (!request.body[keys]) {
      return response.status(400).json({ error: `Missing key: ${keys}` });
    }
  }
  db('users')
    .insert(request.body, '*')
    .then(user => response.status(201).json(user[0]))
    .catch(error => response.status(500).json({ error }));
});

app.post('/api/v1/teams', (request, response) => {
  const requiredKeys = [
    'team_name',
    'user_id',
    'player_1',
    'player_2',
    'player_3',
    'player_4',
    'player_5'
  ];

  for (const keys of requiredKeys) {
    if (!request.body[keys]) {
      return response.status(400).json({ error: `Missing key: ${keys}` });
    }
  }
  db('teams')
    .insert(request.body, '*')
    .then(team => response.status(201).json(team[0]))
    .catch(error => response.status(500).json({ error }));
});

module.exports = app;
