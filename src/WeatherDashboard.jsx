import { useState, useEffect } from 'react';
import { 
  Search as SearchIcon,
  MyLocation as LocationIcon,
  WbSunny as SunIcon,
  DeviceThermostat as TempIcon,
  Air as WindIcon,
  WaterDrop as HumidityIcon,
} from '@mui/icons-material';
import { 
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Switch,
  FormControlLabel,
  Stack,
} from '@mui/material';

import { 
  WbSunny,
  Cloud,
  AcUnit,
  Thunderstorm,
  WaterDrop,
  Air,
} from '@mui/icons-material';

const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;

const WeatherDashboard = ({ onWeatherChange }) => {
  const [isFahrenheit, setIsFahrenheit] = useState(false);
  const [weatherData, setWeatherData] = useState(null);
  const [city, setCity] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (weatherData && weatherData.weather && weatherData.weather[0]) {
      onWeatherChange(weatherData.weather[0].main);
    }
  }, [weatherData, onWeatherChange]);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      setIsLoading(true);
      setError(null);
      navigator.geolocation.getCurrentPosition(
        position => getWeatherByCoords(position.coords.latitude, position.coords.longitude),
        error => {
          setError(`Error getting location: ${error.message}`);
          setIsLoading(false);
        }
      );
    } else {
      setError('Geolocation is not supported by your browser');
    }
  };

  const getWeatherByCoords = async (lat, lon) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
      );

      if (!response.ok) {
        throw new Error('Weather data not found');
      }

      const data = await response.json();
      setWeatherData(data);
      setError(null);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetWeatherData = async () => {
    if (!city) {
      setError('Please enter a city name');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
      );

      if (!response.ok) {
        throw new Error('City not found');
      }

      const data = await response.json();
      setWeatherData(data);
      setError(null);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 3 }}>
          <WbSunny sx={{ fontSize: 40, color: 'primary.main' }} />
          <Typography variant="h4">
            Weather Dashboard
          </Typography>
        </Box>
        
        <Stack direction="row" spacing={2} sx={{ mb: 4 }}>
          <TextField 
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city name"
            size="small"
            InputProps={{
              startAdornment: <SearchIcon sx={{ color: 'action.active', mr: 1 }} />
            }}
          />
          <Button 
            variant="contained" 
            onClick={handleGetWeatherData}
            startIcon={<SearchIcon />}
            disabled={isLoading}
          >
            Search
          </Button>
          <Button 
            variant="contained" 
            color="primary"
            onClick={getCurrentLocation}
            startIcon={<LocationIcon />}
            disabled={isLoading}
          >
            Current Location
          </Button>
          <FormControlLabel
            control={
              <Switch
                checked={isFahrenheit}
                onChange={(e) => setIsFahrenheit(e.target.checked)}
              />
            }
            label={isFahrenheit ? '°F' : '°C'}
          />
        </Stack>

        {isLoading && (
          <Typography textAlign="center">Loading weather data...</Typography>
        )}

        {error && (
          <Typography textAlign="center" color="error">
            {error}
          </Typography>
        )}

        {!isLoading && !error && weatherData ? (
          <Box sx={{ textAlign: 'center' }}>
            <img 
              src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
              alt="Weather icon"
              style={{ width: 100, height: 100 }}
            />
            <Typography variant="h5">{weatherData.name}</Typography>
            <Stack spacing={2} sx={{ mt: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                <TempIcon />
                <Typography>
                  Temperature: {isFahrenheit 
                    ? Math.round(weatherData.main.temp * 9/5 + 32) + '°F'
                    : Math.round(weatherData.main.temp) + '°C'}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                <HumidityIcon />
                <Typography>Humidity: {weatherData.main.humidity}%</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                <SunIcon />
                <Typography>Weather: {weatherData.weather[0].description}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                <WindIcon />
                <Typography>Wind Speed: {weatherData.wind.speed} m/s</Typography>
              </Box>
            </Stack>
          </Box>
        ) : (
          !isLoading && !error && (
            <Typography textAlign="center" color="text.secondary">
              Enter a city name to see the weather information
            </Typography>
          )
        )}
      </Paper>
    </Container>
  );
};

export default WeatherDashboard; 