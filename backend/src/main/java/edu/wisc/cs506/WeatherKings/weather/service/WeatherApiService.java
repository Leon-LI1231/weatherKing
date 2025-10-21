package edu.wisc.cs506.WeatherKings.weather.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;

import edu.wisc.cs506.WeatherKings.weather.dto.PointsResponse;
import edu.wisc.cs506.WeatherKings.weather.dto.WeatherForecastResponse;

/**
 * Service for interacting with the National Weather Service API
 * 
 * This service handles:
 * - Making HTTP calls to weather.gov
 * - The two-step process required by NWS API
 * - Error handling for failed API calls
 * - Adding required User-Agent header
 */
@Service
public class WeatherApiService {
    
    private final RestClient restClient;
    
    /**
     * Constructor - Spring automatically injects values from application.properties
     * 
     * @param baseUrl The base URL for the weather API (https://api.weather.gov)
     * @param userAgent Required User-Agent string for NWS API
     */
    public WeatherApiService(
            @Value("${weather.api.base-url}") String baseUrl,
            @Value("${weather.api.user-agent}") String userAgent) {
        
        // Build RestClient with base configuration
        this.restClient = RestClient.builder()
                .baseUrl(baseUrl)
                .defaultHeader("User-Agent", userAgent)  // Required by NWS API
                .build();
    }
    
    /**
     * Get weather forecast for a specific location
     * 
     * Process:
     * 1. Call /points/{lat},{lon} to get forecast URL
     * 2. Call that URL to get actual forecast data
     * 3. Return forecast with ~14 periods covering ~7 days
     * 
     * @param latitude Latitude coordinate (-90 to 90)
     * @param longitude Longitude coordinate (-180 to 180)
     * @return Complete weather forecast with periods
     * @throws WeatherApiException if API call fails or returns invalid data
     */
    public WeatherForecastResponse getForecast(double latitude, double longitude) {
        try {
            // STEP 1: Get the forecast URL for this coordinate
            // Format: /points/43.0731,-89.4012
            String pointsUrl = String.format("/points/%.4f,%.4f", latitude, longitude);
            
            PointsResponse pointsResponse = restClient.get()
                    .uri(pointsUrl)
                    .retrieve()
                    .body(PointsResponse.class);
            
            // Validate we got a forecast URL
            if (pointsResponse == null || 
                pointsResponse.getProperties() == null || 
                pointsResponse.getProperties().getForecast() == null) {
                throw new WeatherApiException("Failed to get forecast URL from points endpoint");
            }
            
            // STEP 2: Get the actual forecast using the URL from step 1
            // This URL is a full path like: https://api.weather.gov/gridpoints/MKX/123,456/forecast
            String forecastUrl = pointsResponse.getProperties().getForecast();
            
            WeatherForecastResponse forecast = restClient.get()
                    .uri(forecastUrl)
                    .retrieve()
                    .body(WeatherForecastResponse.class);
            
            // Validate we got valid forecast data
            if (forecast == null || 
                forecast.getProperties() == null || 
                forecast.getProperties().getPeriods() == null) {
                throw new WeatherApiException("Invalid forecast response - missing periods data");
            }
            
            return forecast;
            
        } catch (RestClientResponseException e) {
            // Handle HTTP errors (4xx, 5xx status codes)
            throw new WeatherApiException(
                "Weather API request failed: " + e.getStatusCode() + " - " + e.getMessage(), 
                e
            );
        } catch (Exception e) {
            // Handle other errors (network issues, parsing errors, etc.)
            throw new WeatherApiException("Failed to fetch weather data: " + e.getMessage(), e);
        }
    }
    
    /**
     * Custom exception for weather API errors
     * Makes it easy to catch and handle weather-specific errors
     */
    public static class WeatherApiException extends RuntimeException {
        public WeatherApiException(String message) {
            super(message);
        }
        
        public WeatherApiException(String message, Throwable cause) {
            super(message, cause);
        }
    }
}