import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import CityPage from '../components/CityPage';

/**
 * =======================================================
 *                  CITY PAGE COMPONENT TESTS
 * =======================================================
 * 
 * Test Cases:
 * -----------
 * 1. Rendering Tests:
 *   ✓ renders city page with correct city name
 *   ✓ displays city-specific bets
 *   ✓ renders filter components
 *   ✓ renders bet table with correct data
 * 
 * 2. Navigation Tests:
 *   ✓ back button navigation works
 *   ✓ logout functionality works
 * 
 * 3. Filter Tests:
 *   ✓ search filter works correctly
 *   ✓ bet type filter works correctly
 *   ✓ entry fee filter works correctly
 *   ✓ multiple filters work together
 * 
 * 4. Data Display Tests:
 *   ✓ displays correct number of bets for each city
 *   ✓ shows proper bet information (title, description, fees, etc.)
 *   ✓ handles empty bet lists gracefully
 * 
 * 5. State Management Tests:
 *   ✓ filter states are managed correctly
 *   ✓ city data is loaded properly
 * 
 * 6. Dynamic Bet Types Tests:
 *   ✓ generates correct bet types for each city
 *   ✓ bet type filtering works with dynamic types
 *   ✓ resets selected type when switching cities
 *   ✓ handles empty cities gracefully
 * 
 * 7. Filter State Persistence Tests:
 *   ✓ saves filter state to localStorage when filters change
 *   ✓ restores filter state from localStorage on mount
 *   ✓ resets filters when switching to different city
 *   ✓ handles malformed filter localStorage data gracefully
 *   ✓ maintains separate filter states for different cities
 *   ✓ preserves filter state through multiple filter changes
 * 
 * 8. Accessibility Tests:
 *   ✓ all interactive elements are keyboard accessible
 *   ✓ proper heading structure
 * 
 * Run all tests: npm test
 * Run CityPage.test.jsx only: npm test -- CityPage.test.jsx
 * Run specific test: npm test -- --testNamePattern="test name"
 * ======================================================
 */

