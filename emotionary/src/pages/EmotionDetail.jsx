// pages/EmotionDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function EmotionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [emotion, setEmotion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);

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

      if (urlObj.hostname.includes('vimeo.com')) {
        const vimeoId = urlObj.pathname.split('/').pop();
        return `https://vimeo.com/api/v2/video/${vimeoId}/thumbnail_large.jpg`;
      }

      if (urlObj.hostname.includes('spotify.com')) {
        if (urlObj.pathname.includes('track')) {
          const trackId = urlObj.pathname.split('/').pop();
          return `https://i.scdn.co/image/${trackId}`;
        }
        if (urlObj.pathname.includes('album')) {
          const albumId = urlObj.pathname.split('/').pop();
          return `https://i.scdn.co/image/${albumId}`;
        }
        if (urlObj.pathname.includes('playlist')) {
          const playlistId = urlObj.pathname.split('/').pop();
          return `https://i.scdn.co/image/${playlistId}`;
        }
      }

      if (urlObj.pathname.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
        return url;
      }

      return `https://www.google.com/s2/favicons?domain=${urlObj.hostname}&sz=64`;

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [emotionResponse, bookmarksResponse] = await Promise.all([
          fetch(`http://localhost:4000/emotions/${id}`),
          fetch(`http://localhost:4000/bookmarks?emotionId=${id}`)
        ]);

        if (!emotionResponse.ok) {
          throw new Error('Emotion not found');
        }

        const [emotionData, bookmarksData] = await Promise.all([
          emotionResponse.json(),
          bookmarksResponse.json()
        ]);

        setEmotion(emotionData);
        setIsBookmarked(bookmarksData.length > 0);
        document.title = `${emotionData.mediaTitle} | Emotionary`;
      } catch (err) {
        setError(err.message);
        toast.error('Failed to load emotion');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleSave = async () => {
    try {
      const response = await fetch('http://localhost:4000/bookmarks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: 1,
          emotionId: emotion.id,
          dateBookmarked: new Date().toISOString(),
        }),
      });

      if (!response.ok) throw new Error('Failed to save');

      setIsBookmarked(true);
      toast.success("Saved to library!");
    } catch (err) {
      toast.error("Failed to save");
    }
  };

  const handleUnsave = async () => {
    try {
      const response = await fetch(`http://localhost:4000/bookmarks?emotionId=${id}`);
      const data = await response.json();
      const bookmarkId = data[0]?.id;

      if (!bookmarkId) throw new Error('Bookmark not found');

      await fetch(`http://localhost:4000/bookmarks/${bookmarkId}`, {
        method: 'DELETE',
      });

      setIsBookmarked(false);
      toast.success("Removed from library!");
    } catch (err) {
      toast.error("Failed to remove");
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this emotion?')) {
      try {
        const response = await fetch(`http://localhost:4000/emotions/${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Failed to delete emotion');
        }

        toast.success('Emotion deleted successfully');
        navigate('/');
      } catch (err) {
        toast.error('Failed to delete emotion');
      }
    }
  };

  if (loading) return <div className="content">Loading...</div>;
  if (error) return <div className="content">Error: {error}</div>;
  if (!emotion) return <div className="content">Emotion not found</div>;

  return (
    <div className="emotion-detail-container">
      <div className="emotion-nav">
        <button onClick={() => navigate('/')} className="save-button">
          BACK TO HOME
        </button>
        
        {isBookmarked ? (
          <button onClick={handleUnsave} className="delete-button">
            UNSAVE
          </button>
        ) : (
          <button onClick={handleSave} className="save-button">
            SAVE
          </button>
        )}
        
        <button onClick={handleDelete} className="delete-button">
          DELETE
        </button>
      </div>

      <section className="about-section">
        <div className="emotion-header">
          <h1 className="emotion-title">{emotion.mediaTitle}</h1>
          <span className="emotion-media-tag">{emotion.media}</span>
        </div>

        <div className="emotion-image-container">
          <img 
            src={getThumbnail(emotion.url, emotion.media)}
            alt={emotion.mediaTitle}
            className="emotion-image"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = `https://placehold.co/600x400/lightgray/white?text=${emotion.media}`;
            }}
          />
        </div>
      </section>

      <section className="about-section">
        <h2>Emotional Response</h2>
        <p className="emotion-description">{emotion.description}</p>
      </section>

      <section className="about-section">
        <h2>Details</h2>
        <div className="emotion-details">
          <div className="emotion-detail-item">
            <div className="emotion-detail-label">Rating</div>
            <div className="emotion-rating rating">
              {formatRating(parseInt(emotion.rating))}
              <span className="rating-number"> ({emotion.rating}/5)</span>
            </div>
          </div>

          <div className="emotion-detail-item">
            <div className="emotion-detail-label">Posted on</div>
            <div className="emotion-timestamp">
              {new Date(emotion.timestamp).toLocaleDateString()} at{' '}
              {new Date(emotion.timestamp).toLocaleTimeString()}
            </div>
          </div>

          {emotion.url && (
            <div className="emotion-detail-item">
              <div className="emotion-detail-label">Media Source</div>
              <a 
                href={emotion.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="emotion-source-link"
              >
                Visit Source →
              </a>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default EmotionDetail;