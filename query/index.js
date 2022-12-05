const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// this app's has 2 purposes:
// 1: listens to events and store them in an efficient data struture
// 2: provide a full list of posts and comments on command

const app = express();
app.use(bodyParser.json());
app.use(cors());

// local storage of the posts and comments
const posts = {};
 
// const example = {
//     'asdf989': {
//         id: 'asdfa',
//         title: 'this is a post',
//         comments: [
//             { id: 'gadfsg', content: 'funny post!'}
//         ]
//     },
    
//     'asdf89': {
//         id: 'asdfa',
//         title: 'this is a post',
//         comments: [
//             { id: 'gadfsg', content: 'funny post!'}
//         ]
//     }
// } 

app.get('/posts', (req, res) => {
    res.send(posts);
});

// handles both thread and comment creation events
app.post('/events', (req, res) => {
    const { type, data } = req.body; 
        if (type === 'PostCreated'){
            const { id, title } = data;
            // create a post object and push it to memory
            posts[id] = { id, title, comments: [] };
        }
        if (type === 'CommentCreated'){
            // push the comment onto the appropriate thread
            const { id, content, postID, status } = data;
            posts[postID].comments.push({ id, content, status })
        }
        if (type === 'CommentUpdated'){
            const { id, postID, status, content } = data;
            const comment = posts[postID].comments.find(com => com.id === id);
            comment.status = status;
            comment.content = comment.content + " - " + status;
        }
        res.send({});
});

app.listen(4002, () => {
    console.log('Query service: listening on 4002')
});
