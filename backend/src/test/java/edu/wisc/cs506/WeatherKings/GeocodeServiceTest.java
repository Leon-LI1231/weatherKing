package edu.wisc.cs506.WeatherKings;

import edu.wisc.cs506.WeatherKings.bets.model.dto.GeocodeResponse;
import edu.wisc.cs506.WeatherKings.bets.service.GeocodeService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.ANY)
@ActiveProfiles("test")
public class GeocodeServiceTest {

    @Autowired
    private GeocodeService geocodeService;

    @Test
    public void testGeocodeValidCity() {
        // Test with a well-known city
        GeocodeResponse response = geocodeService.geocodeCity("Seattle, WA");
        
        assertNotNull(response);
        assertNotNull(response.getCityName());
        assertTrue(response.getLatitude() > 47.0 && response.getLatitude() < 48.0);
        assertTrue(response.getLongitude() < -122.0 && response.getLongitude() > -123.0);
    }

    @Test
    public void testGeocodeInvalidCity() {
        // Test with a non-existent city
        assertThrows(IllegalArgumentException.class, () -> {
            geocodeService.geocodeCity("XYZ123InvalidCity");
        });
    }

    @Test
    public void testGeocodeEmptyString() {
        // Test with empty string
        assertThrows(IllegalArgumentException.class, () -> {
            geocodeService.geocodeCity("");
        });
    }

    @Test
    public void testGeocodeNull() {
        // Test with null
        assertThrows(IllegalArgumentException.class, () -> {
            geocodeService.geocodeCity(null);
        });
    }

    @Test
    public void testGeocodeMadison() {
        // Test with Madison since it's one of your default cities
        GeocodeResponse response = geocodeService.geocodeCity("Madison, WI");
        
        assertNotNull(response);
        // Madison coordinates should be close to 43.07, -89.40
        assertTrue(response.getLatitude() > 43.0 && response.getLatitude() < 43.2);
        assertTrue(response.getLongitude() < -89.3 && response.getLongitude() > -89.5);
    }
}