package edu.wisc.cs506.WeatherKings;

import edu.wisc.cs506.WeatherKings.weather.service.OpenMeteoService;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class OpenMeteoServiceTest {

    @Test
    void londonIsOutsideNwsCoverage() {
        assertTrue(OpenMeteoService.isOutsideNwsCoverage(51.5072, -0.1276));
    }

    @Test
    void usCitiesStayOnNws() {
        assertFalse(OpenMeteoService.isOutsideNwsCoverage(30.2672, -97.7431)); // Austin
        assertFalse(OpenMeteoService.isOutsideNwsCoverage(43.0731, -89.4012)); // Madison
        assertFalse(OpenMeteoService.isOutsideNwsCoverage(34.0522, -118.2437)); // Los Angeles
    }
}
