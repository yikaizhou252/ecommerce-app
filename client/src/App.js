import React from 'react';
import PostCreate from './PostCreate';
import PostList from './PostList';

const App = () => {
    return(
        <div className='container'>
            <PostCreate/>
            <hr />
            <PostList/>
        </div>
    );
};

export default App;