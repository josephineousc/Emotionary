import React, { useState } from "react";
import { toast } from "react-toastify";

export default function EmotionLogger({ onSubmit }) {
  const [emotion, setEmotion] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!emotion) newErrors.emotion = "Emotion is required.";
    if (!description) newErrors.description = "Description is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    onSubmit({ emotion, description });
    toast.success("Emotion logged successfully!");
    setEmotion("");
    setDescription("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="emotion">Emotion:</label>
      <select
        id="emotion"
        value={emotion}
        onChange={(e) => setEmotion(e.target.value)}
      >
        <option value="">--Select--</option>
        <option value="joy">Joy</option>
        <option value="sadness">Sadness</option>
        <option value="awe">Awe</option>
        <option value="nostalgia">Nostalgia</option>
        <option value="inspiration">Inspiration</option>
      </select>
      {errors.emotion && <span className="error">{errors.emotion}</span>}

      <label htmlFor="description">Description:</label>
      <textarea
        id="description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      {errors.description && <span className="error">{errors.description}</span>}

      <button type="submit">Log Emotion</button>
    </form>
  );
}
