# Weather App - Next.js

A beautiful, modern weather application built with Next.js 15, featuring real-time weather data, 5-day forecasts, and a stunning glassmorphic UI.

## Features

- 🌤️ Real-time weather data from OpenWeatherMap API
- 📅 5-day weather forecast
- 🌍 Geolocation detection
- 🌡️ Temperature unit toggle (°C/°F)
- 💎 Glassmorphism UI design
- 📱 Fully responsive
- ⚡ Built with Next.js 15 & TypeScript
- 🎨 Styled with Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 18+ installed
- OpenWeatherMap API key (free tier available)

### Installation

1. **Clone the repository**
   ```bash
   cd weather-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_WEATHER_API_KEY=your_openweathermap_api_key_here
   NEXT_PUBLIC_WEATHER_API_URL=https://api.openweathermap.org/data/2.5
   ```

   **Get your API key:**
   - Sign up at [OpenWeatherMap](https://openweathermap.org/api)
   - Go to API Keys section
   - Copy your API key
   - Paste it in the `.env.local` file

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
weather-app/
├── app/
│   ├── page.tsx           # Main page with weather display
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles & animations
├── components/
│   ├── WeatherSidebar.tsx # Current weather sidebar
│   ├── WeeklyForecast.tsx # 5-day forecast cards
│   ├── SearchInput.tsx    # City search input
│   ├── UnitToggle.tsx     # Temperature unit toggle
│   ├── GlassSkeleton.tsx  # Loading skeleton
│   └── GlassError.tsx     # Error display
├── hooks/
│   ├── useWeather.ts      # Weather data management
│   └── useGeolocation.ts  # Browser geolocation
├── lib/
│   ├── weather-api.ts     # API service layer
│   ├── weather-helpers.ts # Helper functions
│   ├── temperature-converter.ts # Temperature utils
│   └── utils.ts           # General utilities
├── types/
│   └── weather.ts         # TypeScript interfaces
└── .env.local            # Environment variables (create this)
```

##Usage

### Search for a City
- Type a city name in the search bar
- Press Enter or click the search icon
- Weather data will load automatically

### Detect Your Location
- Click the "Detect Location" button
- Allow location access when prompted
- Weather for your location will display

### Toggle Temperature Unit
- Click the °C/°F toggle in the sidebar
- All temperatures will convert instantly

## API Information

This app uses the OpenWeatherMap API:
- **Current Weather**: `/weather` endpoint
- **5-Day Forecast**: `/forecast` endpoint
- **Free Tier**: 1,000 calls/day, 60 calls/minute

## Technologies Used

- [Next.js 15](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Lucide React](https://lucide.dev/) - Icons
- [OpenWeatherMap API](https://openweathermap.org/api) - Weather data

## Features in Detail

### Real-Time Weather
- Current temperature
- Weather conditions
- Humidity percentage
- Wind speed
- "Feels like" temperature

### 5-Day Forecast
- Daily high/low temperatures
- Weather conditions
- Wind speed
- Air quality estimation
- Animated weather icons

### Error Handling
- Invalid city name detection
- Network error recovery
- API failure messages
- Empty input validation

### Loading States
- Animated skeletons while loading
- Smooth transitions
- Loading indicators

## Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## Environment Variables

Required environment variables in `.env.local`:

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_WEATHER_API_KEY` | Your OpenWeatherMap API key | Yes |
| `NEXT_PUBLIC_WEATHER_API_URL` | OpenWeatherMap API base URL | Yes |

## License

This project is open source and available under the MIT License.

## Acknowledgments

- Weather data provided by [OpenWeatherMap](https://openweathermap.org/)
- Icons by [Lucide](https://lucide.dev/)
- Built with [Next.js](https://nextjs.org/)
