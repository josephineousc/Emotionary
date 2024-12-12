import React, { useState, useEffect } from "react";
import ReactionList from "../components/ReactionList";
import { fetchEmotions, fetchMedia } from "../api/api";

function Search() {
  const [searchTerm, setSearchTerm] = useState("");
  const [mediaType, setMediaType] = useState("");
  const [reactions, setReactions] = useState([]);
  const [mediaTypes, setMediaTypes] = useState([]);

  useEffect(() => {
    async function loadData() {
      const emotions = await fetchEmotions();
      const media = await fetchMedia();

      if (emotions && media) {
        const reactionsWithMedia = emotions.map((reaction) => {
          const mediaItem = media.find((m) => m.id === reaction.mediaId);
          return {
            ...reaction,
            mediaTitle: mediaItem?.title || "Unknown",
            mediaType: mediaItem?.type || "Unknown",
          };
        });

        setReactions(reactionsWithMedia);
        setMediaTypes([...new Set(media.map((item) => item.type))]);
      }
    }
    loadData();
  }, []);

  const filteredReactions = reactions.filter((reaction) =>
    (reaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reaction.mediaTitle.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (!mediaType || reaction.mediaType === mediaType)
  );

  return (
    <div className="container">
      <h1>Search Reactions</h1>
      <input
        type="text"
        placeholder="Search by keywords or media title..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <select value={mediaType} onChange={(e) => setMediaType(e.target.value)}>
        <option value="">All Media Types</option>
        {mediaTypes.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>
      {filteredReactions.length > 0 ? (
        <ReactionList reactions={filteredReactions} />
      ) : (
        <p>No reactions found.</p>
      )}
    </div>
  );
}

export default Search;
