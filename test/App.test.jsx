import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('renders weather dashboard', () => {
    render(<App />);
    expect(screen.getByText(/weather dashboard/i)).toBeInTheDocument();
  });

  it('toggles theme mode', () => {
    render(<App />);
    const themeToggle = screen.getByRole('button');
    
    // Initial theme should be light
    expect(document.body).toHaveStyle({ backgroundColor: '#fff' });
    
    // Click toggle
    fireEvent.click(themeToggle);
    
    // Theme should be dark
    expect(document.body).toHaveStyle({ backgroundColor: '#121212' });
  });

  it('persists theme preference', () => {
    // Set initial theme preference
    localStorage.setItem('themeMode', 'dark');
    
    render(<App />);
    
    // Theme should be dark on initial render
    expect(document.body).toHaveStyle({ backgroundColor: '#121212' });
  });
});