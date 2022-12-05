const express = require('express');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');
const cors = require('cors');

// need axios to send requests
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// in-memory object to store all comments from all posts
// each id will have a collection of comment objects
const commentsByPostId = {};

// this endpoint is deprecated with the addition of the event-bus
// returns all comments underneath a post:
// problem: with 100 posts, should we make 100 get requests to get all comments
// solution: all comments are fetched in a SINGLE GET request
app.get('/posts/:id/comments', (req, res) => {

    // endpoint that retrieves all comments underneath a thread
    // challenge: how do we access a posts' database?
    // remember the design pattern of database-per-service:
    // each service has its own DB
    res.send(commentsByPostId[req.params.id]);
});


// endpoint for creating a new comment
app.post('/posts/:id/comments', async (req, res) => {

    // post id can be obtained by 
    // req.params.id
    let postId = req.params.id;

    // API for "posting" a comment given blogpost
    // a comment is *always* related to a blogpost ID

    const commentId = randomBytes(4).toString('hex');
    const { content } = req.body;

    // 1: get the array of existing comments
    // 2: add comment to array and update the array
    // 3: default status is pending
    const allCommentsInPost = commentsByPostId[postId] || [];
    allCommentsInPost.push({
        id : commentId, 
        content,
        status: 'pending',
    });

    // push comment created to event Q
    await axios.post('http://localhost:4005/events', {
        type: 'CommentCreated',
        data: { 
            id: commentId, 
            content,
            status: 'pending',
            postID: req.params.id 
        }
    });

    // push comment created to moderator
    // dont need because event bus does that
    // await axios.post('http://localhost:4069/events', {
    //     type: 'CommentCreated',
    //     data: {
    //         id: commentId,
    //         content,
    //         status: 'pending',
    //         postID: req.params.id
    //     }
    // });
    // remember, arrays are immutable in JS
    commentsByPostId[req.params.id] = allCommentsInPost;
    res.status(201).send(allCommentsInPost);
});

// event listener
app.post('/events', async (req, res) => {
    // console.log("Event received: ", req.body.type);
    const { type, data } = req.body;
    console.log(req.body);

    // handle comments based on moderation
    if(type === 'CommentModerated'){

        const { postID, id, status, content } = data;
        const comments = commentsByPostId[postID];
        const comment = comments.find( com => com.id === id );

        comment.status = status;

        await axios.post('http://localhost:4005/events', {
            type: 'CommentUpdated',
            data: {
                id,
                postID,
                status,
                content
            }
        });
    }
    res.send({});
});

app.listen(4001, () => {
    console.log("Comment service: listening on 4001");
});
