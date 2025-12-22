import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CuisineSelector from './components/CuisineSelector';
import DailySuggestion from './components/DailySuggestion';
import WeekProgress from './components/WeekProgress';
import './App.css';

function App() {
  const [preferences, setPreferences] = useState([]);
  const [hasPreferences, setHasPreferences] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const response = await axios.get('/api/preferences');
      const userPrefs = response.data.cuisines || [];
      setPreferences(userPrefs);
      setHasPreferences(userPrefs.length > 0);
      setLoading(false);
    } catch (error) {
      console.error('Error loading preferences:', error);
      setError('Failed to load preferences');
      setLoading(false);
    }
  };

  const handlePreferencesSaved = (newPreferences) => {
    setPreferences(newPreferences);
    setHasPreferences(true);
    setError('');
  };

  const handleResetPreferences = () => {
    setHasPreferences(false);
    setPreferences([]);
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="App">
      <div className="container">
        <div className="header">
          <h1>🍽️ Lunch Buddy</h1>
          <p>Your daily restaurant companion near 787 7th Avenue, NYC</p>
        </div>

        <div className="location-info">
          <h3>📍 Search Area</h3>
          <p>Within 0.5 miles of 787 7th Avenue, New York, NY</p>
          <p>Monday - Friday • 4+ Star Restaurants Only</p>
        </div>

        {error && <div className="error">{error}</div>}

        {!hasPreferences ? (
          <CuisineSelector onPreferencesSaved={handlePreferencesSaved} />
        ) : (
          <>
            <div className="card">
              <h3>Your Preferences</h3>
              <div className="selected-cuisines">
                {preferences.map((cuisine) => (
                  <span key={cuisine} className="cuisine-tag">
                    {cuisine}
                  </span>
                ))}
              </div>
              <button 
                className="button secondary"
                onClick={handleResetPreferences}
              >
                Change Preferences
              </button>
            </div>

            <DailySuggestion />
            <WeekProgress />
          </>
        )}
      </div>
    </div>
  );
}

export default App;