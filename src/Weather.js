import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AnimatedWeather from 'react-animated-weather';

function Weather() {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [unit, setUnit] = useState('C');
  const [searchHistory, setSearchHistory] = useState([]);
  const apiKey = process.env.REACT_APP_API_KEY;

  const iconMappings = {
    '01d': 'CLEAR_DAY',
    '01n': 'CLEAR_NIGHT',
    '02d': 'PARTLY_CLOUDY_DAY',
    '02n': 'PARTLY_CLOUDY_NIGHT',
    '03d': 'CLOUDY',
    '03n': 'CLOUDY',
    '04d': 'CLOUDY',
    '04n': 'CLOUDY',
    '09d': 'RAIN',
    '09n': 'RAIN',
    '10d': 'RAIN',
    '10n': 'RAIN',
    '11d': 'RAIN',
    '11n': 'RAIN',
    '13d': 'SNOW',
    '13n': 'SNOW',
    '50d': 'FOG',
    '50n': 'FOG',
  };

  useEffect(() => {
    const history = localStorage.getItem('weatherSearchHistory');
    if (history) setSearchHistory(JSON.parse(history));
  }, []);

  const updateHistory = (city) => {
    const updated = [...new Set([city, ...searchHistory])];
    setSearchHistory(updated);
    localStorage.setItem('weatherSearchHistory', JSON.stringify(updated));
  };

  const clearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('weatherSearchHistory');
  };
  const fetchWeather = async (query) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const url = typeof query === 'string' 
        ? `https://api.openweathermap.org/data/2.5/weather?q=${query}&units=metric&appid=${apiKey}`
        : `https://api.openweathermap.org/data/2.5/weather?lat=${query.lat}&lon=${query.lon}&units=metric&appid=${apiKey}`;

      const { data } = await axios.get(url);
      setWeatherData(data);
      if (typeof query === 'string') updateHistory(query);
    } catch (err) {
      handleError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleError = (err) => {
    const messages = {
      404: 'City not found. Please try again.',
      401: 'Invalid API key. Please check your configuration.',
      429: 'Too many requests. Please try again later.',
      default: 'Failed to fetch weather data. Please try again later.'
    };
    setError(messages[err.response?.status] || messages.default);
  };

  const getLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => fetchWeather({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      () => setError('Unable to access your location. Please enable permissions.')
    );
  };

  const convertTemp = (temp) => unit === 'C' ? temp : (temp * 9/5) + 32;

  return (
    <div className="weather-container" style={getBackgroundStyle(weatherData?.weather[0]?.main)}>
      <h1>WeatherSphere 🌍</h1>
      
      <div className="controls">
        <form onSubmit={(e) => { e.preventDefault(); fetchWeather(city); }}>
          <div className="input-group">
            <input
              type="text"
              placeholder="Enter city name"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              aria-label="City input"
            />
            <button type="submit" disabled={isLoading}>
              {isLoading ? <div className="spinner" /> : 'Search'}
            </button>
            <button type="button" onClick={getLocation} className="geo-btn">
              📍
            </button>
          </div>
        </form>

        <div className="unit-toggle" onClick={() => setUnit(u => u === 'C' ? 'F' : 'C')}>
          °{unit}
        </div>

      
        {searchHistory.length > 0 && (
        <div className="history">
          {searchHistory.map((city, i) => (
            <button key={i} onClick={() => fetchWeather(city)}>
              {city}
            </button>
          ))}
          <button onClick={clearHistory} className="clear-history">❌ Clear</button>
        </div>
      )}

      </div>

      {error && <div className="error-bubble">{error}</div>}

      {weatherData && (
        <div className="weather-card">
          <div className="main-info">
            <AnimatedWeather
              icon={iconMappings[weatherData.weather[0].icon] || 'CLEAR_DAY'}
              color="#2c3e50"
              size={80}
              animate={true} 
            />
            <h2>
              {weatherData.name}, {weatherData.sys.country}
              <span className="condition">{weatherData.weather[0].description}</span>
            </h2>
            <div className="temperature">
              {Math.round(convertTemp(weatherData.main.temp))}°{unit}
              <span>Feels like {Math.round(convertTemp(weatherData.main.feels_like))}°</span>
            </div>
          </div>
          <div className="details-grid">
            <div className="detail-card">
              <span> Humidity</span>
              {weatherData.main.humidity}%
            </div>
            <div className="detail-card">
              <span>Date</span>
              {new Date(weatherData.dt * 1000).toLocaleDateString()}
            </div>
            <div className="detail-card">
              <span> Wind</span>
              {weatherData.wind.speed} m/s
            </div>
            <div className="detail-card">
              <span>Sky</span>
              {weatherData.weather[0].description}
            </div>
            <div className="detail-card">
              <span> Pressure</span>
              {weatherData.main.pressure} hPa
            </div>
            <div className="detail-card">
              <span>Sunrise</span
              >{new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString()}
            </div>
            <div className="detail-card">
              <span> Sunset</span>
              {new Date(weatherData.sys.sunset * 1000).toLocaleTimeString()}
            </div>
            <div className="detail-card">
              <span> Max Temp</span
              >{weatherData.main.temp_max}°{unit}
              </div>
              <div className="detail-card">
              <span> Min Temp</span>
              {weatherData.main.temp_min}°{unit}
            </div>
            <div className="detail-card">
            <span>Wind speed</span>
            {weatherData.wind.speed} m/s
            </div>
            <div className="detail-card">
              <span>Wind direction</span>
              {weatherData.wind.deg}°
            </div>
            <div className="detail-card">
              <span>Sea_Level</span>
              {weatherData.main.sea_level} hPa
            </div>
                  <div className="detail-card">
              <span>Ground_Level</span>
              {weatherData.main.grnd_level} hPa
            </div>
            <div className="detail-card">
              <span> Visibility</span>
              {(weatherData.visibility / 1000)} km
            </div>
            <div className="detail-card">
              <span>Clouds</span>
              {weatherData.clouds.all}%
              </div>
          
          </div>
        </div>
      )}
      
      <style jsx>{`
        .weather-container {
          min-height: 100vh;
          padding: 2rem;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          transition: background 0.5s ease;
          font-family: 'Segoe UI', sans-serif;
        }

        .controls {
          max-width: 600px;
          margin: 0 auto 2rem;
        }

        .input-group {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1rem;
          
          input {
            flex: 1;
            padding: 1rem;
            border: none;
            border-radius: 25px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            font-size: 1rem;
          }

          button {
            padding: 0 1.5rem;
            border: none;
            border-radius: 25px;
            background: #3498db;
            color: white;
            cursor: pointer;
            transition: all 0.3s ease;

            &:disabled {
              background: #bdc3c7;
              cursor: not-allowed;
            }
          }

          .geo-btn {
            background: #2ecc71;
            padding: 0 1rem;
          }
        }

        .unit-toggle {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: rgba(255,255,255,0.9);
          padding: 0.5rem 1rem;
          border-radius: 20px;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .weather-card {
          max-width: 600px;
          margin: 0 auto;
          background: rgba(255,255,255,0.9);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          padding: 2rem;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
          animation: slideUp 0.5s ease;
        }

        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: none; opacity: 1; }
        }

        .main-info {
          text-align: center;
          margin-bottom: 2rem;

          h2 {
            margin: 1rem 0;
            color: #2c3e50;
          }

          .condition {
            display: block;
            font-size: 1.1rem;
            color: #7f8c8d;
            text-transform: capitalize;
          }

          .temperature {
            font-size: 3.5rem;
            font-weight: bold;
            margin: 1rem 0;

            span {
              display: block;
              font-size: 1.2rem;
              color: #7f8c8d;
            }
          }
        }

        .details-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 1rem;

          .detail-card {
            background: rgba(255,255,255,0.7);
            padding: 1.5rem;
            border-radius: 15px;
            text-align: center;
            transition: transform 0.3s ease;

            &:hover {
              transform: translateY(-5px);
            }

            span {
              display: block;
              margin-bottom: 0.5rem;
              color: #3498db;
              font-weight: 500;
            }
          }
        }

        .error-bubble {
          position: fixed;
          bottom: 2rem;
          left: 50%;
          transform: translateX(-50%);
          background: #e74c3c;
          color: white;
          padding: 1rem 2rem;
          border-radius: 25px;
          animation: fadeIn 0.3s ease;
        }

        .spinner {
          width: 20px;
          height: 20px;
          border: 3px solid rgba(255,255,255,0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 1s ease infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateX(-50%) translateY(20px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
          .clear-history {
  background: #e74c3c;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 15px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.clear-history:hover {
  background: #c0392b;
}


        .history {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
          margin-top: 1rem;

          button {
            background: rgba(255,255,255,0.9);
            border: none;
            padding: 0.5rem 1rem;
            border-radius: 15px;
            cursor: pointer;
            transition: all 0.3s ease;

            &:hover {
              background: #3498db;
              color: white;
            }
          }
        }
      `}</style>
    </div>
  );
}

function getBackgroundStyle(weatherCondition) {
  const conditions = {
    Clear: 'linear-gradient(160deg, #ffd700,rgb(8, 177, 244))',
    Clouds: 'linear-gradient(160deg, #bdc3c7, #7f8c8d)',
    Rain: 'linear-gradient(160deg, #6b6b6b, #2c3e50)',
    Snow: 'linear-gradient(160deg, #ffffff, #a3b1b6)',
    Thunderstorm: 'linear-gradient(160deg, #4a4a4a, #2c3e50)',
    Drizzle: 'linear-gradient(160deg, #7f8c8d, #bdc3c7)',
    Mist: 'linear-gradient(160deg, #dfe6e9, #b2bec3)',
    default: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
  };

  return { background: conditions[weatherCondition] || conditions.default };
}

export default Weather;
