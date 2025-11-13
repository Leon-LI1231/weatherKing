package edu.wisc.cs506.WeatherKings.bets.controller;

import edu.wisc.cs506.WeatherKings.bets.model.dto.GeocodeResponse;
import edu.wisc.cs506.WeatherKings.bets.service.GeocodeService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * Controller for city-related operations, primarily geocoding.
 */
@RestController
@RequestMapping("/api/cities")
@CrossOrigin(origins = "http://localhost:5173")
public class CityController {

    private final GeocodeService geocodeService;

    public CityController(GeocodeService geocodeService) {
        this.geocodeService = geocodeService;
    }

    /**
     * Geocodes a city name to coordinates.
     * URL: GET /api/cities/geocode?city=Seattle
     * @param city The city name to geocode
     * @return GeocodeResponse with coordinates and formatted name
     */
    @GetMapping("/geocode")
    public ResponseEntity<?> geocodeCity(@RequestParam String city) {
        try {
            GeocodeResponse response = geocodeService.geocodeCity(city);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            // City not found
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            error.put("suggestion", "Please check the spelling or try a different city name");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        } catch (RuntimeException e) {
            // Service failure
            Map<String, String> error = new HashMap<>();
            error.put("error", "Geocoding service unavailable");
            error.put("message", "Please try again later");
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(error);
        }
    }
}