import React, { useEffect, useState } from "react";
import CommentSection from "../components/CommentSection";
import ReactionList from "../components/ReactionList";

export default function MediaDetail({ match }) {
  const [media, setMedia] = useState(null);
  const [reactions, setReactions] = useState([]);
  const [comments, setComments] = useState([]);

  const mediaId = match.params.mediaId;

  useEffect(() => {
    fetch(`http://localhost:4000/media/${mediaId}`)
      .then((response) => response.json())
      .then((data) => {
        setMedia(data);
        document.title = `${data.title} - Emotionary`;
      })
      .catch((error) => console.error("Error fetching media:", error));

    fetch(`http://localhost:4000/emotions?mediaId=${mediaId}&_expand=user`)
      .then((response) => response.json())
      .then((data) => setReactions(data))
      .catch((error) => console.error("Error fetching reactions:", error));

    fetch(`http://localhost:4000/comments?mediaId=${mediaId}`)
      .then((response) => response.json())
      .then((data) => setComments(data))
      .catch((error) => console.error("Error fetching comments:", error));
  }, [mediaId]);

  const handleCommentSubmit = (comment) => {
    const newComment = {
      mediaId,
      comment,
      timestamp: new Date().toISOString(),
    };

    fetch("http://localhost:4000/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newComment),
    })
      .then(() => {
        setComments((prev) => [...prev, newComment]);
      })
      .catch((error) => console.error("Error submitting comment:", error));
  };

  return (
    <div>
      {media && (
        <div>
          <h1>{media.title}</h1>
          <p>{media.type} by {media.creator}</p>
        </div>
      )}
      <h2>Reactions</h2>
      <ReactionList reactions={reactions} />
      <h2>Comments</h2>
      <CommentSection comments={comments} onCommentSubmit={handleCommentSubmit} />
    </div>
  );
}
