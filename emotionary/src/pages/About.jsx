import React, { useEffect } from "react";

function About() {
  useEffect(() => {
    document.title = "About | Emotionary";
    return () => {
      document.title = "Emotionary";
    };
  }, []);

  return (
    <div className="about-container">
      <h1>About Emotionary</h1>
      
      <section className="about-section">
        <h2>What is Emotionary?</h2>
        <p>
          Emotionary is a platform that allows anyone to share and explore emotional 
          connections with different forms of media. Whether it's a powerful scene 
          from a movie, a touching moment in a video game, or a song that brings back 
          memories, Emotionary provides a space to document and share these emotional 
          responses.
        </p>
      </section>

      <section className="about-section">
        <h2>How It Works</h2>
        <p>
          Users can log their emotional responses to various types of media including:
        </p>
        <ul>
          <li>Movies</li>
          <li>TV Shows</li>
          <li>Anime</li>
          <li>Games</li>
          <li>XR Experiences</li>
          <li>Music</li>
          <li>Social Media</li>
          <li>Photography</li>
        </ul>
        <p>
          Each entry can include a rating, description, and link to the media, 
          allowing others to understand and potentially experience the same emotional 
          connection.
        </p>
      </section>

      <section className="about-section">
        <h2>Join Our Community</h2>
        <p>
          Share your own emotional connections with media and discover how others 
          relate to your favorite content. Build your personal library of meaningful 
          media moments and contribute to our growing community of emotional 
          storytelling.
        </p>
      </section>
    </div>
  );
}

export default About;