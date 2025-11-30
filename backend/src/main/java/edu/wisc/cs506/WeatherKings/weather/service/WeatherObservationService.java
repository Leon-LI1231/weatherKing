package edu.wisc.cs506.WeatherKings.weather.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;

import edu.wisc.cs506.WeatherKings.weather.dto.StationResponse;
import edu.wisc.cs506.WeatherKings.weather.dto.WeatherObservation;

/**
 * Service for fetching actual weather observations from NWS stations.
 * Used for resolving bets after weather events occur.
 */
@Service
public class WeatherObservationService {
    
    private final RestClient restClient;
    
    public WeatherObservationService(
            @Value("${weather.api.base-url}") String baseUrl,
            @Value("${weather.api.user-agent}") String userAgent) {
        
        this.restClient = RestClient.builder()
                .baseUrl(baseUrl)
                .defaultHeader("User-Agent", userAgent)
                .build();
    }
    
    /**
     * Get actual weather observation for a location.
     * Finds nearest station and retrieves latest observation.
     */
    public WeatherObservation getObservationForLocation(double latitude, double longitude) {
        try {
            String stationId = findNearestStation(latitude, longitude);
            return getLatestObservation(stationId);
        } catch (Exception e) {
            throw new ObservationException("Failed to get observation: " + e.getMessage(), e);
        }
    }
    
    /**
     * Find nearest weather station for coordinates.
     */
    private String findNearestStation(double latitude, double longitude) {
        try {
            String pointsUrl = String.format("/points/%.4f,%.4f", latitude, longitude);
            
            var pointsResponse = restClient.get()
                    .uri(pointsUrl)
                    .retrieve()
                    .body(edu.wisc.cs506.WeatherKings.weather.dto.PointsResponse.class);
            
            if (pointsResponse == null || pointsResponse.getProperties() == null) {
                throw new ObservationException("Invalid points response");
            }
            
            String forecastUrl = pointsResponse.getProperties().getForecast();
            String[] parts = forecastUrl.split("/");
            String wfo = parts[parts.length - 3];
            String gridX = parts[parts.length - 2].split(",")[0];
            String gridY = parts[parts.length - 2].split(",")[1];
            
            String stationsUrl = String.format("/gridpoints/%s/%s,%s/stations", wfo, gridX, gridY);
            
            StationResponse stationResponse = restClient.get()
                    .uri(stationsUrl)
                    .retrieve()
                    .body(StationResponse.class);
            
            if (stationResponse == null || 
                stationResponse.getObservationStations() == null || 
                stationResponse.getObservationStations().isEmpty()) {
                throw new ObservationException("No stations found");
            }
            
            String stationUrl = stationResponse.getObservationStations().get(0);
            return stationUrl.substring(stationUrl.lastIndexOf('/') + 1);
            
        } catch (RestClientResponseException e) {
            throw new ObservationException("Failed to find station: " + e.getMessage(), e);
        }
    }
    
    /**
     * Get latest observation from a station.
     */
    private WeatherObservation getLatestObservation(String stationId) {
        try {
            String observationUrl = String.format("/stations/%s/observations/latest", stationId);
            
            WeatherObservation observation = restClient.get()
                    .uri(observationUrl)
                    .retrieve()
                    .body(WeatherObservation.class);
            
            if (observation == null || observation.getProperties() == null) {
                throw new ObservationException("Invalid observation response");
            }
            
            return observation;
            
        } catch (RestClientResponseException e) {
            throw new ObservationException("Failed to get observation: " + e.getMessage(), e);
        }
    }
    
    public static class ObservationException extends RuntimeException {
        public ObservationException(String message) {
            super(message);
        }
        
        public ObservationException(String message, Throwable cause) {
            super(message, cause);
        }
    }
}