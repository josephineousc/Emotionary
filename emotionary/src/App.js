import React, { useState, useCallback } from "react";
import { BrowserRouter as Router, Routes, Route, NavLink, useLocation } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import Home from "./pages/Home";
import About from "./pages/About";
import Library from "./pages/Library";
import EmotionDetail from "./pages/EmotionDetail";
import 'react-toastify/dist/ReactToastify.css';
import "./App.css";
import { toast } from "react-toastify";

const Sidebar = React.memo(({ 
  searchTerm, 
  onSearchChange, 
  selectedFilter, 
  onFilterChange, 
  newEmotion, 
  onInputChange, 
  onSubmit,
  mediaTypes,
  showTimestamp,
  onToggleTimestamp,
  errors
}) => {
  const location = useLocation();
  const isAboutPage = location.pathname === '/about';
  const isHomePage = location.pathname === '/';
  const isLibraryPage = location.pathname === '/library';

  return (
    <aside className="sidebar">
      <h1>emotionary</h1>
      <nav>
        <ul className="nav-list">
          <li><NavLink to="/" end>Home</NavLink></li>
          <li><NavLink to="/library">Library</NavLink></li>
          <li><NavLink to="/about">About</NavLink></li>
        </ul>
      </nav>

      {!isAboutPage && (
        <>
          <input 
            type="text" 
            placeholder="Search" 
            className="search-input"
            value={searchTerm}
            onChange={onSearchChange}
          />
          
          <div className="filter-buttons">
            <button
              onClick={() => onFilterChange('All')}
              className={`filter-btn ${selectedFilter === 'All' ? 'active' : ''}`}
            >
              All
            </button>
            {mediaTypes.map(filter => (
              <button
                key={filter}
                onClick={() => onFilterChange(filter)}
                className={`filter-btn ${selectedFilter === filter ? 'active' : ''}`}
              >
                {filter}
              </button>
            ))}
          </div>
        </>
      )}

      {isHomePage && (
        <div className="add-new">
          <h2>Add New</h2>
          <form className="new-form" onSubmit={onSubmit}>
            <div className="form-group">
              <input
                type="text"
                placeholder="Title"
                name="title"
                value={newEmotion.title}
                onChange={onInputChange}
                className={errors.title ? 'input-error' : ''}
              />
              {errors.title && <div className="error-message">{errors.title}</div>}
            </div>

            <div className="form-group">
              <select
                name="media"
                value={newEmotion.media}
                onChange={onInputChange}
                className={errors.media ? 'input-error' : ''}
              >
                <option value="">Select Media</option>
                {mediaTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              {errors.media && <div className="error-message">{errors.media}</div>}
            </div>

            <div className="form-group">
              <input
                type="text"
                placeholder="URL"
                name="url"
                value={newEmotion.url}
                onChange={onInputChange}
                className={errors.url ? 'input-error' : ''}
              />
              {errors.url && <div className="error-message">{errors.url}</div>}
            </div>
            
            <div className="form-group">
              <div className={`rating-radio-group ${errors.rating ? 'input-error' : ''}`}>
                <label className="rating-label">Rating (1-5)</label>
                <div className="rating-options">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <label key={value} className="rating-radio-label">
                      <input
                        type="radio"
                        name="rating"
                        value={value}
                        checked={parseInt(newEmotion.rating) === value}
                        onChange={onInputChange}
                      />
                      <span className="rating-radio-value">{value}</span>
                    </label>
                  ))}
                </div>
              </div>
              {errors.rating && <div className="error-message">{errors.rating}</div>}
            </div>

            <div className="form-group">
              <textarea
                placeholder="How does this media make you feel?"
                name="description"
                value={newEmotion.description}
                onChange={onInputChange}
                className={errors.description ? 'input-error' : ''}
              />
              {errors.description && <div className="error-message">{errors.description}</div>}
            </div>

            <button type="submit">POST</button>
          </form>
        </div>
      )}

      {isLibraryPage && (
        <div className="timestamp-toggle">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={showTimestamp}
              onChange={onToggleTimestamp}
            />
            Show SAVED Timestamp
          </label>
        </div>
      )}
    </aside>
  );
});

