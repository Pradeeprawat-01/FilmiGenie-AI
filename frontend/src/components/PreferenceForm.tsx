import React, { useState } from 'react';

interface PreferenceFormProps {
    onSubmit: (preference: string) => void;
    isLoading: boolean;
}

const PreferenceForm: React.FC<PreferenceFormProps> = ({ onSubmit, isLoading }) => {
    const [preference, setPreference] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (preference.trim()) {
            onSubmit(preference.trim());
        }
    };

    const placeholderExamples = [
        "Action movies with a strong female lead",
        "Sci-fi movies about time travel",
        "Romantic comedies from the 90s",
        "Thriller movies with plot twists",
        "Animated movies for adults"
    ];

    return (
        <form onSubmit={handleSubmit} className="preference-form">
            <div className="input-container">
                <label htmlFor="preference" className="input-label">
                    What kind of movies are you in the mood for?
                </label>
                <textarea
                    id="preference"
                    value={preference}
                    onChange={(e) => setPreference(e.target.value)}
                    placeholder={placeholderExamples[Math.floor(Math.random() * placeholderExamples.length)]}
                    className="preference-input"
                    rows={3}
                    disabled={isLoading}
                />
            </div>
            <button
                type="submit"
                className={`submit-btn ${isLoading ? 'loading' : ''}`}
                disabled={isLoading || !preference.trim()}
            >
                {isLoading ? (
                    <>
                        <span className="spinner"></span>
                        Finding Movies...
                    </>
                ) : (
                    <>
                        <span className="btn-icon">🎬</span>
                        Get Recommendations
                    </>
                )}
            </button>
        </form>
    );
};

export default PreferenceForm;
