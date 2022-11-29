import React, { useState, useEffect } from "react";
import axios from 'axios';
import CommentCreate from "./CommentCreate";
import CommentList from "./CommentList";

const PostList = () => {

    // use a object here becauset the get request returns a json, not array
    const [posts, setPosts] = useState({});

    /*
    make request to query instead of post
    */
    const fetchAllPosts = async () => {
        const res = await axios.get('http://localhost:4002/posts');
        setPosts(res.data);
    };

    // useEffect() is a method that runs a snippet at a specific time 
    // we want fetchPost when the components are first displayed on the screen
    useEffect(() => {
        fetchAllPosts();
    }, []);
    
    // this is a bad approach:
    // we are making a GET request to the comment service FOREACH post that exists
    // 100 posts => 100 GET request?

    // to solve this issue, let's have a service "Query" that listens for each post create and 
    // comment create event
    // service will process and store each event

    // Pros: Query is not directly dependent on any other services; fast
    // Cons: Data duplication: new post stored in both Post service and in Query service
    const renderAllPosts = Object.values(posts).map( post => {
        return (
            <div 
            className="card" 
            style={{ width: '30%', marginBottom: '20px'}}
            key={post.id}
            >
                <div className="card-body">
                    <h3>{post.title}</h3>
                    <CommentList fetchedComments={post.comments}/>
                    <CommentCreate postId={post.id}/>
                </div>
            </div>
        );
    });
    
   
    return (
        <>
            <h1>Posts</h1>
            <div className="d-flex flex-row flex-wrap justify-content-between">
            {renderAllPosts}
            </div>
        </>
        
    );
};


// const Post = () => {

    

//     const allComments = [1,2,3,4,5];
//     return (
//         <>
//             <div>Post list: </div>
//             {allComments.map( member => <div>{member}</div>)}
//         </>
//     );
// };

export default PostList;