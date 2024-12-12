import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
  ToastContainer: () => null,
}));

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('App Component', () => {
  test('renders navigation links correctly', () => {
    renderWithRouter(<App />);
    expect(screen.getByText(/Home/i)).toBeInTheDocument();
    expect(screen.getByText(/Library/i)).toBeInTheDocument();
    expect(screen.getByText(/About/i)).toBeInTheDocument();
  });

  test('renders search input', () => {
    renderWithRouter(<App />);
    expect(screen.getByPlaceholderText(/Search/i)).toBeInTheDocument();
  });

  test('renders media type filters', () => {
    renderWithRouter(<App />);
    expect(screen.getByText(/Movies/i)).toBeInTheDocument();
    expect(screen.getByText(/TV/i)).toBeInTheDocument();
    expect(screen.getByText(/Anime/i)).toBeInTheDocument();
    expect(screen.getByText(/Game/i)).toBeInTheDocument();
    expect(screen.getByText(/Music/i)).toBeInTheDocument();
  });

  test('search input updates on change', () => {
    renderWithRouter(<App />);
    const searchInput = screen.getByPlaceholderText(/Search/i);
    fireEvent.change(searchInput, { target: { value: 'test search' } });
    expect(searchInput.value).toBe('test search');
  });

  test('filter changes when clicking filter buttons', () => {
    renderWithRouter(<App />);
    const movieFilter = screen.getByText(/Movies/i);
    fireEvent.click(movieFilter);
    expect(movieFilter).toHaveClass('active');
  });

  describe('Form Validation', () => {
    test('shows error messages when submitting empty form', async () => {
      renderWithRouter(<App />);
      const submitButton = screen.getByText('POST');
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText(/Title is required/i)).toBeInTheDocument();
        expect(screen.getByText(/Please select a media type/i)).toBeInTheDocument();
        expect(screen.getByText(/URL is required/i)).toBeInTheDocument();
        expect(screen.getByText(/Please select a rating/i)).toBeInTheDocument();
        expect(screen.getByText(/Please share your emotional response/i)).toBeInTheDocument();
      });
    });

    test('validates URL format', async () => {
      renderWithRouter(<App />);
      const urlInput = screen.getByPlaceholderText(/URL/i);
      fireEvent.change(urlInput, { target: { value: 'not-a-valid-url' } });
      
      const submitButton = screen.getByText('POST');
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText(/Please enter a valid URL/i)).toBeInTheDocument();
      });
    });

    test('validates minimum description length', async () => {
      renderWithRouter(<App />);
      const descriptionInput = screen.getByPlaceholderText(/How does this media make you feel?/i);
      fireEvent.change(descriptionInput, { target: { value: 'short' } });
      
      const submitButton = screen.getByText('POST');
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText(/Description should be at least 10 characters/i)).toBeInTheDocument();
      });
    });
  });

  test('radio buttons work for rating selection', () => {
    renderWithRouter(<App />);
    const ratingInputs = screen.getAllByRole('radio');
    expect(ratingInputs).toHaveLength(5);
    
    fireEvent.click(ratingInputs[4]);
    expect(ratingInputs[4]).toBeChecked();
  });
});