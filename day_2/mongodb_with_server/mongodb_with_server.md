# MongoDB With a Server

### Learning Objectives
- Understand the relationship between a client, server and database
- Be able to connect to a MongoDB database from a server
- Be able to create a JSON API using MongoDB and Express

## Introduction

By creating a RESTful API we are able to create a back-end service for our front-end applications to consume. Following API design principles to implement the CRUD operations, we can ensure that the API is intuitive to use. We have seen how to create a RESTful API using an Express server.

We have also seen how to use a MongoDB database to persist and retrieve non-relational data, using its shell to find and insert JSON documents into collections.

In this lesson we are going to create a RESTful JSON API for a games resource, using an Express server and a MongoDB database. We are going to define a set of routes that implement CRUD functionality and the data being served on the end-points will be retrieved by the server from the database.

## Games Hub Application

This is how the full stack JavaScript application, Games Hub, is structured.

![Diagram of full stack all with server highlighted](images/full_stack.png)

*Games Hub: A full stack JavaScript application*

### Task: (10 minutes)

Run the start code using the instructions in the README.md. From reading any errors that appear in the browser console and from looking at the codebase, identify which functionality of the application hasn't been written yet.

<details>
<summary>Answer</summary>

The server-side application does not implement the routes that the front-end application is making requests to. Also, the server does not connect to a database.

</details>

In this lesson we are going to be working server-side to:
- connect to the `games_hub` database.
- access the `games` collection.
- create the routes for the games resource persisting and retrieving data from the database. We will be using Insomnia REST Client to test each route as we write it.

![Diagram of full stack all with server highlighted](images/full_stack_server.png)

*We will be working server-side to create the API that the front-end consumes*

## MongoDB Driver

Until now we have been interacting with our MongoDB databases using the MongoDB shell, running a file with the command, `mongo < file_name.js`. In order to interact with databases from inside our JavaScript applications, we are going to use the MongoDB Driver's API. The MongoDB Driver is an npm package, so let's start by installing it.

```bash
cd server
npm i mongodb@3.5.7
```
To avoid potential compatibility conflicts, we are going to install here version 3.5.7 of the MongoDB Driver, rather than version 4 and above.

## Connecting to the Database

We want the routing for the games resource to be handled by a games router. Inside server.js we are going to connect to the `games_hub` database, access the `games` collection, and create a games router, passing it an object representing the games collection, so that the games router can interact with the games collection in each of its routes.

Let's start by requiring the MongoDB Driver that we previously installed in server.js, and accessing the MongoClient object.

```js
// server.js

const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient; // NEW
```

We will use MongoClient's `connect` method to connect to the MongoDB server. `connect` takes a URL as an argument. The URL must consist of MongoDB's proprietary access mechanism (rather than HTTP which you will have more commonly seen), the location and the port number. MongoDB server runs on port 27017 by default.

```js
// server.js
app.use(express.json());


MongoClient.connect('mongodb://localhost:27017') // NEW
```
NB: If you have issues connecting to MongoDB try changing locahost above to 127.0.0.1

Also, here we are going to pass in a second argument: { useUnifiedTopology: true }. This is responsible for properly handling server discovery and monitoring.

```js
// server.js
app.use(express.json());


MongoClient.connect('mongodb://localhost:27017', { useUnifiedTopology: true }) // MODIFIED
```

Connecting to the MongoDB server is an asynchronous process and returns a promise. Once the promise has resolved, it will give us a `client` object that we can use to connect to the database. Because we getting a promise back from the `connect` method we will handle it with `then`. I.e, "When the connection to the server has been achieved, `then` give me the `client` object that I can use to connect to the database". If the connection fails, we can use `catch` to log the error.

```js
MongoClient.connect('mongodb://localhost:27017', { useUnifiedTopology: true })
  .then((client) => { // NEW

  })
  .catch(console.error); // NEW
```

> Note: There is only one semi-colon at the end of the expression.

We are going to use the `client` object to connect to the `games_hub` database using the `db` method. We pass `db` the name of the database. Then we can access the `games` collection from the database using the `collection` method passing in the name of the collection.

```js
MongoClient.connect('mongodb://localhost:27017', { useUnifiedTopology: true })
  .then((client) => {
    const db = client.db('games_hub'); // NEW
    const gamesCollection = db.collection('games'); // NEW
  })
  .catch(console.error);
```

We want to delegate the routing for the games resource to a games router. Let's create a requiring createRouter.js.

