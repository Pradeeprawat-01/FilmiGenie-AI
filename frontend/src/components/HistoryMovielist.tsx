import React, { useState } from 'react';
import type { PreviousRecommendationResponse } from '../types';
import './HistoryMovielist.css';
import { API_URL } from '../App';

interface HistoryMovielistProps {
    recommendations: PreviousRecommendationResponse[];
    onDelete: (id: number) => void;
}

const HistoryMovielist: React.FC<HistoryMovielistProps> = ({ recommendations, onDelete }) => {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [expandedCards, setExpandedCards] = useState<Set<number>>(new Set(recommendations.map(r => r.id)));

    if (recommendations.length === 0) {
        return (
            <div className="history-container">
                <div className="history-header">
                    <h2 className="history-title">
                        <span className="title-icon">📜</span>
                        Previous Recommendations
                    </h2>
                </div>
                <div className="empty-history">
                    <span className="empty-icon">🕸️</span>
                    <h3>No History Yet</h3>
                    <p>Your search history will appear here once you get some recommendations.</p>
                </div>
            </div>
        );
    }

    const toggleViewMode = () => {
        setViewMode(viewMode === 'grid' ? 'list' : 'grid');
    };

    const toggleCard = (id: number) => {
        setExpandedCards(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };

    return (
        <div className="history-container">
            <div className="history-header">
                <h2 className="history-title">
                    <span className="title-icon">📜</span>
                    Previous Recommendations
                </h2>
                <div className="history-header-controls">
                    <span className="history-count">{recommendations.length} {recommendations.length === 1 ? 'search' : 'searches'}</span>
                    <button
                        className="view-toggle-btn"
                        onClick={toggleViewMode}
                        title={`Switch to ${viewMode === 'grid' ? 'list' : 'grid'} view`}
                    >
                        {viewMode === 'grid' ? '📋' : '⊞'}
                    </button>
                </div>
            </div>

            <div className="history-list">
                {recommendations.map((recommendation) => {
                    const isExpanded = expandedCards.has(recommendation.id);
                    return (
                        <div key={recommendation.id} className={`history-card ${isExpanded ? 'expanded' : 'collapsed'}`}>
                            <div
                                className="history-card-header clickable"
                                onClick={() => toggleCard(recommendation.id)}
                            >
                                <div className="user-preference">
                                    <span className="preference-label">You searched for:</span>
                                    <p className="preference-text">"{recommendation.user_input}"</p>
                                </div>
                                <div className="history-card-controls">
                                    <button
                                        className='delete-btn'
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onDelete(recommendation.id);
                                        }}
                                        title="Delete this search"
                                    >
                                        <span className="delete-icon">❌</span>
                                    </button>
                                    <span className="recommendation-id">#{recommendation.id}</span>
                                    <span className={`collapse-icon ${isExpanded ? 'expanded' : ''}`}>
                                        ▼
                                    </span>
                                </div>
                            </div>

                            {isExpanded && (
                                <div className={`history-movies-grid ${viewMode === 'list' ? 'list-view' : ''}`}>
                                    {recommendation.recommended_movies.map((movie, index) => (
                                        <div key={index} className="history-movie-card">
                                            <h4 className="history-movie-title">{movie.title}</h4>
                                            <span className="history-movie-year">{movie.year}</span>
                                            <div className="history-movie-genres">
                                                {movie.genre.split(',').slice(0, 2).map((genre, i) => (
                                                    <span key={i} className="history-genre-tag">
                                                        {genre.trim()}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default HistoryMovielist;