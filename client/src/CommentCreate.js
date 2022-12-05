import React, { useState } from 'react';
import axios from 'axios';


// what does this do? 
// a form, textbox, and submit button that will be
// inside of a Postcard object

const CommentCreate = ({ postId }) => {

    const [content, setContent] = useState('');

    const handleSubmit = async (event) => {
        // make a post request to the comment POST endpoint
        // using content and postID
        // event.preventDefault();
        await axios.post(`http://localhost:4001/posts/${postId}/comments`, {
            content
        });
        setContent('');
    };

        
    // everytime this changes, sent event of the new value
    // and call the hook
    return(
        <div>
            <form onSubmit={handleSubmit}>
                <div className='form-group'>
                    <label>Comments:</label>
                    <input 
                    value={content}
                    onChange={event => setContent(event.target.value)} 
                    className='form-control'
                    />
                </div>
                <button className='btn btn-primary'>Submit</button>
            </form>
        </div>
    );
};

export default CommentCreate;