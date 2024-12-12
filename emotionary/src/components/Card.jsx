import React from 'react';
import { useNavigate } from 'react-router-dom';

function Card({ emotion, onSave, onUnsave, onDelete, isBookmarked }) {
  const navigate = useNavigate();

  const getThumbnail = (url, mediaType) => {
    if (!url) {
      return `https://placehold.co/600x400/lightgray/white?text=${mediaType}`;
    }

    try {
      const urlObj = new URL(url);
      
      if (urlObj.hostname.includes('youtube.com') || urlObj.hostname.includes('youtu.be')) {
        const videoId = urlObj.hostname.includes('youtube.com') 
          ? new URLSearchParams(urlObj.search).get('v')
          : urlObj.pathname.slice(1);
        return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
      }

    } catch (error) {
      console.error('Error parsing URL:', error);
      return `https://placehold.co/600x400/lightgray/white?text=${mediaType}`;
    }
  };

  const formatRating = (rating) => {
    const fullStars = "★".repeat(rating);
    const emptyStars = "☆".repeat(5 - rating);
    return fullStars + emptyStars;
  };

  const handleCardClick = (e) => {
    if (e.target.tagName !== 'BUTTON') {
      navigate(`/emotions/${emotion.id}`);
    }
  };

  return (
    <div className="card" onClick={handleCardClick}>
      <div className="thumbnail-container">
        <img 
          src={getThumbnail(emotion.url, emotion.media)}
          alt={emotion.mediaTitle}
          className="thumbnail"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = `https://placehold.co/600x400/lightgray/white?text=${emotion.media}`;
          }}
        />
      </div>
      <div className="card-content">
        <h3>{emotion.mediaTitle || emotion.title}</h3>
        <p className="media-type">{emotion.media}</p>
        <p className="description">{emotion.description}</p>
        {emotion.rating && (
          <p className="rating">
            {formatRating(parseInt(emotion.rating))}
            <span className="rating-number"> ({emotion.rating}/5)</span>
          </p>
        )}
        {emotion.timestamp && (
          <p className="timestamp">
            {new Date(emotion.timestamp).toLocaleDateString()}
          </p>
        )}
        {emotion.url && (
          <p className="url">
            <a 
              href={emotion.url} 
              target="_blank" 
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()} 
            >
              Visit Media
            </a>
          </p>
        )}
        <div className="card-buttons" onClick={(e) => e.stopPropagation()}> 
          {isBookmarked ? (
            <button
              onClick={() => onUnsave(emotion.id)}
              className="unsave-button"
            >
              UNSAVE
            </button>
          ) : (
            <button
              onClick={() => onSave(emotion)}
              className="save-button"
            >
              SAVE
            </button>
          )}
          <button
            onClick={() => onDelete(emotion.id)}
            className="delete-button"
          >
            DELETE
          </button>
        </div>
      </div>
    </div>
  );
}

export default Card;