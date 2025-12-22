import React, { useState, useEffect } from 'react';
import axios from 'axios';

const WeekProgress = () => {
  const [weekProgress, setWeekProgress] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadWeekProgress();
  }, []);

  const loadWeekProgress = async () => {
    try {
      const response = await axios.get('/api/week-progress');
      setWeekProgress(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading week progress:', error);
      setError('Failed to load week progress');
      setLoading(false);
    }
  };

  const getCurrentDayName = () => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = new Date();
    return days[today.getDay()];
  };

  const isWeekend = () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    return dayOfWeek === 0 || dayOfWeek === 6; // Sunday or Saturday
  };

  if (loading) {
    return (
      <div className="card">
        <div className="loading">Loading week progress...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <div className="error">{error}</div>
      </div>
    );
  }

  const currentDay = getCurrentDayName();
  const workDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  return (
    <div className="card">
      <h3>📊 This Week's Progress</h3>
      <p>Your lunch suggestions for this week:</p>
      
      <div className="week-progress">
        {workDays.map((day) => {
          const restaurant = weekProgress[day];
          const isToday = day === currentDay && !isWeekend();
          const isCompleted = !!restaurant;
          
          return (
            <div
              key={day}
              className={`day-card ${isCompleted ? 'completed' : ''} ${isToday ? 'today' : ''}`}
            >
              <div className="day-name">{day.substr(0, 3)}</div>
              {isCompleted ? (
                <div className="restaurant-summary">
                  <div className="mini-name">{restaurant.name}</div>
                  <div className="mini-rating">⭐ {restaurant.rating}</div>
                </div>
              ) : (
                <div className="no-suggestion">
                  {isToday ? '📍' : '⏳'}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {isWeekend() && (
        <div className="weekend-note">
          <p>🌅 Enjoy your weekend! New suggestions start Monday.</p>
        </div>
      )}

      <button 
        className="button secondary"
        onClick={loadWeekProgress}
      >
        🔄 Refresh Progress
      </button>
    </div>
  );
};

export default WeekProgress;