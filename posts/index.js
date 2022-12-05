const express = require('express');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');
const cors = require('cors');
const axios = require('axios');

// initializing our Express app
const app = express();
app.use(bodyParser.json());
app.use(cors());

// obj containing all posts received so far
const allPosts = {};

// defining a GET endpoint
app.get('/posts', (req, res) => {

    // a get request to /posts will be directed
    // to the mailPosts obj
    res.send(allPosts);
});

// defining a POST endpoint
app.post('/posts', async (req, res) => {

    //generate a random ID every time someone makes a post request to the /posts 

    // using the randomBytes function crypto
    const id = randomBytes(4).toString('hex');
    const { title } = req.body;

    // destructuring the title from request body
    // and add it to the mailPosts object
    allPosts[id] = {
        id, title 
    };

    // after a post is created, send an event to eventQ
    // network requests are ALWAYS async, parent function needs to AWAIT
    await axios.post('http://localhost:4005/events', {
        type: 'PostCreated',
        data: { id, title },
    });

    // 201 means 'resource created'
    res.status(201).send(allPosts[id]);
});

// defining the endpoint for reading events from Q
app.post('/events', (req, res) => {
    // console.log("Received event: ", req.body.type);
    res.send({});
});

app.listen(4000, () => {
    console.log('Post service: listening on port 4000');
});