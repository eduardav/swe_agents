import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CuisineSelector = ({ onPreferencesSaved }) => {
  const [availableCuisines, setAvailableCuisines] = useState([]);
  const [selectedCuisines, setSelectedCuisines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadCuisines();
  }, []);

  const loadCuisines = async () => {
    try {
      const response = await axios.get('/api/cuisines');
      setAvailableCuisines(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading cuisines:', error);
      setError('Failed to load cuisine options');
      setLoading(false);
    }
  };

  const toggleCuisine = (cuisine) => {
    if (selectedCuisines.includes(cuisine)) {
      setSelectedCuisines(selectedCuisines.filter(c => c !== cuisine));
    } else {
      setSelectedCuisines([...selectedCuisines, cuisine]);
    }
  };

  const savePreferences = async () => {
    if (selectedCuisines.length === 0) {
      setError('Please select at least one cuisine type');
      return;
    }

    setSaving(true);
    setError('');

    try {
      await axios.post('/api/preferences', {
        cuisines: selectedCuisines
      });
      
      onPreferencesSaved(selectedCuisines);
    } catch (error) {
      console.error('Error saving preferences:', error);
      setError('Failed to save preferences. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="card">
        <div className="loading">Loading cuisine options...</div>
      </div>
    );
  }

  return (
    <div className="card">
      <h2>🍴 Choose Your Preferred Cuisines</h2>
      <p>Select the types of food you'd like to see in your daily suggestions:</p>
      
      {error && <div className="error">{error}</div>}

      <div className="cuisine-grid">
        {availableCuisines.map((cuisine) => (
          <div
            key={cuisine}
            className={`cuisine-item ${selectedCuisines.includes(cuisine) ? 'selected' : ''}`}
            onClick={() => toggleCuisine(cuisine)}
          >
            {cuisine}
          </div>
        ))}
      </div>

      <div className="selected-count">
        {selectedCuisines.length} cuisine{selectedCuisines.length !== 1 ? 's' : ''} selected
      </div>

      <button
        className="button"
        onClick={savePreferences}
        disabled={saving || selectedCuisines.length === 0}
      >
        {saving ? 'Saving...' : 'Save Preferences'}
      </button>
    </div>
  );
};

export default CuisineSelector;