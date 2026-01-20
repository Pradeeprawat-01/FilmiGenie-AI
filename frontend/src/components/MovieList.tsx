import React from 'react';
import type { Movie } from '../types';

interface MovieListProps {
    movies: Movie[];
}

const MovieList: React.FC<MovieListProps> = ({ movies }) => {
    if (movies.length === 0) {
        return null;
    }

    return (
        <div className="movie-list">
            <h2 className="results-title">
                <span className="title-icon">🎥</span>
                Your Personalized Recommendations
            </h2>
            <div className="movies-grid">
                {movies.map((movie, index) => (
                    <div
                        key={index}
                        className="movie-card"
                        style={{ animationDelay: `${index * 0.1}s` }}
                    >
                        <div className="movie-header">
                            <h3 className="movie-title">{movie.title}</h3>
                            <span className="movie-year">{movie.year}</span>
                        </div>
                        <div className="movie-genres">
                            {movie.genre.split(',').map((genre, i) => (
                                <span key={i} className="genre-tag">
                                    {genre.trim()}
                                </span>
                            ))}
                        </div>
                        <p className="movie-description">{movie.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MovieList;
