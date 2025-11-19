package edu.wisc.cs506.WeatherKings.weather.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import edu.wisc.cs506.WeatherKings.weather.dto.WeatherForecastResponse;
import edu.wisc.cs506.WeatherKings.weather.service.WeatherApiService;
/* REST controller for weather-related endpoints
 * 
 * Provides access to National Weather Service forecast data
 * Follows the same pattern as DummyController
 */
@RestController
@RequestMapping("/api/weather")
@CrossOrigin(origins = "http://localhost:5173")  // Allow frontend to call this
public class WeatherController {
    
    private final WeatherApiService weatherApiService;
    
    // Constructor injection - Spring automatically provides the service
    public WeatherController(WeatherApiService weatherApiService) {
        this.weatherApiService = weatherApiService;
    }
    
    /**
     * Get weather forecast for a location
     * 
     * URL: GET /api/weather/forecast?lat=43.0731&lon=-89.4012
     * 
     * Response: JSON with weather forecast periods containing:
     * - Temperature
     * - Wind speed and direction
     * - Precipitation probability
     * - Detailed forecast text
     * 
     * @param lat Latitude (-90 to 90)
     * @param lon Longitude (-180 to 180)
     * @return Weather forecast or error message
     */
    @GetMapping("/forecast")
    public ResponseEntity<?> getForecast(
            @RequestParam double lat,
            @RequestParam double lon) {
        try {
            // Validate coordinates are in valid range
            if (lat < -90 || lat > 90) {
                return ResponseEntity
                        .badRequest()
                        .body("Invalid latitude: must be between -90 and 90");
            }
            
            if (lon < -180 || lon > 180) {
                return ResponseEntity
                        .badRequest()
                        .body("Invalid longitude: must be between -180 and 180");
            }
            
            // Call service to get forecast
            WeatherForecastResponse forecast = weatherApiService.getForecast(lat, lon);
            
            // Return 200 OK with forecast data
            return ResponseEntity.ok(forecast);
            
        } catch (WeatherApiService.WeatherApiException e) {
            // API call failed - return 502 Bad Gateway
            return ResponseEntity
                    .status(HttpStatus.BAD_GATEWAY)
                    .body("Failed to fetch weather data: " + e.getMessage());
                    
        } catch (Exception e) {
            // Unexpected error - return 500 Internal Server Error
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An unexpected error occurred: " + e.getMessage());
        }
    }
}