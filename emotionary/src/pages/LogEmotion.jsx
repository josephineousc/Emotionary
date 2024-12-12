import React, { useState, useEffect } from "react";
import { createEmotion, fetchMedia } from "../api/api";

function LogEmotion() {
  const [formData, setFormData] = useState({
    mediaId: "",
    emotionType: "",
    description: "",
    timestamp: new Date().toISOString(),
  });
  const [mediaOptions, setMediaOptions] = useState([]);

  useEffect(() => {
    async function loadMedia() {
      const media = await fetchMedia();
      setMediaOptions(media);
    }
    loadMedia();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    createEmotion(formData).then(() => {
      alert("Emotion logged successfully!");
      setFormData({ mediaId: "", emotionType: "", description: "", timestamp: new Date().toISOString() });
    });
  };

  return (
    <div className="container">
      <h1>Log Your Emotion</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Select Media:
          <select
            value={formData.mediaId}
            onChange={(e) => setFormData({ ...formData, mediaId: e.target.value })}
          >
            <option value="">Select Media</option>
            {mediaOptions.map((media) => (
              <option key={media.id} value={media.id}>
                {media.title} ({media.type})
              </option>
            ))}
          </select>
        </label>
        <label>
          Emotion Type:
          <input
            type="text"
            value={formData.emotionType}
            onChange={(e) => setFormData({ ...formData, emotionType: e.target.value })}
          />
        </label>
        <label>
          Description:
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </label>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default LogEmotion;
