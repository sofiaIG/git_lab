const express = require('express');
const app = express();
const cors = require('cors');
const createRouter = require('./helpers/create_router');

const teas = [
  { name: "Early Grey", brand: "Twinings" },
  { name: "Irish Breakfast", brand: "Barry's Tea" },
  { name: "Lemon and Ginger", brand: "Lipton" },
  { name: "Rooibos", brand: "Tick Tock" },
  { name: "Green", brand: "Clipper" }
];

app.use(cors());
app.use( express.json() );

const teasRouter = createRouter(teas);
app.use( '/api/teas', teasRouter );

const biscuitsRouter = createRouter(biscuits);
app.use( '/api/biscuits', Router );
// /api/teas Index (GET)
// app.get( '/api/teas', (req, res) => {
//   res.json(teas);
// })

// // /api/teas/:id Show (GET)
// app.get('/api/teas/:id', (req, res) => {
//   res.json( teas[req.params.id] )
// })

// // /api/teas Create (POST)
// app.post( '/api/teas', (req, res) => {
//   teas.push(req.body);
//   res.json(teas);
// })

// // /api/teas/:id Destroy (DELETE)
// app.delete( '/api/teas/:id', (req, res) => {
//   teas.splice(req.params.id, 1);
//   res.json(teas);
// })


// // /api/teas/:id Update (PUT)
// app.put( '/api/teas/:id', (req, res) => {
//   teas[req.params.id] = req.body;
//   res.json(teas);
// }) 

// app.listen(5000, function () {
//   console.log(`App running on port ${ this.address().port }`);
// });