import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { toast } from 'react-toastify';
import EmotionDetail from '../EmotionDetail';

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  }
}));

const mockEmotion = {
  id: 1,
  mediaTitle: 'Test Media',
  media: 'Movies',
  description: 'Test description',
  rating: 5,
  url: 'https://example.com',
  timestamp: '2024-12-11T12:00:00Z'
};

describe('EmotionDetail Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });

  test('displays loading state initially', async () => {
    global.fetch.mockImplementation(() => 
      new Promise(resolve => {
        setTimeout(() => {
          resolve({
            ok: true,
            json: () => Promise.resolve(mockEmotion)
          });
        }, 100);
      })
    );

    render(
      <MemoryRouter initialEntries={['/emotions/1']}>
        <Routes>
          <Route path="/emotions/:id" element={<EmotionDetail />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });
  });

  test('displays emotion details after loading', async () => {
    global.fetch.mockImplementation(() => 
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockEmotion)
      })
    );

    render(
      <MemoryRouter initialEntries={['/emotions/1']}>
        <Routes>
          <Route path="/emotions/:id" element={<EmotionDetail />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(mockEmotion.mediaTitle)).toBeInTheDocument();
    });

    expect(screen.getByText(mockEmotion.description)).toBeInTheDocument();
    expect(screen.getByText(mockEmotion.media)).toBeInTheDocument();
  });

  test('updates document title', async () => {
    global.fetch.mockImplementation(() => 
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockEmotion)
      })
    );

    render(
      <MemoryRouter initialEntries={['/emotions/1']}>
        <Routes>
          <Route path="/emotions/:id" element={<EmotionDetail />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(document.title).toBe('Test Media | Emotionary');
    });
  });

  test('handles error state', async () => {
    global.fetch.mockImplementation(() => 
      Promise.resolve({
        ok: false,
        status: 404,
        statusText: 'Not Found'
      })
    );

    render(
      <MemoryRouter initialEntries={['/emotions/1']}>
        <Routes>
          <Route path="/emotions/:id" element={<EmotionDetail />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Error/i)).toBeInTheDocument();
    });
    expect(toast.error).toHaveBeenCalled();
  });
});