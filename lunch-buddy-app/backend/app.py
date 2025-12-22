from flask import Flask, jsonify, request
from flask_cors import CORS
import sqlite3
import requests
import os
from datetime import datetime, timedelta
import json
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Configuration
GOOGLE_API_KEY = os.getenv('GOOGLE_API_KEY', 'your_google_api_key_here')
TARGET_LOCATION = "787 7th Avenue, New York, NY"
TARGET_COORDINATES = (40.7614, -73.9776)  # 787 7th Ave NYC coordinates
SEARCH_RADIUS = 804.67  # 0.5 miles in meters

# Predefined cuisine types
CUISINE_TYPES = [
    'american', 'italian', 'chinese', 'japanese', 'mexican', 'indian',
    'thai', 'french', 'mediterranean', 'greek', 'korean', 'vietnamese',
    'spanish', 'middle_eastern', 'pizza', 'sandwich', 'salad', 'seafood'
]

def init_db():
    """Initialize the SQLite database"""
    conn = sqlite3.connect('lunch_buddy.db')
    cursor = conn.cursor()
    
    # Create tables
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS user_preferences (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            cuisines TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS weekly_suggestions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            week_start DATE NOT NULL,
            day_of_week INTEGER NOT NULL,
            restaurant_id TEXT NOT NULL,
            restaurant_name TEXT NOT NULL,
            restaurant_data TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(week_start, day_of_week)
        )
    ''')
    
    conn.commit()
    conn.close()

def get_week_start():
    """Get the start of the current week (Monday)"""
    today = datetime.now()
    days_since_monday = today.weekday()
    week_start = today - timedelta(days=days_since_monday)
    return week_start.date()

def search_restaurants(cuisine_types, exclude_ids=None):
    """Search for restaurants using Google Places API"""
    if exclude_ids is None:
        exclude_ids = []
    
    # For demo purposes, we'll use a mock response since we don't have a real API key
    # In production, this would make actual API calls to Google Places
    
    mock_restaurants = [
        {
            'place_id': 'mock_1',
            'name': 'Tony\'s Italian Bistro',
            'rating': 4.5,
            'cuisine_type': 'italian',
            'address': '123 7th Ave, New York, NY',
            'price_level': 2,
            'distance': 0.2
        },
        {
            'place_id': 'mock_2', 
            'name': 'Golden Dragon Chinese',
            'rating': 4.3,
            'cuisine_type': 'chinese',
            'address': '456 Broadway, New York, NY',
            'price_level': 1,
            'distance': 0.3
        },
        {
            'place_id': 'mock_3',
            'name': 'Sakura Sushi',
            'rating': 4.7,
            'cuisine_type': 'japanese',
            'address': '789 8th Ave, New York, NY',
            'price_level': 3,
            'distance': 0.4
        },
        {
            'place_id': 'mock_4',
            'name': 'Mediterranean Delight',
            'rating': 4.2,
            'cuisine_type': 'mediterranean',
            'address': '321 9th Ave, New York, NY',
            'price_level': 2,
            'distance': 0.3
        },
        {
            'place_id': 'mock_5',
            'name': 'Spice Garden Indian',
            'rating': 4.4,
            'cuisine_type': 'indian',
            'address': '654 10th Ave, New York, NY',
            'price_level': 2,
            'distance': 0.5
        }
    ]
    
    # Filter by cuisine type and rating
    filtered_restaurants = [
        r for r in mock_restaurants 
        if r['cuisine_type'] in cuisine_types 
        and r['rating'] >= 4.0
        and r['place_id'] not in exclude_ids
    ]
    
    return filtered_restaurants

@app.route('/api/cuisines', methods=['GET'])
def get_cuisines():
    """Get available cuisine types"""
    return jsonify(CUISINE_TYPES)

@app.route('/api/preferences', methods=['POST'])
def set_preferences():
    """Set user cuisine preferences"""
    data = request.get_json()
    cuisines = data.get('cuisines', [])
    
    if not cuisines:
        return jsonify({'error': 'No cuisines selected'}), 400
    
    conn = sqlite3.connect('lunch_buddy.db')
    cursor = conn.cursor()
    
    # Clear existing preferences and set new ones
    cursor.execute('DELETE FROM user_preferences')
    cursor.execute('INSERT INTO user_preferences (cuisines) VALUES (?)', 
                   (json.dumps(cuisines),))
    
    conn.commit()
    conn.close()
    
    return jsonify({'message': 'Preferences saved successfully'})

@app.route('/api/preferences', methods=['GET'])
def get_preferences():
    """Get user cuisine preferences"""
    conn = sqlite3.connect('lunch_buddy.db')
    cursor = conn.cursor()
    
    cursor.execute('SELECT cuisines FROM user_preferences ORDER BY id DESC LIMIT 1')
    result = cursor.fetchone()
    
    conn.close()
    
    if result:
        return jsonify({'cuisines': json.loads(result[0])})
    else:
        return jsonify({'cuisines': []})

@app.route('/api/suggestion', methods=['GET'])
def get_daily_suggestion():
    """Get today's restaurant suggestion"""
    today = datetime.now()
    day_of_week = today.weekday()  # 0=Monday, 1=Tuesday, etc.
    week_start = get_week_start()
    
    # Check if it's weekend
    if day_of_week >= 5:  # Saturday or Sunday
        return jsonify({'message': 'No suggestions on weekends!'}), 200
    
    conn = sqlite3.connect('lunch_buddy.db')
    cursor = conn.cursor()
    
    # Check if we already have a suggestion for today
    cursor.execute('''
        SELECT restaurant_data FROM weekly_suggestions 
        WHERE week_start = ? AND day_of_week = ?
    ''', (week_start, day_of_week))
    
    existing_suggestion = cursor.fetchone()
    
    if existing_suggestion:
        conn.close()
        return jsonify({
            'restaurant': json.loads(existing_suggestion[0]),
            'day': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'][day_of_week]
        })
    
    # Get user preferences
    cursor.execute('SELECT cuisines FROM user_preferences ORDER BY id DESC LIMIT 1')
    prefs_result = cursor.fetchone()
    
    if not prefs_result:
        conn.close()
        return jsonify({'error': 'Please set your cuisine preferences first'}), 400
    
    preferred_cuisines = json.loads(prefs_result[0])
    
    # Get already suggested restaurants this week
    cursor.execute('''
        SELECT restaurant_id FROM weekly_suggestions 
        WHERE week_start = ?
    ''', (week_start,))
    
    used_ids = [row[0] for row in cursor.fetchall()]
    
    # Search for restaurants
    restaurants = search_restaurants(preferred_cuisines, used_ids)
    
    if not restaurants:
        conn.close()
        return jsonify({'error': 'No available restaurants matching your preferences'}), 404
    
    # Select the first available restaurant (in production, could be random)
    selected_restaurant = restaurants[0]
    
    # Save the suggestion
    cursor.execute('''
        INSERT INTO weekly_suggestions 
        (week_start, day_of_week, restaurant_id, restaurant_name, restaurant_data)
        VALUES (?, ?, ?, ?, ?)
    ''', (week_start, day_of_week, selected_restaurant['place_id'], 
          selected_restaurant['name'], json.dumps(selected_restaurant)))
    
    conn.commit()
    conn.close()
    
    return jsonify({
        'restaurant': selected_restaurant,
        'day': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'][day_of_week]
    })

@app.route('/api/week-progress', methods=['GET'])
def get_week_progress():
    """Get the current week's suggestions progress"""
    week_start = get_week_start()
    
    conn = sqlite3.connect('lunch_buddy.db')
    cursor = conn.cursor()
    
    cursor.execute('''
        SELECT day_of_week, restaurant_data FROM weekly_suggestions 
        WHERE week_start = ? ORDER BY day_of_week
    ''', (week_start,))
    
    results = cursor.fetchall()
    conn.close()
    
    week_progress = {}
    days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    
    for day_idx in range(5):
        day_name = days[day_idx]
        week_progress[day_name] = None
    
    for day_of_week, restaurant_data in results:
        day_name = days[day_of_week]
        week_progress[day_name] = json.loads(restaurant_data)
    
    return jsonify(week_progress)

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy', 'timestamp': datetime.now().isoformat()})

if __name__ == '__main__':
    init_db()
    app.run(debug=True, host='0.0.0.0', port=5000)