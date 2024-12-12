import React from "react";
import PropTypes from "prop-types";

function ReactionList({ reactions }) {
  if (!reactions || reactions.length === 0) {
    return <p>No reactions found.</p>;
  }

  return (
    <div className="card-grid">
      {reactions.map((reaction) => (
        <div key={reaction.id} className="card">
          <img
            src={reaction.thumbnailUrl}
            alt={reaction.mediaTitle}
            className="thumbnail"
          />
          <div className="card-content">
            <h3>{reaction.mediaTitle}</h3>
            <p>{reaction.description}</p>
            <p>
              <strong>Timestamp:</strong>{" "}
              {new Date(reaction.timestamp).toLocaleString()}
            </p>
            <p>
              <strong>Rating:</strong> {reaction.rating}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

ReactionList.propTypes = {
  reactions: PropTypes.array.isRequired,
};

export default ReactionList;
