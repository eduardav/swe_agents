# 🍽️ Lunch Buddy App

A mobile-responsive web application that suggests restaurants within 0.5 miles of 787 7th Avenue, New York, NY for Monday through Friday lunch breaks.

## ✨ Features

- **Location-based search**: Finds restaurants within 0.5 mile radius from 787 7th Avenue, NYC
- **Quality filtering**: Only shows restaurants with 4+ star ratings
- **Cuisine preferences**: Customizable cuisine selection from 18+ options
- **Weekly rotation**: Provides unique suggestions Monday-Friday (no repeats within the week)
- **Mobile-responsive**: Optimized for mobile devices with touch-friendly interface
- **Progress tracking**: Visual weekly progress showing completed and pending suggestions

## 🏗️ Architecture

### Backend (Flask)
- **API Integration**: Ready for Google Places API integration
- **Database**: SQLite for tracking weekly suggestions and user preferences  
- **Smart Logic**: Prevents duplicate suggestions within the same week
- **Mock Data**: Includes sample restaurants for demo purposes

### Frontend (React)
- **Responsive Design**: Mobile-first approach with beautiful gradient UI
- **Component Architecture**: Modular React components
- **State Management**: React hooks for efficient state handling
- **User Experience**: Intuitive interface with visual feedback

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 14+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd lunch-buddy-app
   ```

2. **Set up Backend**
   ```bash
   cd backend
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. **Set up Frontend**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Environment Configuration**
   ```bash
   # In backend directory
   cp .env.template .env
   # Add your Google Places API key to .env file
   ```

### Running the Application

1. **Start Backend Server**
   ```bash
   cd backend
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   python app.py
   ```
   Backend will run on `http://localhost:5000`

2. **Start Frontend Development Server**
   ```bash
   cd frontend
   npm start
   ```
   Frontend will run on `http://localhost:3000`

3. **Open your browser** and navigate to `http://localhost:3000`

## 🎯 How to Use

1. **First Visit**: Select your preferred cuisines from the available options
2. **Daily Suggestions**: Get a new restaurant recommendation each weekday
3. **Weekly Progress**: Track your lunch adventures throughout the week
4. **Change Preferences**: Update your cuisine preferences anytime
5. **Mobile Ready**: Use on your phone during lunch breaks!

## 📱 Mobile Optimization

The app is designed mobile-first with:
- **Responsive Grid Layout**: Adapts to different screen sizes
- **Touch-Friendly Buttons**: Large, easy-to-tap interface elements
- **Optimized Typography**: Readable text on small screens
- **Fast Loading**: Lightweight design for mobile networks

## 🛠️ API Endpoints

### Backend REST API

- `GET /api/health` - Health check
- `GET /api/cuisines` - Get available cuisine types
- `GET /api/preferences` - Get user preferences
- `POST /api/preferences` - Set user preferences
- `GET /api/suggestion` - Get daily restaurant suggestion
- `GET /api/week-progress` - Get current week's progress

### Request/Response Examples

**Set Preferences:**
```bash
curl -X POST http://localhost:5000/api/preferences \
  -H "Content-Type: application/json" \
  -d '{"cuisines": ["italian", "japanese", "mexican"]}'
```

**Get Daily Suggestion:**
```bash
curl http://localhost:5000/api/suggestion
```

Response:
```json
{
  "day": "Monday",
  "restaurant": {
    "name": "Tony's Italian Bistro",
    "address": "123 7th Ave, New York, NY",
    "rating": 4.5,
    "cuisine_type": "italian",
    "distance": 0.2,
    "price_level": 2
  }
}
```

## 🔧 Configuration

### Google Places API Integration

1. Get a Google Places API key from [Google Cloud Console](https://console.cloud.google.com/)
2. Enable the Places API for your project
3. Add the API key to your `.env` file:
   ```
   GOOGLE_API_KEY=your_actual_api_key_here
   ```
4. Update the `search_restaurants()` function in `backend/app.py` to use real API calls

### Available Cuisines

The app supports 18 cuisine types:
- American, Italian, Chinese, Japanese, Mexican, Indian
- Thai, French, Mediterranean, Greek, Korean, Vietnamese  
- Spanish, Middle Eastern, Pizza, Sandwich, Salad, Seafood

## 📊 Database Schema

### Tables

**user_preferences**
- `id`: Primary key
- `cuisines`: JSON array of selected cuisines
- `created_at`: Timestamp

**weekly_suggestions**
- `id`: Primary key
- `week_start`: Week starting date (Monday)
- `day_of_week`: Day index (0=Monday, 4=Friday)
- `restaurant_id`: Unique restaurant identifier
- `restaurant_name`: Restaurant name
- `restaurant_data`: Full restaurant JSON data
- `created_at`: Timestamp

## 🎨 Design System

### Colors
- **Primary**: `#3498db` (Blue)
- **Secondary**: `#95a5a6` (Gray)
- **Background**: Linear gradient (`#667eea` to `#764ba2`)
- **Success**: `#2ecc71` (Green)
- **Warning**: `#f39c12` (Orange)

### Typography
- **Font Family**: System fonts (Apple/San Francisco, Segoe UI, Roboto)
- **Mobile-first**: Responsive font sizes
- **Accessibility**: High contrast ratios

## 🧪 Testing

The application includes:
- **API Testing**: All endpoints tested with curl
- **UI Testing**: Component interaction verified
- **Mobile Testing**: Responsive design validated on mobile viewport
- **User Flow Testing**: Complete preference → suggestion → progress flow

## 📈 Future Enhancements

- **Real-time Data**: Integration with live restaurant APIs
- **User Accounts**: Personal preference saving across devices  
- **Social Features**: Share recommendations with colleagues
- **Advanced Filtering**: Price range, dietary restrictions, ratings
- **Geolocation**: Dynamic location-based suggestions
- **Push Notifications**: Daily lunch reminders

## 🛡️ Security Considerations

- **API Key Management**: Environment variables for sensitive data
- **Input Validation**: Server-side validation for all user inputs
- **CORS Configuration**: Proper cross-origin resource sharing setup
- **Data Sanitization**: Prevention of SQL injection and XSS attacks

## 📝 License

This project is created for educational and demonstration purposes.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For questions or issues, please contact the development team or create an issue in the repository.

---

**Happy Lunching! 🍽️**