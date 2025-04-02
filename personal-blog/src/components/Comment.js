import React from "react";
import { useState } from "react";

function Comment() {
    const [comments, setComments] = useState([]); // Store comments
    const [input, setInput] = useState(""); // Store input field value

    function handleSubmit(event) {
        event.preventDefault(); // Prevent page reload

        if (input.trim() !== "") {
            setComments([...comments, input]); // Add new comment
            setInput(""); // Clear input field
        }
    }

    return (
        <div className="comment-section">
            <form onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    placeholder="Write a comment..." 
                    value={input} 
                    onChange={(e) => setInput(e.target.value)}
                />
                <button type="submit">Comment</button>
            </form>
            
            <div className="comments">
                {comments.map((comment, index) => (
                    <p key={index}>{comment}</p>
                ))}
            </div>
        </div>
    );
}

export default Comment;
