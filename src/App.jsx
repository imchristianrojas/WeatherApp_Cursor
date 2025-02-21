import { ThemeProvider, createTheme } from '@mui/material';
import { useState, useMemo, useEffect } from 'react';
import WeatherDashboard from './WeatherDashboard';
import { CssBaseline, IconButton } from '@mui/material';
import { DarkMode, LightMode } from '@mui/icons-material';

// Weather-based theme configurations
const weatherThemes = {
  Clear: {
    primary: '#FF9800', // Orange for sunny
    secondary: '#FFD700', // Gold
    background: '#FFF9C4', // Light yellow background
  },
  Clouds: {
    primary: '#78909C', // Blue-grey
    secondary: '#90A4AE',
    background: '#ECEFF1',
  },
  Rain: {
    primary: '#0288D1', // Blue
    secondary: '#03A9F4',
    background: '#E1F5FE',
  },
  Snow: {
    primary: '#90A4AE', // Light blue-grey
    secondary: '#B0BEC5',
    background: '#FAFAFA',
  },
  Thunderstorm: {
    primary: '#5E35B1', // Deep purple
    secondary: '#7E57C2',
    background: '#EDE7F6',
  },
  default: {
    primary: '#2196F3', // Default blue
    secondary: '#4CAF50',
    background: '#FFFFFF',
  }
};

function App() {
  const [mode, setMode] = useState(() => {
    const savedMode = localStorage.getItem('themeMode');
    return savedMode || 'light';
  });
  const [weatherCondition, setWeatherCondition] = useState('default');

  useEffect(() => {
    localStorage.setItem('themeMode', mode);
  }, [mode]);

  const theme = useMemo(() => {
    const currentWeatherTheme = weatherThemes[weatherCondition] || weatherThemes.default;
    
    return createTheme({
      palette: {
        mode,
        primary: {
          main: currentWeatherTheme.primary,
        },
        secondary: {
          main: currentWeatherTheme.secondary,
        },
        background: {
          default: mode === 'dark' ? '#121212' : currentWeatherTheme.background,
          paper: mode === 'dark' ? '#1E1E1E' : '#FFFFFF',
        },
      },
    });
  }, [mode, weatherCondition]);

  const toggleColorMode = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <IconButton 
        onClick={toggleColorMode} 
        sx={{ 
          position: 'absolute', 
          top: 16, 
          right: 16,
          bgcolor: 'background.default',
          '&:hover': {
            bgcolor: 'action.hover',
          },
        }}
      >
        {mode === 'dark' ? <LightMode /> : <DarkMode />}
      </IconButton>
      <WeatherDashboard onWeatherChange={condition => setWeatherCondition(condition)} />
    </ThemeProvider>
  );
}

export default App; 