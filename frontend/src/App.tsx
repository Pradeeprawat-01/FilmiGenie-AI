import { useEffect, useState } from 'react';
import PreferenceForm from './components/PreferenceForm';
import MovieList from './components/MovieList';
import HistoryMovielist from './components/HistoryMovielist';
import type { Movie, PreviousRecommendationResponse, RecommendationResponse } from './types';
import './App.css';

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [previousRecomendation, setPreviousRecomendation] = useState<PreviousRecommendationResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await fetch(`${API_URL}/api/recommendations`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data: PreviousRecommendationResponse[] = await response.json();
        setPreviousRecomendation(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchRecommendations();
  }, []);

  const handleSubmit = async (preference: string) => {
    setIsLoading(true);
    setError(null);
    setMovies([]);

    try {
      const response = await fetch(`${API_URL}/api/recommend`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ preference }),
      });

      if (!response.ok) {
        throw new Error('Failed to get recommendations');
      }

      const data: RecommendationResponse = await response.json();
      setMovies(data.movies);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteRecommendation = async (id: number) => {
    try {
      await fetch(`${API_URL}/api/recommendations/${id}`, {
        method: 'DELETE',
      });
      setPreviousRecomendation((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error('Failed to delete recommendation:', error);
    }
  };

  return (
    <div className="app">

      <header className="header">
        <div className="logo">
          <span className="logo-icon">🎬</span>
          <h1>FilmiGenie AI</h1>
        </div>
        <p className="tagline">Discover your next favorite movie with AI-powered recommendations</p>
      </header>

      <main className="main-content">
        <div className="content-card">
          <PreferenceForm onSubmit={handleSubmit} isLoading={isLoading} />

          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          <MovieList movies={movies} />
        </div>
        <div className="content-card histCard">
          <HistoryMovielist recommendations={previousRecomendation} onDelete={handleDeleteRecommendation} />
        </div>
      </main>

      <footer className="footer">
        <p>Made with ❤️ For Acelucid</p>
        <div className="footer-contact">
          <p className="dev-name">Developed by <strong>Pradeep Singh Rawat</strong></p>
          <p className="contact-info">
            ✉️ <a href="mailto:pradeepsrawat1109@gmail.com">pradeepsrawat1109@gmail.com</a>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
