package edu.wisc.cs506.WeatherKings;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import edu.wisc.cs506.WeatherKings.weather.dto.WeatherObservation;
import edu.wisc.cs506.WeatherKings.weather.service.WeatherObservationService;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.test.context.ActiveProfiles;


/**
 * Integration tests for WeatherObservationService.
 * Makes REAL API calls to NWS observation stations.
 */
@SpringBootTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.ANY)
@ActiveProfiles("test")
class WeatherObservationServiceTest {

    @Autowired
    private WeatherObservationService observationService;

    @Test
    void testGetObservation_MadisonWI_Success() {
        // Arrange: Madison coordinates
        double lat = 43.0731;
        double lon = -89.4012;

        // Act
        WeatherObservation observation = observationService.getObservationForLocation(lat, lon);

        // Assert
        assertNotNull(observation);
        assertNotNull(observation.getProperties());
        
        System.out.println("\n=== Madison, WI Observation ===");
        
        if (observation.getProperties().getTemperature() != null) {
            Double tempF = observation.getProperties().getTemperature().getValueInFahrenheit();
            assertNotNull(tempF);
            assertTrue(tempF > -50 && tempF < 150, "Temperature should be reasonable");
            System.out.println("✓ Temperature: " + tempF + "°F");
        }
        
        if (observation.getProperties().getTextDescription() != null) {
            System.out.println("✓ Conditions: " + observation.getProperties().getTextDescription());
        }
    }

    @Test
    void testGetObservation_MultipleLocations() {
        double[][] locations = {
            {43.0731, -89.4012},  // Madison, WI
            {40.7128, -74.0060},  // New York, NY
            {34.0522, -118.2437}  // Los Angeles, CA
        };

        String[] cityNames = {"Madison, WI", "New York, NY", "Los Angeles, CA"};

        for (int i = 0; i < locations.length; i++) {
            WeatherObservation obs = observationService.getObservationForLocation(
                locations[i][0],
                locations[i][1]
            );

            assertNotNull(obs, cityNames[i] + " should return observation");
            assertNotNull(obs.getProperties());
            System.out.println("✓ " + cityNames[i] + ": Got observation data");
        }
    }

    @Test
    void testGetObservation_InvalidCoordinates_ThrowsException() {
        // Ocean coordinates - outside NWS coverage
        assertThrows(WeatherObservationService.ObservationException.class, () -> {
            observationService.getObservationForLocation(0.0, 0.0);
        });
    }

    @Test
    void testGetObservation_VerifyTemperatureConversion() {
        double lat = 43.0731;
        double lon = -89.4012;

        WeatherObservation observation = observationService.getObservationForLocation(lat, lon);

        if (observation.getProperties().getTemperature() != null) {
            Double celsius = observation.getProperties().getTemperature().getValue();
            Double fahrenheit = observation.getProperties().getTemperature().getValueInFahrenheit();

            if (celsius != null && fahrenheit != null) {
                // Verify conversion formula: F = C * 9/5 + 32
                Double expectedF = (celsius * 9.0 / 5.0) + 32.0;
                assertEquals(expectedF, fahrenheit, 0.1, "Temperature conversion should be accurate");
                System.out.println("✓ Temperature conversion verified: " + celsius + "°C = " + fahrenheit + "°F");
            }
        }
    }

    @Test
    void testGetObservation_PrecipitationData() {
        double lat = 43.0731;
        double lon = -89.4012;

        WeatherObservation observation = observationService.getObservationForLocation(lat, lon);

        if (observation.getProperties().getPrecipitationLastHour() != null) {
            System.out.println("✓ Precipitation data available");
            
            boolean hasRain = observation.getProperties().getPrecipitationLastHour().hasRain();
            System.out.println("  Has rain: " + hasRain);
        } else {
            System.out.println("⚠ Precipitation data not available for this period");
        }
    }
}