function App() {
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [showTimestamp, setShowTimestamp] = useState(true);
  const [newEmotion, setNewEmotion] = useState({
    title: '',
    media: '',
    url: '',
    rating: '',
    description: ''
  });
  const [errors, setErrors] = useState({
    title: '',
    media: '',
    url: '',
    rating: '',
    description: ''
  });

  const mediaTypes = [
    'Movies', 
    'TV', 
    'Anime', 
    'Game', 
    'XR', 
    'Music', 
    'Social Media', 
    'Photography'
  ];

  const validateForm = (data) => {
    const newErrors = {
      title: '',
      media: '',
      url: '',
      rating: '',
      description: ''
    };

    if (!data.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!data.media) {
      newErrors.media = 'Please select a media type';
    }

    if (!data.url.trim()) {
      newErrors.url = 'URL is required';
    } else {
      try {
        new URL(data.url);
      } catch (e) {
        newErrors.url = 'Please enter a valid URL';
      }
    }

    if (!data.rating) {
      newErrors.rating = 'Please select a rating';
    }

    if (!data.description.trim()) {
      newErrors.description = 'Please share your emotional response';
    } else if (data.description.trim().length < 10) {
      newErrors.description = 'Description should be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.values(newErrors).every(error => !error);
  };

  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value);
  }, []);

  const handleFilterChange = useCallback((filter) => {
    setSelectedFilter(filter);
  }, []);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setNewEmotion(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  }, [errors]);

  const handleToggleTimestamp = useCallback((e) => {
    setShowTimestamp(e.target.checked);
  }, []);

  const handleAddEmotion = useCallback(async (e) => {
    e.preventDefault();
  
    if (!validateForm(newEmotion)) {
      toast.error("Please fill out all required fields correctly.");
      return;
    }
  
    const newEmotionData = {
      id: crypto.randomUUID(),
      userId: 1,
      media: newEmotion.media,
      description: newEmotion.description,
      timestamp: new Date().toISOString(),
      rating: parseInt(newEmotion.rating, 10),
      mediaTitle: newEmotion.title,
      url: newEmotion.url,
    };
  
    try {
      const response = await fetch("http://localhost:4000/emotions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newEmotionData),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const savedEmotion = await response.json();
      window.dispatchEvent(new CustomEvent('emotionAdded', { detail: savedEmotion }));
  
      toast.success("Emotion added successfully!");
      setNewEmotion({
        title: "",
        media: "",
        url: "",
        rating: "",
        description: "",
      });
      setErrors({
        title: '',
        media: '',
        url: '',
        rating: '',
        description: ''
      });
    } catch (error) {
      console.error("Error adding emotion:", error);
      toast.error("Failed to add emotion.");
    }
  }, [newEmotion]);

  return (
    <Router>
      <div className="app-container">
        <Sidebar 
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          selectedFilter={selectedFilter}
          onFilterChange={handleFilterChange}
          newEmotion={newEmotion}
          onInputChange={handleInputChange}
          onSubmit={handleAddEmotion}
          mediaTypes={mediaTypes}
          showTimestamp={showTimestamp}
          onToggleTimestamp={handleToggleTimestamp}
          errors={errors}
        />
        <main className="content">
          <Routes>
            <Route path="/" element={<Home filter={selectedFilter} searchTerm={searchTerm} />} />
            <Route path="/emotions/:id" element={<EmotionDetail />} />
            <Route path="/about" element={<About />} />
            <Route 
              path="/library" 
              element={
                <Library 
                  filter={selectedFilter} 
                  searchTerm={searchTerm}
                  showTimestamp={showTimestamp}
                />
              } 
            />
          </Routes>
        </main>
      </div>
      <ToastContainer position="bottom-right" />
    </Router>
  );
}

export default App;