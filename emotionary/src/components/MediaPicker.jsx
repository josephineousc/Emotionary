import React from "react";

export default function MediaPicker({ mediaOptions, selectedMedia, onMediaSelect, onDetailChange }) {
  return (
    <div>
      <label htmlFor="media-type">Select Media Type:</label>
      <select
        id="media-type"
        value={selectedMedia}
        onChange={(e) => onMediaSelect(e.target.value)}
      >
        <option value="">--Select--</option>
        {mediaOptions.map((option) => (
          <option key={option.id} value={option.id}>
            {option.type}: {option.title}
          </option>
        ))}
      </select>

      {selectedMedia && (
        <div>
          <label htmlFor="details">Details (e.g., scene, timestamp, lyrics):</label>
          <textarea
            id="details"
            placeholder="Enter specific details..."
            onChange={(e) => onDetailChange(e.target.value)}
          />
        </div>
      )}
    </div>
  );
}
