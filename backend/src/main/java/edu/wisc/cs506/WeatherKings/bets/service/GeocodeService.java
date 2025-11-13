package edu.wisc.cs506.WeatherKings.bets.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import edu.wisc.cs506.WeatherKings.bets.model.dto.GeocodeResponse;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

/**
 * Service for geocoding city names to coordinates using Nominatim (OpenStreetMap).
 */
@Service
public class GeocodeService {

    private static final String NOMINATIM_URL = "https://nominatim.openstreetmap.org/search";
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public GeocodeService() {
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
    }

    /**
     * Geocodes a city name to coordinates.
     * @param cityName The city to search for (e.g., "Seattle, WA" or "Chicago")
     * @return GeocodeResponse with coordinates
     * @throws IllegalArgumentException if city not found
     * @throws RuntimeException if geocoding service fails
     */
    public GeocodeResponse geocodeCity(String cityName) {
        if (cityName == null || cityName.trim().isEmpty()) {
            throw new IllegalArgumentException("City name cannot be empty");
        }

        try {
            // Build the URL with query parameters
            String url = UriComponentsBuilder.fromHttpUrl(NOMINATIM_URL)
                    .queryParam("q", cityName)
                    .queryParam("format", "json")
                    .queryParam("limit", "1")
                    .queryParam("addressdetails", "1")
                    .build()
                    .toUriString();

            // Set User-Agent header (required by Nominatim)
            restTemplate.getInterceptors().add((request, body, execution) -> {
                request.getHeaders().add("User-Agent", "WeatherKings/1.0");
                return execution.execute(request, body);
            });

            // Make the request
            String response = restTemplate.getForObject(url, String.class);
            
            // Parse JSON response
            JsonNode root = objectMapper.readTree(response);
            
            if (root.isEmpty()) {
                throw new IllegalArgumentException("City not found: " + cityName);
            }

            JsonNode firstResult = root.get(0);
            
            // Extract data
            double lat = firstResult.get("lat").asDouble();
            double lon = firstResult.get("lon").asDouble();
            String displayName = firstResult.get("display_name").asText();
            
            // Try to get a cleaner city name from the address details
            JsonNode address = firstResult.get("address");
            String cleanCityName = cityName; // fallback
            if (address != null) {
                String city = address.has("city") ? address.get("city").asText() : null;
                String state = address.has("state") ? address.get("state").asText() : null;
                String country = address.has("country") ? address.get("country").asText() : null;
                
                if (city != null && state != null) {
                    cleanCityName = city + ", " + state;
                } else if (city != null) {
                    cleanCityName = city;
                }
                
                return new GeocodeResponse(cleanCityName, lat, lon, displayName, country);
            }
            
            return new GeocodeResponse(cleanCityName, lat, lon, displayName, "");
            
        } catch (IllegalArgumentException e) {
            throw e; // Re-throw city not found errors
        } catch (Exception e) {
            throw new RuntimeException("Failed to geocode city: " + e.getMessage(), e);
        }
    }
}