```js
const MongoClient = require('mongodb').MongoClient;
const createRouter = require('./helpers/create_router.js'); // NEW
```

We are going to create a games router to handle the routing of the games resource. We will pass it the database's `gamesCollection` because (although we haven't written it yet) we know that the games router will need access the games collection in its route definitions.

```js
MongoClient.connect('mongodb://localhost:27017', { useUnifiedTopology: true })
  .then((client) => {
    const db = client.db('games_hub');
    const gamesCollection = db.collection('games');
    const gamesRouter = createRouter(gamesCollection); // NEW
  })
  .catch(console.error);
```

We tell the server we want to delegate the routing to it by the `use` method which takes a path and a router.

```js
MongoClient.connect('mongodb://localhost:27017', { useUnifiedTopology: true })
  .then((client) => {
    const db = client.db('games_hub');
    const gamesCollection = db.collection('games');
    const gamesRouter = createRouter(gamesCollection);
    app.use('/api/games', gamesRouter); // NEW
  })
  .catch(console.error);
```


## Games Router

create_router.js is going to be responsible for handling requests, and interacting with the database's collection to persist and retrieve data. The `createRouter` function already takes in a database collection and creates and exports a router object. Now we can define each of the routes on the router object.

### Index Route

Let's start with the index route. As before we will use the `get` method on the router, pass it a path and a callback that gets passed the request and response objects.

```js
// create_router.js

const createRouter = function (collection) {

  router.get('/', (req, res) => { // NEW

  });

  return router;
};
```

Let's start by checking our route is working by sending back a string.

```js
// helpers/create_router.js

router.get('/', (req, res) => { // NEW
  res.send('Hello World!');
});
```

Now when we visit 'http://localhost:5000/api/games' we see 'Hello World!' displaying on the page.

When there is a request made to this route, we want the all the documents to be retrieved from the games collection in the database and sent back, as JSON, with the response. We have access to the games collection (`collection`), so we can call the `find` method on it to get all the documents back.

```js
// helpers/create_router.js

router.get('/', (req, res) => {
  collection.find() // MODIFIED
});
```

The `find` method returns a cursor object containing the documents. We want an array of documents, so we can convert the cursor into an array, using the `toArray` method.

```js
// helpers/create_router.js

router.get('/', (req, res) => {
  collection.find().toArray() // MODIFIED
});
```

Lastly, because the cursor's `toArray` is asynchronous, it returns a promise. This means we can chain a `then` passing it a callback. When the promise resolves and the array of documents is ready, `then` will pass the array of documents to the callback (`docs`). We serialise the array into JSON and send it back on the response.

```js
// helpers/create_router.js

router.get('/', (req, res) => {
  collection.find().toArray()
    .then((docs) => res.json(docs))
});
```

Now you can test the index route in Insomnia REST Client, by creating a new GET request, and making the request to http://localhost:5000/api/games. You will see the JSON response of the game objects you seeded your database with.

Because we are chaining a number of methods in this route, we can format it to make it more readable.

```js
// helpers/create_router.js

router.get('/', (req, res) => {
  collection // MODIFIED
    .find()
    .toArray()
    .then((docs) => res.json(docs))
});
```

Now we can see more easily that we are:

1. calling `find` on the collection to get back a cursor object of all the documents
2. converting the cursor into an array with `toArray`
3. and `then` once that process has completed, we are sending the array of documents (`docs`), as JSON, back with the response.

We should also pass this a catch block in case of any errors.

```js
// helpers/create_router.js

router.get('/', (req, res) => {
  collection // MODIFIED
    .find()
    .toArray()
    .then((docs) => res.json(docs))
    .catch((err) => {
      console.error(err);
      res.status(500);
      res.json({ status: 500, error: err });
    })
});
```

If there is a problem the server will respond with a 500 error code which means there was an internal server error.

We have now completed the index route, and you can test it using Insomnia Rest Client with a GET request to http://localhost:5000/api/games.

### Show Route

The show route, by convention, returns one object. It will the get method and the route path will need a parameter in the URL (for example, `:id`), so that the client can specify which game they want to receive when they make a request.

```js
// helpers/create_router.js

const gamesRouter = function (collection) {

  // ...

  router.get('/:id', (req, res) => { // NEW

  });

  return router;

};
```

We are going to use the ID that the client specifies in the request to find the corresponding game object from the database. Let's access the ID of the request's params object, using our parameter name.

```js
router.get('/:id', (req, res) => { // NEW
  const id = req.params.id;
});
```

