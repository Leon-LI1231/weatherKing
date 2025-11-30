package edu.wisc.cs506.WeatherKings;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import edu.wisc.cs506.WeatherKings.weather.dto.WeatherForecastResponse;
import edu.wisc.cs506.WeatherKings.weather.dto.WeatherForecastResponse.Period;
import edu.wisc.cs506.WeatherKings.weather.service.WeatherApiService;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.test.context.ActiveProfiles;

/**
 * Integration tests for WeatherApiService
 * 
 * These tests make REAL API calls to weather.gov
 * They verify:
 * - API integration works
 * - Response structure is correct
 * - We get all data needed for betting
 */
@SpringBootTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.ANY)
@ActiveProfiles("test")
class WeatherApiServiceTest {

    @Autowired
    private WeatherApiService weatherApiService;

    /**
     * Test basic forecast retrieval for Madison, WI
     * Verifies we can successfully call the API and get valid data
     */
    @Test
    void testGetForecast_MadisonWI_Success() {
        // Arrange: Madison, WI coordinates
        double lat = 43.0731;
        double lon = -89.4012;
        
        // Act: Call the API
        WeatherForecastResponse response = weatherApiService.getForecast(lat, lon);
        
        // Assert: Verify response structure
        assertNotNull(response, "Response should not be null");
        assertNotNull(response.getProperties(), "Properties should not be null");
        assertNotNull(response.getProperties().getPeriods(), "Periods should not be null");
        assertFalse(response.getProperties().getPeriods().isEmpty(), "Periods should not be empty");
        
        // Assert: Verify first period has expected data
        Period firstPeriod = response.getProperties().getPeriods().get(0);
        assertNotNull(firstPeriod.getName(), "Period name should not be null");
        assertNotNull(firstPeriod.getTemperature(), "Temperature should not be null");
        assertNotNull(firstPeriod.getTemperatureUnit(), "Temperature unit should not be null");
        assertNotNull(firstPeriod.getShortForecast(), "Short forecast should not be null");
        
        // Log data for manual verification
        System.out.println("\n=== Madison, WI Forecast ===");
        System.out.println("Period: " + firstPeriod.getName());
        System.out.println("Temperature: " + firstPeriod.getTemperature() + "°" + firstPeriod.getTemperatureUnit());
        System.out.println("Forecast: " + firstPeriod.getShortForecast());
    }

    /**
     * Test multiple US locations to ensure API works across different regions
     */
    @Test
    void testGetForecast_MultipleLocations_AllSucceed() {
        // Test different US cities
        double[][] locations = {
            {43.0731, -89.4012},  // Madison, WI
            {40.7128, -74.0060},  // New York, NY
            {34.0522, -118.2437}  // Los Angeles, CA
        };
        
        String[] cityNames = {"Madison, WI", "New York, NY", "Los Angeles, CA"};
        
        for (int i = 0; i < locations.length; i++) {
            WeatherForecastResponse response = weatherApiService.getForecast(
                locations[i][0], 
                locations[i][1]
            );
            
            assertNotNull(response, cityNames[i] + " should return data");
            assertNotNull(response.getProperties());
            assertTrue(response.getProperties().getPeriods().size() > 0, 
                      cityNames[i] + " should have forecast periods");
            
            System.out.println("✓ " + cityNames[i] + ": Got " + 
                             response.getProperties().getPeriods().size() + " periods");
        }
    }

    /**
     * Test that invalid coordinates throw an exception
     * Coordinates in the ocean (outside NWS coverage) should fail
     */
    @Test
    void testGetForecast_InvalidCoordinates_ThrowsException() {
        // Middle of the ocean - outside NWS coverage area
        double lat = 0.0;
        double lon = 0.0;
        
        assertThrows(WeatherApiService.WeatherApiException.class, () -> {
            weatherApiService.getForecast(lat, lon);
        }, "Should throw exception for coordinates outside US coverage");
    }
    
    /**
     * CRITICAL TEST: Verify we get all data fields needed for betting
     * This ensures our DTOs capture everything we need
     */
    @Test
    void testGetForecast_VerifyBettingDataFields() {
        double lat = 43.0731;
        double lon = -89.4012;
        
        WeatherForecastResponse response = weatherApiService.getForecast(lat, lon);
        Period firstPeriod = response.getProperties().getPeriods().get(0);
        
        System.out.println("\n=== Betting-Relevant Weather Data ===");
        
        // 1. TEMPERATURE (for over/under bets)
        assertNotNull(firstPeriod.getTemperature(), "Must have temperature");
        assertTrue(firstPeriod.getTemperature() > -100 && firstPeriod.getTemperature() < 150, 
                   "Temperature should be in reasonable range");
        System.out.println("✓ Temperature: " + firstPeriod.getTemperature() + 
                          "°" + firstPeriod.getTemperatureUnit());
        
        // 2. WIND DATA (for wind speed/direction bets)
        if (firstPeriod.getWindSpeed() != null) {
            System.out.println("✓ Wind Speed: " + firstPeriod.getWindSpeed());
        } else {
            System.out.println("⚠ Wind Speed: Not available for this period");
        }
        
        if (firstPeriod.getWindDirection() != null) {
            System.out.println("✓ Wind Direction: " + firstPeriod.getWindDirection());
        } else {
            System.out.println("⚠ Wind Direction: Not available for this period");
        }
        
        // 3. PRECIPITATION PROBABILITY (for rain/snow bets)
        if (firstPeriod.getProbabilityOfPrecipitation() != null && 
            firstPeriod.getProbabilityOfPrecipitation().getValue() != null) {
            Integer precipProb = firstPeriod.getProbabilityOfPrecipitation().getValue();
            System.out.println("✓ Precipitation Probability: " + precipProb + "%");
            assertTrue(precipProb >= 0 && precipProb <= 100, 
                      "Precipitation probability should be 0-100");
        } else {
            System.out.println("⚠ Precipitation Probability: Not available for this period");
        }
        
        // 4. DETAILED FORECAST (for conditions bets)
        assertNotNull(firstPeriod.getDetailedForecast(), "Must have detailed forecast");
        System.out.println("✓ Detailed Forecast: " + firstPeriod.getDetailedForecast());
        
        // 5. SHORT FORECAST (quick summary)
        assertNotNull(firstPeriod.getShortForecast(), "Must have short forecast");
        System.out.println("✓ Short Forecast: " + firstPeriod.getShortForecast());
    }
    
    /**
     * Verify we get multiple forecast periods for multi-day bets
     * NWS typically provides ~14 periods covering ~7 days
     */
    @Test
    void testGetForecast_MultiplePeriodsAvailable() {
        double lat = 43.0731;
        double lon = -89.4012;
        
        WeatherForecastResponse response = weatherApiService.getForecast(lat, lon);
        
        int periodCount = response.getProperties().getPeriods().size();
        
        assertTrue(periodCount >= 7, 
                   "Should have at least 7 forecast periods (got " + periodCount + ")");
        
        System.out.println("\n✓ Received " + periodCount + " forecast periods");
        
        // Print first few period names to verify coverage
        System.out.println("Periods available:");
        for (int i = 0; i < Math.min(5, periodCount); i++) {
            Period period = response.getProperties().getPeriods().get(i);
            System.out.println("  " + (i+1) + ". " + period.getName() + 
                             " - " + period.getTemperature() + "°" + 
                             period.getTemperatureUnit());
        }
    }
}