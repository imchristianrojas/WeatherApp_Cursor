import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import WeatherDashboard from '../src/WeatherDashboard';
import { ThemeProvider, createTheme } from '@mui/material';

// Mock fetch
global.fetch = jest.fn();

const mockWeatherData = {
  name: 'London',
  main: {
    temp: 20,
    humidity: 65,
  },
  weather: [
    {
      main: 'Clear',
      description: 'clear sky',
      icon: '01d'
    }
  ],
  wind: {
    speed: 5
  }
};

// Mock theme provider wrapper
const theme = createTheme();
const Wrapper = ({ children }) => (
  <ThemeProvider theme={theme}>{children}</ThemeProvider>
);

describe('WeatherDashboard', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it('renders initial state correctly', () => {
    render(<WeatherDashboard onWeatherChange={() => {}} />, { wrapper: Wrapper });
    
    expect(screen.getByPlaceholderText(/enter city name/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /current location/i })).toBeInTheDocument();
  });

  it('handles city search correctly', async () => {
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockWeatherData),
      })
    );

    render(<WeatherDashboard onWeatherChange={() => {}} />, { wrapper: Wrapper });
    
    const input = screen.getByPlaceholderText(/enter city name/i);
    const searchButton = screen.getByRole('button', { name: /search/i });

    fireEvent.change(input, { target: { value: 'London' } });
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(screen.getByText('London')).toBeInTheDocument();
      expect(screen.getByText(/temperature:/i)).toBeInTheDocument();
    });
  });

  it('handles temperature unit conversion', async () => {
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockWeatherData),
      })
    );

    render(<WeatherDashboard onWeatherChange={() => {}} />, { wrapper: Wrapper });
    
    // Search for a city first
    const input = screen.getByPlaceholderText(/enter city name/i);
    const searchButton = screen.getByRole('button', { name: /search/i });
    fireEvent.change(input, { target: { value: 'London' } });
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(screen.getByText(/20°C/)).toBeInTheDocument();
    });

    // Toggle temperature unit
    const toggle = screen.getByRole('checkbox');
    fireEvent.click(toggle);

    await waitFor(() => {
      expect(screen.getByText(/68°F/)).toBeInTheDocument();
    });
  });

  it('handles API errors correctly', async () => {
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        status: 404,
      })
    );

    render(<WeatherDashboard onWeatherChange={() => {}} />, { wrapper: Wrapper });
    
    const input = screen.getByPlaceholderText(/enter city name/i);
    const searchButton = screen.getByRole('button', { name: /search/i });

    fireEvent.change(input, { target: { value: 'NonExistentCity' } });
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(screen.getByText(/city not found/i)).toBeInTheDocument();
    });
  });
});