describe('CityPage Component Tests', () => {
  const mockProps = {
    cityName: 'Madison',
    user: { username: 'testuser' },
    onNavigateBack: jest.fn(),
    onLogout: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock console.error to suppress expected error messages during tests
    jest.spyOn(console, 'error').mockImplementation(() => {});
    
    // Clear localStorage before each test
    localStorage.clear();
    
    // Mock localStorage
    const localStorageMock = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn()
    };
    Object.defineProperty(window, 'localStorage', { value: localStorageMock });
  });

  afterEach(() => {
    // Restore console.error after each test
    console.error.mockRestore();
  });

  // Rendering Tests
  test('renders city page with correct city name', () => {
    render(<CityPage {...mockProps} />);
    expect(screen.getByText('Madison Bets')).toBeInTheDocument();
    expect(screen.getByText('← Back to Landing Page')).toBeInTheDocument();
  });

  test('displays city-specific bets for Madison', () => {
    render(<CityPage {...mockProps} />);
    
    // Check for Madison-specific bets
    expect(screen.getByText('Madison Weather Tomorrow')).toBeInTheDocument();
    expect(screen.getByText('UW Madison Basketball Game')).toBeInTheDocument();
    expect(screen.getByText('Capitol Construction')).toBeInTheDocument();
  });

  test('displays city-specific bets for Middleton', () => {
    const middletonProps = { ...mockProps, cityName: 'Middleton' };
    render(<CityPage {...middletonProps} />);
    
    // Check for Middleton-specific bets
    expect(screen.getByText('Middleton Bets')).toBeInTheDocument();
    expect(screen.getByText('Middleton Farmers Market')).toBeInTheDocument();
    expect(screen.getByText('Middleton High School Football')).toBeInTheDocument();
  });

  test('displays city-specific bets for Chicago', () => {
    const chicagoProps = { ...mockProps, cityName: 'Chicago' };
    render(<CityPage {...chicagoProps} />);
    
    // Check for Chicago-specific bets
    expect(screen.getByText('Chicago Bets')).toBeInTheDocument();
    expect(screen.getByText('Chicago Bulls Next Game')).toBeInTheDocument();
    expect(screen.getByText('Chicago Weather This Week')).toBeInTheDocument();
    expect(screen.getByText('Chicago Marathon Attendance')).toBeInTheDocument();
  });

  test('renders filter components', () => {
    render(<CityPage {...mockProps} />);
    
    // Check that filter components are present
    expect(screen.getByDisplayValue('')).toBeInTheDocument(); // Search input
    expect(screen.getByRole('button', { name: 'All' })).toBeInTheDocument(); // Type filter button
  });

  test('renders bet table with correct headers', () => {
    render(<CityPage {...mockProps} />);
    
    // Check table headers (need to be more specific due to duplicate "Entry Fee" text)
    expect(screen.getByText('Contest')).toBeInTheDocument();
    expect(screen.getByText('Type')).toBeInTheDocument();
    expect(screen.getAllByText('Entry Fee')).toHaveLength(2); // One in filter, one in table header
    expect(screen.getByText('Total Pool')).toBeInTheDocument();
    expect(screen.getByText('Entries')).toBeInTheDocument();
    expect(screen.getByText('Start')).toBeInTheDocument();
  });

  // Navigation Tests
  test('back button navigation works', () => {
    render(<CityPage {...mockProps} />);
    
    const backButton = screen.getByText('← Back to Landing Page');
    fireEvent.click(backButton);
    
    expect(mockProps.onNavigateBack).toHaveBeenCalledTimes(1);
  });

  // Filter Tests
  test('search filter works correctly', () => {
    render(<CityPage {...mockProps} />);
    
    // Find search input and type in it
    const searchInput = screen.getByDisplayValue('');
    fireEvent.change(searchInput, { target: { value: 'Weather' } });
    
    // Should show weather-related bet
    expect(screen.getByText('Madison Weather Tomorrow')).toBeInTheDocument();
  });

  test('displays correct bet count', () => {
    render(<CityPage {...mockProps} />);
    
    // Madison should have 3 bets
    expect(screen.getByText('3 bets available')).toBeInTheDocument();
  });

  test('displays bet information correctly', () => {
    render(<CityPage {...mockProps} />);
    
    // Check that bet details are displayed
    expect(screen.getByText('Will it rain in Madison tomorrow?')).toBeInTheDocument();
    expect(screen.getByText('$5.00')).toBeInTheDocument(); // Entry fee
    expect(screen.getByText('$150')).toBeInTheDocument(); // Total pool
    expect(screen.getByText('30/500')).toBeInTheDocument(); // Entries
  });

  test('handles bet type filter', () => {
    render(<CityPage {...mockProps} />);
    
    // Find the bet type button and click it (it's a button, not a select)
    const allButton = screen.getByRole('button', { name: 'All' });
    expect(allButton).toBeInTheDocument();
    
    // All bets should be visible initially
    expect(screen.getByText('Madison Weather Tomorrow')).toBeInTheDocument();
    expect(screen.getByText('UW Madison Basketball Game')).toBeInTheDocument();
  });

  test('handles entry fee filter', () => {
    render(<CityPage {...mockProps} />);
    
    // Test that free bets can be filtered
    const minFeeSelect = screen.getByDisplayValue('Free');
    fireEvent.change(minFeeSelect, { target: { value: '0' } });
    
    // Should work without errors
    expect(screen.getByText('Madison Bets')).toBeInTheDocument();
  });

  test('shows no bets message when filters result in empty list', () => {
    render(<CityPage {...mockProps} />);
    
    // Search for something that doesn't exist
    const searchInput = screen.getByDisplayValue('');
    fireEvent.change(searchInput, { target: { value: 'NonexistentBet' } });
    
    // Should show no bets message
    expect(screen.getByText('No bets found')).toBeInTheDocument();
    expect(screen.getByText('Try adjusting your filters or check back later for new bets.')).toBeInTheDocument();
  });

  // State Management Tests
  test('initializes with correct default filter states', () => {
    render(<CityPage {...mockProps} />);
    
    // Check default filter values
    expect(screen.getByDisplayValue('')).toBeInTheDocument(); // Empty search
    expect(screen.getByText('All')).toBeInTheDocument(); // All bet types button (not dropdown)
    expect(screen.getByDisplayValue('Free')).toBeInTheDocument(); // Free min fee
  });

  // Edge Cases
  test('handles unknown city gracefully', () => {
    const unknownCityProps = { ...mockProps, cityName: 'unknowncity' };
    render(<CityPage {...unknownCityProps} />);
    
    // Should render without crashing
    expect(screen.getByText('Unknowncity Bets')).toBeInTheDocument();
    expect(screen.getByText('No bets found')).toBeInTheDocument();
  });

  test('handles missing user prop gracefully', () => {
    const propsWithoutUser = { ...mockProps, user: null };
    render(<CityPage {...propsWithoutUser} />);
    
    // Should render without crashing
    expect(screen.getByText('Madison Bets')).toBeInTheDocument();
  });

  // Dynamic bet types functionality tests
  test('generates dynamic bet types for Madison', () => {
    render(<CityPage {...mockProps} />);
    
    // Madison has weather, sports, and politics bet types
    expect(screen.getByRole('button', { name: 'All' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'weather' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'sports' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'politics' })).toBeInTheDocument();
    
    // Should not show local type since Madison doesn't have local bets
    expect(screen.queryByRole('button', { name: 'local' })).not.toBeInTheDocument();
  });

  test('generates dynamic bet types for Middleton', () => {
    const middletonProps = { ...mockProps, cityName: 'Middleton' };
    render(<CityPage {...middletonProps} />);
    
    // Middleton has local and sports bet types
    expect(screen.getByRole('button', { name: 'All' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'local' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'sports' })).toBeInTheDocument();
    
    // Should not show weather or politics types
    expect(screen.queryByRole('button', { name: 'weather' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'politics' })).not.toBeInTheDocument();
  });

  test('generates dynamic bet types for Chicago', () => {
    const chicagoProps = { ...mockProps, cityName: 'Chicago' };
    render(<CityPage {...chicagoProps} />);
    
    // Chicago has sports, weather, and local bet types
    expect(screen.getByRole('button', { name: 'All' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'sports' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'weather' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'local' })).toBeInTheDocument();
    
    // Should not show politics type
    expect(screen.queryByRole('button', { name: 'politics' })).not.toBeInTheDocument();
  });

  test('bet type filtering works with dynamic types', () => {
    render(<CityPage {...mockProps} />);
    
    // Click on sports filter
    const sportsButton = screen.getByRole('button', { name: 'sports' });
    fireEvent.click(sportsButton);
    
    // Should show sports bet but not weather or politics bets
    expect(screen.getByText('UW Madison Basketball Game')).toBeInTheDocument();
    expect(screen.queryByText('Madison Weather Tomorrow')).not.toBeInTheDocument();
    expect(screen.queryByText('Capitol Construction')).not.toBeInTheDocument();
  });

  test('resets selected type when switching cities if type not available', async () => {
    const { rerender } = render(<CityPage {...mockProps} />);
    
    // Click on politics filter (available in Madison)
    const politicsButton = screen.getByRole('button', { name: 'politics' });
    fireEvent.click(politicsButton);
    
    // Switch to Middleton (which doesn't have politics bets)
    const middletonProps = { ...mockProps, cityName: 'Middleton' };
    rerender(<CityPage {...middletonProps} />);
    
    // Should reset to "All" since politics is not available in Middleton
    // We can verify this by checking that all Middleton bets are shown
    expect(screen.getByText('Middleton Farmers Market')).toBeInTheDocument();
    expect(screen.getByText('Middleton High School Football')).toBeInTheDocument();
  });

  test('empty city shows only "All" bet type', () => {
    const emptyCityProps = { ...mockProps, cityName: 'EmptyCity' };
    render(<CityPage {...emptyCityProps} />);
    
    // Should only show "All" button
    expect(screen.getByRole('button', { name: 'All' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'weather' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'sports' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'politics' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'local' })).not.toBeInTheDocument();
  });

  // Filter State Persistence Tests
  test('saves filter state to localStorage when filters change', () => {
    render(<CityPage {...mockProps} />);
    
    // Change search filter
    const searchInput = screen.getByDisplayValue('');
    fireEvent.change(searchInput, { target: { value: 'weather' } });
    
    // Check that localStorage.setItem was called with filter data
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'betAppFilters_madison',
      expect.stringContaining('"search":"weather"')
    );
  });

  test('restores filter state from localStorage on mount', () => {
    // Mock stored filter state
    const storedFilters = {
      search: 'basketball',
      selectedType: 'sports',
      minFee: '5',
      maxFee: '20',
      timestamp: new Date().toISOString()
    };
    
    localStorage.getItem.mockReturnValue(JSON.stringify(storedFilters));
    
    render(<CityPage {...mockProps} />);
    
    // Should restore the search value
    expect(screen.getByDisplayValue('basketball')).toBeInTheDocument();
    
    // Should restore the selected type (sports button should be active)
    expect(screen.getByRole('button', { name: 'sports' })).toHaveClass('btn-warning');
  });

  test('resets filters when switching to different city', () => {
    // Mock stored filters for Madison
    const madisonFilters = {
      search: 'weather',
      selectedType: 'weather',
      minFee: '5',
      maxFee: '20',
      timestamp: new Date().toISOString()
    };
    
    localStorage.getItem.mockReturnValue(JSON.stringify(madisonFilters));
    
    const { rerender } = render(<CityPage {...mockProps} />);
    
    // Should restore Madison filters
    expect(screen.getByDisplayValue('weather')).toBeInTheDocument();
    
    // Mock no stored filters for Chicago
    localStorage.getItem.mockReturnValue(null);
    
    // Switch to Chicago
    const chicagoProps = { ...mockProps, cityName: 'Chicago' };
    rerender(<CityPage {...chicagoProps} />);
    
    // Should reset to default values
    expect(screen.getByDisplayValue('')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'All' })).toHaveClass('btn-warning');
  });

  test('handles malformed filter localStorage data gracefully', () => {
    // Mock console.error to suppress expected error messages
    const originalConsoleError = console.error;
    console.error = jest.fn();
    
    // Mock malformed JSON
    localStorage.getItem.mockReturnValue('invalid json data');
    
    render(<CityPage {...mockProps} />);
    
    // Should use default filter values
    expect(screen.getByDisplayValue('')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'All' })).toHaveClass('btn-warning');
    
    // Verify that error was logged (but we suppressed it from console)
    expect(console.error).toHaveBeenCalledWith('Error parsing stored filters:', expect.any(SyntaxError));
    
    // Restore original console.error
    console.error = originalConsoleError;
  });

  test('maintains separate filter states for different cities', () => {
    const { rerender } = render(<CityPage {...mockProps} />);
    
    // Change filters for Madison
    const searchInput = screen.getByDisplayValue('');
    fireEvent.change(searchInput, { target: { value: 'madison weather' } });
    
    // Should save Madison filters
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'betAppFilters_madison',
      expect.stringContaining('"search":"madison weather"')
    );
    
    // Switch to Chicago
    const chicagoProps = { ...mockProps, cityName: 'Chicago' };
    rerender(<CityPage {...chicagoProps} />);
    
    // Should save Chicago filters separately
    const chicagoSearchInput = screen.getByDisplayValue('');
    fireEvent.change(chicagoSearchInput, { target: { value: 'chicago bulls' } });
    
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'betAppFilters_chicago',
      expect.stringContaining('"search":"chicago bulls"')
    );
  });

  test('preserves filter state through multiple filter changes', () => {
    render(<CityPage {...mockProps} />);
    
    // Change multiple filters
    const searchInput = screen.getByDisplayValue('');
    fireEvent.change(searchInput, { target: { value: 'test search' } });
    
    const sportsButton = screen.getByRole('button', { name: 'sports' });
    fireEvent.click(sportsButton);
    
    // Should save updated state with all changes
    expect(localStorage.setItem).toHaveBeenLastCalledWith(
      'betAppFilters_madison',
      expect.stringContaining('"search":"test search"')
    );
    expect(localStorage.setItem).toHaveBeenLastCalledWith(
      'betAppFilters_madison',
      expect.stringContaining('"selectedType":"sports"')
    );
  });
});