import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Card from "../components/Card";

function Home({ filter, searchTerm }) {
  const [emotions, setEmotions] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    let isSubscribed = true;

    const fetchData = async () => {
      try {
        const [emotionsResponse, bookmarksResponse] = await Promise.all([
          fetch('http://localhost:3000/emotions'),
          fetch('http://localhost:3000/bookmarks')
        ]);

        if (!emotionsResponse.ok || !bookmarksResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        console.log(emotionsResponse);
        console.log(bookmarksResponse);

        const [emotionsData, bookmarksData] = await Promise.all([
          emotionsResponse.json(),
          bookmarksResponse.json()
        ]);

        console.log(emotionsData);
        console.log(bookmarksData);

        if (isSubscribed) {
          setEmotions(emotionsData);
          setBookmarks(bookmarksData.map(bookmark => bookmark.emotionId));
          setLoading(false);
        }
      } catch (error) {
        console.error("Error details:", error);
        if (isSubscribed) {
          setError("Failed to load emotions. Please make sure the server is running.");
          setLoading(false);
        }
      }
    };

    fetchData();

    const handleNewEmotion = (event) => {
      if (isSubscribed) {
        setEmotions(prev => [...prev, event.detail]);
      }
    };

    window.addEventListener('emotionAdded', handleNewEmotion);

    return () => {
      isSubscribed = false;
      window.removeEventListener('emotionAdded', handleNewEmotion);
    };
  }, []);

  const handleSave = async (emotion) => {
    try {
      const response = await fetch('http://localhost:3000/bookmarks', {
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

      setBookmarks(prev => [...prev, emotion.id]);
      toast.success("Saved to library!");
    } catch (err) {
      toast.error("Failed to save");
    }
  };

  const handleUnsave = async (emotionId) => {
    try {
      const response = await fetch(`http://localhost:3000/bookmarks?emotionId=${emotionId}`);
      const data = await response.json();
      const bookmarkId = data[0]?.id;

      if (!bookmarkId) throw new Error('Bookmark not found');

      await fetch(`http://localhost:3000/bookmarks/${bookmarkId}`, {
        method: 'DELETE',
      });

      setBookmarks(prev => prev.filter(id => id !== emotionId));
      toast.success("Removed from library!");
    } catch (err) {
      toast.error("Failed to remove");
    }
  };

  const handleDelete = async (id) => {
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    try {
      await fetch(`http://localhost:3000/emotions/${deleteId}`, {
        method: 'DELETE',
      });

      setEmotions(prev => prev.filter(emotion => emotion.id !== deleteId));
      setDeleteId(null);
      toast.success("Deleted successfully!");
    } catch (err) {
      toast.error("Failed to delete");
    }
  };

  const filteredEmotions = emotions.filter(emotion => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = !searchTerm || 
      emotion.mediaTitle?.toLowerCase().includes(searchLower) ||
      emotion.description?.toLowerCase().includes(searchLower) ||
      emotion.media?.toLowerCase().includes(searchLower);
    
    const matchesFilter = filter === 'All' || emotion.media === filter;

    return matchesSearch && matchesFilter;
  });

  if (loading) return <div className="content">Loading...</div>;
  if (error) return <div className="content">{error}</div>;

  return (
    <div className="card-grid">
      {deleteId && (
        <div className="delete-confirmation">
          <p>Are you sure you want to delete this emotion?</p>
          <button onClick={confirmDelete} className="confirm-button">YES, DELETE</button>
          <button onClick={() => setDeleteId(null)} className="cancel-button">CANCEL</button>
        </div>
      )}

      {filteredEmotions.length > 0 ? (
        filteredEmotions.map(emotion => (
          <Card
            key={emotion.id}
            emotion={emotion}
            onSave={handleSave}
            onUnsave={handleUnsave}
            onDelete={handleDelete}
            isBookmarked={bookmarks.includes(emotion.id)}
          />
        ))
      ) : (
        <div className="no-emotions">No emotions found</div>
      )}
    </div>
  );
}

export default Home;