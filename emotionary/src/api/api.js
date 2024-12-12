const BASE_URL = 'http://localhost:3000';

export const fetchEmotions = async () => {
  const response = await fetch(`${BASE_URL}/emotions`);
  if (!response.ok) throw new Error('Failed to fetch emotions');
  return response.json();
};

export const createEmotion = async (emotionData) => {
  const response = await fetch(`${BASE_URL}/emotions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...emotionData,
      timestamp: new Date().toISOString(),
    }),
  });
  if (!response.ok) throw new Error('Failed to create emotion');
  return response.json();
};

export const deleteEmotion = async (id) => {
  const response = await fetch(`${BASE_URL}/emotions/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete emotion');
};

export const updateEmotion = async (id, updates) => {
  const response = await fetch(`${BASE_URL}/emotions/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updates),
  });
  if (!response.ok) throw new Error('Failed to update emotion');
  return response.json();
};

export const saveEmotion = async (userId, emotionId) => {
  const response = await fetch(`${BASE_URL}/bookmarks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userId,
      emotionId,
      timestamp: new Date().toISOString(),
    }),
  });
  if (!response.ok) throw new Error('Failed to save emotion');
  return response.json();
};

export const getSavedEmotions = async (userId) => {
  const response = await fetch(`${BASE_URL}/bookmarks?userId=${userId}&_expand=emotion`);
  if (!response.ok) throw new Error('Failed to fetch saved emotions');
  return response.json();
};

export const getMedia = async () => {
  const response = await fetch(`${BASE_URL}/media`);
  if (!response.ok) throw new Error('Failed to fetch media');
  return response.json();
};

export const getMediaById = async (id) => {
  const response = await fetch(`${BASE_URL}/media/${id}`);
  if (!response.ok) throw new Error('Failed to fetch media');
  return response.json();
};