Now we have the ID, we can use MongoDB's `findOne` method, which takes a query object. If we were to search by name, we would do the following, `findOne({name: 'Love Letter'})`, but we can't be sure every game has a unique name.

#### MongoDB's ObjectID

When inserting a document into the database, MongoDB assigns it unique identifier with the key `_id`. To query the database for an object with a particular ID, we want to do the following, `findOne({_id: '5af2d6f93776ded87a62a4ec'})`. However, the ID will never match if the ID is passed as a string because MongoDB stores IDs as `ObjectID`s](https://docs.mongodb.com/manual/reference/method/ObjectId/). Therefore to find a document, we have to pass the ID as an ObjectID. ObjectID comes from MongoDB so we need to require it.

```js
// helpers/create_router.js

const express = require('express');
const ObjectID = require('mongodb').ObjectID; // NEW
```

Now when we want to query the database for a particular ID, we can pass the `findOne` method the object `{ _id: ObjectID(5af2d6f93776ded87a62a4ec) }`.

```js
// helpers/create_router.js

router.get('/:id', (req, res) => { // NEW
  const id = req.params.id;
  collection
    .findOne({ _id: ObjectID(id) })
});
```

Lastly, we want to send the found game object back, as JSON, with the response. As `findOne` is asynchronous (it takes time) and returns a promise, we will use `then` to receive the found game once the promise has been resolved. We can then convert the document to JSON and send it back with the response.

```js
router.get('/:id', (req, res) => {
  const id = req.params.id;
  collection
  .findOne({ _id: ObjectID(id) })
  .then((doc) => res.json(doc)) //NEW
  .catch((err) => {
    console.error(err);
    res.status(500);
    res.json({ status: 500, error: err });
  });
});
});
```

We have now completed the show route, and you can test it using Insomnia Rest Client with a GET request to `http://localhost:5000/api/games/[existing ID]`.

### Create Route

### Task: (10 minutes)

Your task is to create the "create" route.

You will need to:

- check that the server is configured to use the middleware function to access the request body
- define a new route that handles POST requests
- access the new game object from the request's body
- insert the game into the games collection using the `insertOne` method
- send back all the documents from the collection with the response. Note: `insertOne` is asynchronous and returns a promise, so use a `then` to access all the games from the collection once the promise has resolved and convert the documents into to an array
- finally, we know that the cursor method, `toArray`, is asynchronous and returns a promise, so use another `.then` to convert the array into JSON and send it back with the response.

Test the create route in Insomnia REST Client, by creating a new POST request and adding the following JSON object to the body:

```js
{
	"name": "Chess",
	"playingTime": 60,
	"players": {
		"min": 2,
		"max": 2
	}
}
```

Make the request to http://localhost:5000/api/games/ and you will see the JSON response of the all the game objects including the one you added.

<details>
<summary>Example solution</summary>

server.js contains the configuration to access the request body, so we can go ahead and define a POST route that has access to the body object:

```js
router.post('/', (req, res) => {
  const newData = req.body;
  collection
    .insertOne(newData)
    .then(() => collection.find().toArray())
    .then((docs) => res.json(docs));
    .catch((err) => {
      console.error(err);
      res.status(500);
      res.json({ status: 500, error: err });
    });
});
```

</details>

This works, however its not very efficient.  Imagine we had millions of entries in our database, when we add one, do we really want to get them all back?

We can make this more efficient.

```js
router.post('/', (req, res) => {
  const newData = req.body;
  collection
  .insertOne(newData)
  .then((result) => { //UPDATED
    res.json(result.ops[0]) //UPDATED
  })
  .catch((err) => {
    console.error(err);
    res.status(500);
    res.json({ status: 500, error: err });
  });
});

```

After we've inserted the document we're accessing the result of this function.  Result contains the result document from MongoDB and ops contains the documents inserted with added `_id` fields.

Now we're just returning the object we've inserted rather than all the objects.

We have now completed the create route.

### Destroy Route

### Task: (10 minutes)

Your task is to create the destroy route.

You will need to:

- Define a new route that handles DELETE requests with an `id` parameter in the path
- Access the ID from the request's `params` object
- use `deleteOne` to delete the document in the games collection that has an ID that matches the ID specified in the request. To do this, pass `deleteOne` an object with the key of the property you want to search by, and the value you want to search with: `{ _id: ObjectID(id) }`
- Send the result as JSON.  Unlike the `insertOne` function we don't want the object back, we just want the result in JSON format. Note: `deleteOne` is asynchronous and returns a promise, so use `then` to access all the results.


<details>
<summary>Example solution</summary>

```js
router.delete('/:id', (req, res) => {
  const id = req.params.id;
  collection
  .deleteOne({ _id: ObjectID(id) })
  .then(result => {
    res.json(result)
  })
  .catch((err) => {
    console.error(err);
    res.status(500);
    res.json({ status: 500, error: err });
  });
});
```
</details>

We have now completed the destroy route, and you can test it using Insomnia Rest Client with a DELETE request to `http://localhost:5000/api/games/[existing ID]`.

The result that we get back is a confirmation that the document has been removed.

```js
{
  "n": 1,
  "ok": 1
}
```

### Update Route

Now, let's write the update route. We will use the `put` method, and pass it a path with an `id` parameter, and a callback that will receive the request and response.

```js
router.put('/:id', (req, res) => {

});
```

To update a document in the database we need find the correct document from the database, and update it with the new values from the request.

Let's start by getting the ID of the object we want to update from the request's `params` object, and the new game object with the updated values from the request's `body` object.

```js
router.put('/:id', (req, res) => {
  const id = req.params.id;
  const updatedData = req.body;
});
```

Now we are going to use those two piece of information to update the document in the database's collection, using the collection's `updateOne` method. `updateOne` takes two arguments, both objects:

1. The first is used to query the collection to find the document that matches the filter (in our case we are searching by ID)
2. The second is an object that has the property `$set`. This is telling MongoDB to set each of the fields of the found document, with the values of the corresponding properties of `findOneAndUpdate`.

```js
router.put('/:id', (req, res) => {
  const id = req.params.id;
  const updatedData = req.body;
  collection
  .updateOne(
    { _id: ObjectID(id)},
    { $set: updatedData }
  )
});
```

Once that is complete we want to get some confirmation that the update was successful. `updateOne` is asynchronous and returns a promise, so we will use `then` to access the result and `res.json()` the `result`.  The result object contains conformation of the update, including the number of object that were updated, how many were successful, and so on.

```js
router.put('/:id', (req, res) => {
  const id = req.params.id;
  const updatedData = req.body;
  collection
  .updateOne(
    { _id: ObjectID(id)},
    { $set: updatedData },
  )
  .then((result) => {
    res.json(result)
  })
  .catch((err) => {
    console.error(err);
    res.status(500);
    res.json({ status: 500, error: err });
  });
})
```

Test the update route in Insomnia REST Client by creating a new PUT request and adding an updated JSON game object into the body. Make the request to http://localhost:5000/api/games/[existing ID] and you will see the JSON response confirming the success of the request.

Important: Do not include the `_id` property in the updated game object when you send the put request. MongoDB will give an error if you try to update a document by giving it an object with a key, `_id`.

We have now completed the update route.

We have now created a RESTful JSON API for our games resource, with data being persisted in a MongoDB database. We have tested all of the routes in Insomnia Rest Client to ensure they work.

## Cors

We have one more thing to do to complete our application. With the server still running, navigate to your client folder and run `npm start` to get the front end React app running.

```bash
npm start
```

No games are rendering.  They should be as there's a fetch request in `GamesGrid` to bring all of the games back from the database.  The terminal is telling us what the error is.

```
Access to fetch at 'http://localhost:5000/api/games' from origin 'http://localhost:3000'
has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header
is present on the requested resource.
```

We need to install the npm cors package for the server.  From the server directory:

```bash
npm i cors
```

And then all we have to do is tell Express to use it.

```js
//server.js
const cors = require('cors') //NEW

app.use(express.json());
app.use(cors()); //NEW
```

Now when you refresh your browser you should see all the games from the database rendering on screen, with the ability to add and delete these games.

## Recap

Why do we need to use MongoDB Driver?

<details>
<summary>Answer</summary>

So that we can interact with the MongoDB database from inside our JavaScript applications.

</details>
<br/>

Why do we need to use promises in the games resource routes?

<details>
<summary>Answer</summary>

Because interacting with the database is asynchronous, so we need to wait until the process is complete before continuing to execute our code. For example, retrieving one games object from the database using `findOne` takes time, so until the process has complete, we don't have the object to send back with the response.

</details>

## Conclusion

To create a RESTful JSON API we used an Express server to define a set of routes, and the MongoDB Driver to interact with the data stored in a MongoDB database. We have completed the back-end of a full stack JavaScript application.
