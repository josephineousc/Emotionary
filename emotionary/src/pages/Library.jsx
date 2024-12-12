import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Card from "../components/Card";

function Library({ filter, searchTerm, showTimestamp }) { 
  const [bookmarkedEmotions, setBookmarkedEmotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const bookmarksResponse = await fetch("http://localhost:4000/bookmarks");
        if (!bookmarksResponse.ok) {
          throw new Error(`HTTP error! status: ${bookmarksResponse.status}`);
        }
        const bookmarksData = await bookmarksResponse.json();

        const emotionsResponse = await fetch("http://localhost:4000/emotions");
        if (!emotionsResponse.ok) {
          throw new Error(`HTTP error! status: ${emotionsResponse.status}`);
        }
        const emotionsData = await emotionsResponse.json();

        const bookmarkedEmotions = bookmarksData
          .map(bookmark => ({
            ...emotionsData.find(emotion => emotion.id === bookmark.emotionId),
            bookmarkId: bookmark.id,
            dateBookmarked: bookmark.dateBookmarked
          }))
          .filter(Boolean);

        setBookmarkedEmotions(bookmarkedEmotions);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message);
        toast.error("Failed to load bookmarks.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleUnsave = async (emotionId) => {
    try {
      const bookmarkToRemove = bookmarkedEmotions.find(
        emotion => emotion.id === emotionId
      );

      const response = await fetch(`http://localhost:4000/bookmarks/${bookmarkToRemove.bookmarkId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setBookmarkedEmotions(prev => 
        prev.filter(emotion => emotion.id !== emotionId)
      );
      toast.success("Removed from library!");
    } catch (err) {
      toast.error("Failed to remove");
      console.error("Remove error:", err);
    }
  };

  const handleDelete = async (id) => {
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(`http://localhost:4000/emotions/${deleteId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setBookmarkedEmotions(prev => 
        prev.filter(emotion => emotion.id !== deleteId)
      );
      toast.success("Deleted successfully!");
      setDeleteId(null);
    } catch (err) {
      toast.error("Failed to delete");
      console.error("Delete error:", err);
    }
  };

  const filteredEmotions = bookmarkedEmotions.filter(emotion => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = !searchTerm || 
      emotion.mediaTitle?.toLowerCase().includes(searchLower) ||
      emotion.description?.toLowerCase().includes(searchLower) ||
      emotion.media?.toLowerCase().includes(searchLower);
    
    const matchesFilter = filter === 'All' || emotion.media === filter;

    return matchesSearch && matchesFilter;
  });

  if (loading) return <div className="content">Loading...</div>;
  if (error) return <div className="content">Error: {error}</div>;

  return (
    <div className="card-grid">
      {deleteId && (
        <div className="delete-confirmation">
          <p>Are you sure you want to delete this emotion?</p>
          <button onClick={confirmDelete} className="confirm-button">Yes, Delete</button>
          <button onClick={() => setDeleteId(null)} className="cancel-button">Cancel</button>
        </div>
      )}

      {filteredEmotions.length > 0 ? (
        filteredEmotions.map((emotion) => (
          <div key={emotion.id} className="bookmarked-item">
            {showTimestamp && (
              <div className="bookmark-date">
                Saved on: {new Date(emotion.dateBookmarked).toLocaleDateString()} at{' '}
                {new Date(emotion.dateBookmarked).toLocaleTimeString()}
              </div>
            )}
            <Card
              emotion={emotion}
              onUnsave={handleUnsave}
              onDelete={handleDelete}
              isBookmarked={true}
            />
          </div>
        ))
      ) : (
        <div className="no-emotions">No saved emotions found</div>
      )}
    </div>
  );
}

export default Library;