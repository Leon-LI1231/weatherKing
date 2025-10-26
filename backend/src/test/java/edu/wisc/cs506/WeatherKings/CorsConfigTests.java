package edu.wisc.cs506.WeatherKings;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.Test;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

class CorsConfigTests {

    @Test
    void testCorsMapping() {
        // ensure no exceptions
        CorsConfig c = new CorsConfig();
        CorsRegistry r = new CorsRegistry();
        assertDoesNotThrow(() -> c.addCorsMappings(r));
    }
}