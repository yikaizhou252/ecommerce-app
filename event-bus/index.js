const express = require('express');
const bodyParse = require('body-parser');
const axios = require('axios');
const e = require("express");

const app = express();
app.use(bodyParse.json());

// post an "event" whenever a "post" or "comment" is created
// the creation event is then broadcast to all services
app.post('/events', (req, res) => {

    const event = req.body;
    console.log("calling event bus:", event)

    // Post service:
    axios.post('http://localhost:4000/events', event).catch((err) => {
        console.log('Posts:', err.message);
    });

    // Comment service:
    axios.post('http://localhost:4001/events', event).catch((err) => {
        console.log('Comments:', err.message);
    });;

    // Query service:
    axios.post('http://localhost:4002/events', event).catch((err) => {
        console.log('Query:', err.message);
    });; // query

    // send to moderation services
    axios.post('http://localhost:4069/events', event).catch((err) => {
        console.log('Moderation:', err.message);
    })

    res.send({status: 'OK'});
})


app.listen(4005, () => {
    console.log('Event-bus: listening on 4005');
});
