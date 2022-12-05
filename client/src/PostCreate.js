import React, { useState } from "react";
import axios from 'axios'

const PostCreate = () => {

    const [inputText, setInputText] = useState("");
    const handleChange = (event) => {
        setInputText(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        // alert(`You have submitted: ${inputText}`);
        await axios.post('http://localhost:4000/posts', { 
            title: inputText
        });
        setInputText('');
    };

    // right now the moderation function is only dispatched when the button is clicked
    const handleSecondaryButton = async (event) => {
        event.preventDefault();
    }

    return (
        <form onSubmit={handleSubmit}>
            <h1 className="Create">Create Post</h1>
            <div className="form-group">
                <label>Title</label>
                <input className="form-control" defaultValue={inputText} onChange={handleChange}/>
            </div>
            <div className="d-flex flex-row flex-wrap justify-content-between">
                <button className="btn btn-primary">Submit</button>
                <button className="btn btn-primary" onClick={handleSecondaryButton}>moderate</button>
            </div>
        </form>
    );
}

export default PostCreate;