import React, { useState, useEffect } from "react";

export default function Comment({ user, postId }) {
  const [comments, setComments] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
  fetch(`/api/comments?postId=${postId}`)
    .then(res => res.json())
    .then(data => {
      if (Array.isArray(data)) {
        setComments(data);
      } else {
        console.error("Expected array but got:", data);
        setComments([]);
      }
    })
    .catch(err => {
      console.error("Fetch error:", err);
      setComments([]);
    })
    .finally(() => setLoading(false));
}, [postId]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (input.trim() === "") return;

    const newComment = {
      content: input,
      username: user.username,
      postId,
    };

    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newComment),
      });

      if (res.ok) {
        const savedComment = await res.json();
        setComments(prev => [...prev, savedComment]);
        setInput("");
        setError("");
      } else {
        const {error} = await res.json();
        setError(error || "Failed to submit comment");
      }
    } catch (err) {
      console.error("Error submitting comment:", err);
      setError("Network error");
    }
  };

  if (!user) {
    return (
      <p style={{ color: 'red' }}>
        Please log in to comment.
      </p>
    );
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
        {
            loading ? <p>Loading comments...</p> : (
            <div className="comments">
                {comments.map((comment, index) => (
                <p key={index}><strong>{comment.username}:</strong> {comment.content}</p>
                ))}
            </div>
        )}
      </div>
    </div>
  );
}
