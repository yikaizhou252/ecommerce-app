import React from 'react';

const CommentList = ({ fetchedComments }) => {
    const renderedComments = 
    fetchedComments
    //.filter( comment => comment.status === 'approved')
    .map( comment => {
        return <li key={comment.id}>{comment.content} - {comment.status}</li>;
    });

    return <ul>
        {renderedComments}
    </ul>
};

export default CommentList;
