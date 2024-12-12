import { 
  fetchEmotions, 
  createEmotion, 
  deleteEmotion, 
  updateEmotion, 
  saveEmotion, 
  getSavedEmotions,
  getMedia,
  getMediaById
} from "../api";

describe('API Functions', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchEmotions', () => {
    test("fetches emotions successfully", async () => {
      const mockEmotions = [{ id: 1, description: 'Test Emotion' }];
      global.fetch.mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockEmotions)
        })
      );

      const emotions = await fetchEmotions();
      expect(emotions).toEqual(mockEmotions);
      expect(fetch).toHaveBeenCalledWith('http://localhost:4000/emotions');
      expect(fetch).toHaveBeenCalledTimes(1);
    });

    test("handles fetch error", async () => {
      global.fetch.mockImplementationOnce(() =>
        Promise.resolve({ ok: false })
      );

      await expect(fetchEmotions()).rejects.toThrow('Failed to fetch emotions');
    });
  });

  describe('createEmotion', () => {
    const mockEmotionData = {
      title: 'Test Title',
      description: 'Test Description'
    };

    test("creates emotion successfully", async () => {
      const mockResponse = { id: 1, ...mockEmotionData };
      global.fetch.mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockResponse)
        })
      );

      const result = await createEmotion(mockEmotionData);
      expect(result).toEqual(mockResponse);
      expect(fetch).toHaveBeenCalledWith('http://localhost:4000/emotions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: expect.any(String)
      });
    });

    test("handles create error", async () => {
      global.fetch.mockImplementationOnce(() =>
        Promise.resolve({ ok: false })
      );

      await expect(createEmotion(mockEmotionData)).rejects.toThrow('Failed to create emotion');
    });
  });

  describe('deleteEmotion', () => {
    test("deletes emotion successfully", async () => {
      global.fetch.mockImplementationOnce(() =>
        Promise.resolve({ ok: true })
      );

      await deleteEmotion(1);
      expect(fetch).toHaveBeenCalledWith('http://localhost:4000/emotions/1', {
        method: 'DELETE',
      });
    });

    test("handles delete error", async () => {
      global.fetch.mockImplementationOnce(() =>
        Promise.resolve({ ok: false })
      );

      await expect(deleteEmotion(1)).rejects.toThrow('Failed to delete emotion');
    });
  });

  describe('updateEmotion', () => {
    const mockUpdates = { description: 'Updated Description' };

    test("updates emotion successfully", async () => {
      const mockResponse = { id: 1, ...mockUpdates };
      global.fetch.mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockResponse)
        })
      );

      const result = await updateEmotion(1, mockUpdates);
      expect(result).toEqual(mockResponse);
      expect(fetch).toHaveBeenCalledWith('http://localhost:4000/emotions/1', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mockUpdates)
      });
    });

    test("handles update error", async () => {
      global.fetch.mockImplementationOnce(() =>
        Promise.resolve({ ok: false })
      );

      await expect(updateEmotion(1, mockUpdates)).rejects.toThrow('Failed to update emotion');
    });
  });

  describe('saveEmotion', () => {
    test("saves emotion successfully", async () => {
      const mockResponse = { id: 1, userId: 1, emotionId: 1 };
      global.fetch.mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockResponse)
        })
      );

      const result = await saveEmotion(1, 1);
      expect(result).toEqual(mockResponse);
      expect(fetch).toHaveBeenCalledWith('http://localhost:4000/bookmarks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: expect.any(String)
      });
    });

    test("handles save error", async () => {
      global.fetch.mockImplementationOnce(() =>
        Promise.resolve({ ok: false })
      );

      await expect(saveEmotion(1, 1)).rejects.toThrow('Failed to save emotion');
    });
  });

  describe('getSavedEmotions', () => {
    test("fetches saved emotions successfully", async () => {
      const mockSavedEmotions = [{ id: 1, emotionId: 1, userId: 1 }];
      global.fetch.mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockSavedEmotions)
        })
      );

      const result = await getSavedEmotions(1);
      expect(result).toEqual(mockSavedEmotions);
      expect(fetch).toHaveBeenCalledWith('http://localhost:4000/bookmarks?userId=1&_expand=emotion');
    });

    test("handles fetch saved emotions error", async () => {
      global.fetch.mockImplementationOnce(() =>
        Promise.resolve({ ok: false })
      );

      await expect(getSavedEmotions(1)).rejects.toThrow('Failed to fetch saved emotions');
    });
  });

  describe('getMedia', () => {
    test("fetches media successfully", async () => {
      const mockMedia = [{ id: 1, title: 'Test Media' }];
      global.fetch.mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockMedia)
        })
      );

      const result = await getMedia();
      expect(result).toEqual(mockMedia);
      expect(fetch).toHaveBeenCalledWith('http://localhost:4000/media');
    });

    test("handles fetch media error", async () => {
      global.fetch.mockImplementationOnce(() =>
        Promise.resolve({ ok: false })
      );

      await expect(getMedia()).rejects.toThrow('Failed to fetch media');
    });
  });

  describe('getMediaById', () => {
    test("fetches media by id successfully", async () => {
      const mockMedia = { id: 1, title: 'Test Media' };
      global.fetch.mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockMedia)
        })
      );

      const result = await getMediaById(1);
      expect(result).toEqual(mockMedia);
      expect(fetch).toHaveBeenCalledWith('http://localhost:4000/media/1');
    });

    test("handles fetch media by id error", async () => {
      global.fetch.mockImplementationOnce(() =>
        Promise.resolve({ ok: false })
      );

      await expect(getMediaById(1)).rejects.toThrow('Failed to fetch media');
    });
  });
});