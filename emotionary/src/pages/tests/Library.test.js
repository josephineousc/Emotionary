// src/pages/__tests__/Library.test.js
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { toast } from 'react-toastify';
import Library from '../Library';

// Mock toastify
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  }
}));

const mockBookmarks = [
  {
    id: 1,
    emotionId: 1,
    dateBookmarked: '2024-12-11T12:00:00Z'
  }
];

const mockEmotions = [
  {
    id: 1,
    mediaTitle: 'Test Media',
    media: 'Movies',
    description: 'Test description',
    rating: 5,
    url: 'https://example.com',
    timestamp: '2024-12-11T12:00:00Z'
  }
];

describe('Library Component', () => {
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
            json: () => Promise.resolve(mockBookmarks)
          });
        }, 100);
      })
    );

    render(
      <BrowserRouter>
        <Library filter="All" searchTerm="" showTimestamp={true} />
      </BrowserRouter>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('displays bookmarked emotions', async () => {
    // Mock both API calls
    global.fetch
      .mockImplementationOnce(() => Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockBookmarks)
      }))
      .mockImplementationOnce(() => Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockEmotions)
      }));

    render(
      <BrowserRouter>
        <Library filter="All" searchTerm="" showTimestamp={true} />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Media')).toBeInTheDocument();
    });
  });

  test('shows timestamp when enabled', async () => {
    global.fetch
      .mockImplementationOnce(() => Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockBookmarks)
      }))
      .mockImplementationOnce(() => Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockEmotions)
      }));

    render(
      <BrowserRouter>
        <Library filter="All" searchTerm="" showTimestamp={true} />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Saved on/i)).toBeInTheDocument();
    });
  });

  test('handles filter and search', async () => {
    global.fetch
      .mockImplementationOnce(() => Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockBookmarks)
      }))
      .mockImplementationOnce(() => Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockEmotions)
      }));

    render(
      <BrowserRouter>
        <Library filter="Movies" searchTerm="Test" showTimestamp={true} />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Media')).toBeInTheDocument();
    });
  });

  test('handles error state', async () => {
    global.fetch.mockImplementation(() => 
      Promise.resolve({
        ok: false,
        status: 500,
        statusText: 'Server Error'
      })
    );

    render(
      <BrowserRouter>
        <Library filter="All" searchTerm="" showTimestamp={true} />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Error/i)).toBeInTheDocument();
    });
    expect(toast.error).toHaveBeenCalled();
  });
});