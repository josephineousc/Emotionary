import React, { useState } from "react";

export default function CommentSection({ comments, onCommentSubmit }) {
  const [comment, setComment] = useState("");

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (comment.trim() === "") return;
    onCommentSubmit(comment);
    setComment("");
  };

  return (
    <div className="comment-section">
      <h3>Comments</h3>
      {comments.map((c) => (
        <div key={c.id} className="comment">
          <p>{c.comment}</p>
          <small>
            By User {c.userId} on {new Date(c.timestamp).toLocaleString()}
          </small>
        </div>
      ))}
      <form onSubmit={handleCommentSubmit}>
        <textarea
          placeholder="Write a comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
