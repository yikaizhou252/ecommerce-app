const express = require('express');
const bodyParse = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParse.json());

// post an "event" whenever a "post" or "comment" is created
// the creation event is then broadcasted to all services
app.post('/events', (req, res) => {

    const event = req.body; 

    // Post service:
    // axios.post('http://localhost:4000/events', event).catch((err) => {
    //     console.log(err.message);
    // }); 

    // Comment service:
    // axios.post('http://localhost:4001/events', event).catch((err) => {
    //     console.log(err.message);
    // });;

    // Query service:
    axios.post('http://localhost:4002/events', event).catch((err) => {
        console.log(err.message);
    });; // query 

    res.send({status: 'OK'});
})


app.listen(4005, () => {
    console.log('Event-bus: listening on 4005');
});
