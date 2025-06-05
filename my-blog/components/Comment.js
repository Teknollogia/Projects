import { useState, useEffect } from 'react';

export default function Comment({ postId, user, onDeleteComment }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
        const host = window.location.host;
        const res = await fetch(`${protocol}://${host}/api/comments?postId=${postId}`);
        const data = await res.json();
        setComments(data);
      } catch (err) {
        console.error('Error fetching comments:', err);
      }
    };
    fetchComments();
  }, [postId]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please log in to comment');
      return;
    }
    if (!newComment.trim()) {
      alert('Comment cannot be empty');
      return;
    }
    try {
      const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
      const host = window.location.host;
      const res = await fetch(`${protocol}://${host}/api/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId, userId: user.id, content: newComment }),
      });
      const addedComment = await res.json();
      if (res.ok) {
        setComments([...comments, addedComment]);
        setNewComment('');
      } else {
        alert('Failed to add comment: ' + addedComment.error);
      }
    } catch (err) {
      alert('Error adding comment: ' + err.message);
    }
  };

  const handleDelete = (commentId) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      onDeleteComment(commentId);
    }
  };

  return (
      <div className="comment-section">
        <h3>Comments</h3>
        {comments.map((comment) => (
            <div key={comment.id} className="comment">
              <p>{comment.content}</p>
              <small>Posted by {comment.username} on {comment.createdAt}</small>
              {user?.role === 'admin' && (
                  <button className="delete-comment-button" onClick={() => handleDelete(comment.id)}>
                    Delete Comment
                  </button>
              )}
            </div>
        ))}
        {user && (
            <form onSubmit={handleAddComment}>
          <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="comment-input"
          />
              <button type="submit">Post Comment</button>
            </form>
        )}
      </div>
  );
}