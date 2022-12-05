const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const async_hooks = require("async_hooks");

const app = express();
app.use(bodyParser.json());

// for event queue to post
app.post('/events', async (req, res) => {
    const { type, data } = req.body;

    if(type === 'CommentCreated'){
        const status = data.content.includes('orange') ? 'rejected' : 'approved';
        await axios.post('http://localhost:4005/events', {
            type: 'CommentModerated',
            data: {
                id: data.id,
                postID: data.postID,
                status,
                content: data.content
            }
        });
    }
    res.send({});
});

// req will be all posts and comments
/*app.post('/moderate', (req, res) => {

    // the keyword is defined in the main app
    const {threads, keyword} = req.body;
    Object.values(threads).forEach(post => console.log(post.comments))
    const newComments = Object.values(threads).flatMap(post => post.comments)
        .forEach(comment => {
        if(comment.content.includes(keyword)){
            //console.log(comment.content)
            comment.status = 'rejected'
        } else {
            comment.status = 'accepted'
        }
    })
    Object.values(threads).forEach(post => console.log(post.comments))
    /// wait... so send this all back and re-render?
    res.send({});
});*/

app.listen(4069, () => {
    console.log('Moderator: listening on 4069');
});
