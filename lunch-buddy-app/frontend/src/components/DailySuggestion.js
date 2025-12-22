import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DailySuggestion = () => {
  const [suggestion, setSuggestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentDay, setCurrentDay] = useState('');

  useEffect(() => {
    loadSuggestion();
    setCurrentDay(getCurrentDay());
  }, []);

  const getCurrentDay = () => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = new Date();
    return days[today.getDay()];
  };

  const loadSuggestion = async () => {
    try {
      const response = await axios.get('/api/suggestion');
      
      if (response.data.message) {
        // Weekend or no suggestion message
        setSuggestion({ message: response.data.message });
      } else {
        setSuggestion(response.data);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error loading suggestion:', error);
      if (error.response && error.response.status === 400) {
        setError('Please set your cuisine preferences first');
      } else if (error.response && error.response.status === 404) {
        setError('No available restaurants matching your preferences. Try adjusting your cuisine selection.');
      } else {
        setError('Failed to load today\'s suggestion');
      }
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="card">
        <div className="loading">Finding your perfect lunch spot...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <div className="error">{error}</div>
        <button className="button" onClick={loadSuggestion}>
          Try Again
        </button>
      </div>
    );
  }

  // Weekend message
  if (suggestion && suggestion.message) {
    return (
      <div className="card weekend-message">
        <h2>🌅 {suggestion.message}</h2>
        <p>Enjoy your weekend! We'll be back with suggestions on Monday.</p>
      </div>
    );
  }

  // No suggestion available
  if (!suggestion || !suggestion.restaurant) {
    return (
      <div className="card no-suggestion">
        <h2>🤔 No suggestion available</h2>
        <p>We couldn't find a restaurant for today. Please try again later.</p>
        <button className="button" onClick={loadSuggestion}>
          Try Again
        </button>
      </div>
    );
  }

  const { restaurant, day } = suggestion;

  return (
    <>
      <div className="today-banner">
        📅 {currentDay === day ? 'Today' : day}'s Lunch Recommendation
      </div>
      
      <div className="card restaurant-card daily-suggestion-card">
        <div className="restaurant-name">{restaurant.name}</div>
        
        <div className="restaurant-details">
          <div>📍 {restaurant.address}</div>
          <div>🚶 {restaurant.distance} miles away</div>
          <div>💰 Price Level: {'$'.repeat(restaurant.price_level || 1)}</div>
        </div>

        <div style={{ marginTop: '15px' }}>
          <span className="rating">⭐ {restaurant.rating}</span>
          <span className="cuisine-tag">{restaurant.cuisine_type}</span>
        </div>

        <button 
          className="button"
          onClick={loadSuggestion}
          style={{ marginTop: '20px', background: 'rgba(255,255,255,0.2)' }}
        >
          🔄 Refresh
        </button>
      </div>
    </>
  );
};

export default DailySuggestion;