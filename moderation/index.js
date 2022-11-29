const express = require('express');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');
const cors = require('cors');

// need axios to send requests
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(cors());


// req will be all posts and comments
app.post('/moderate', (req, res) => {

    const {threads, keyword} = req.body;
    Object.values(threads).forEach(post => console.log(post.comments))
    const newComments = Object.values(threads).flatMap(post => post.comments).forEach(comment => {
        if(comment.content.includes(keyword)){
            //console.log(comment.content)
            comment.status = 'rejected'
        } else {
            comment.status = 'accepted'
        }
    })
    Object.values(threads).forEach(post => console.log(post.comments))
    /// wait... so send this all back and re-render?
    
});

app.listen(4069, () => {
    console.log('Moderator: listening on 4069');
});
