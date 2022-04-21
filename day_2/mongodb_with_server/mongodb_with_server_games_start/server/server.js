const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const createRouter = require('./helpers/create_router');
const cors = require('cors');

app.use(express.json());
app.use(cors());

MongoClient.connect('mongodb://0.0.0.0:27017', {useUnifiedTopology: true})
.then((client) => {
  const db = client.db('games_hub');
  const gamesCollection = db.collection('games');
  const gamesRouter = createRouter(gamesCollection);
  app.use('/api/games', gamesRouter);
})
.catch(console.error)

app.listen(5000, function () {
  console.log(`Listening on port ${ this.address().port }`);
});