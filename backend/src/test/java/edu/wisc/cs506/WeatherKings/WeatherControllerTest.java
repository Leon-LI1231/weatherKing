package edu.wisc.cs506.WeatherKings;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.test.context.ActiveProfiles;

/**
 * Integration tests for WeatherController REST endpoints
 * 
 * Tests the HTTP layer - verifies:
 * - Endpoints are accessible
 * - Parameters are validated
 * - Responses have correct structure
 * - Error handling works
 */
@SpringBootTest
@AutoConfigureMockMvc
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.ANY)
@ActiveProfiles("test")
class WeatherControllerTest {

    @Autowired
    private MockMvc mockMvc;

    /**
     * Test successful forecast request
     * Verifies endpoint returns 200 OK with valid JSON structure
     */
    @Test
    void testGetForecast_ValidCoordinates_ReturnsOk() throws Exception {
        mockMvc.perform(get("/api/weather/forecast")
                .param("lat", "43.0731")
                .param("lon", "-89.4012"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.properties").exists())
                .andExpect(jsonPath("$.properties.periods").isArray())
                .andExpect(jsonPath("$.properties.periods[0].name").exists())
                .andExpect(jsonPath("$.properties.periods[0].temperature").exists())
                .andExpect(jsonPath("$.properties.periods[0].temperatureUnit").exists());
    }

    /**
     * Test missing latitude parameter
     * Should return 400 Bad Request
     */
    @Test
    void testGetForecast_MissingLatitude_ReturnsBadRequest() throws Exception {
        mockMvc.perform(get("/api/weather/forecast")
                .param("lon", "-89.4012"))
                .andExpect(status().isBadRequest());
    }
    
    /**
     * Test missing longitude parameter
     * Should return 400 Bad Request
     */
    @Test
    void testGetForecast_MissingLongitude_ReturnsBadRequest() throws Exception {
        mockMvc.perform(get("/api/weather/forecast")
                .param("lat", "43.0731"))
                .andExpect(status().isBadRequest());
    }
    
    /**
     * Test invalid latitude (out of range)
     * Should return 400 Bad Request
     */
    @Test
    void testGetForecast_InvalidLatitude_ReturnsBadRequest() throws Exception {
        mockMvc.perform(get("/api/weather/forecast")
                .param("lat", "999")  // Invalid: must be -90 to 90
                .param("lon", "-89.4012"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$").isString());  // Error message
    }
    
    /**
     * Test invalid longitude (out of range)
     * Should return 400 Bad Request
     */
    @Test
    void testGetForecast_InvalidLongitude_ReturnsBadRequest() throws Exception {
        mockMvc.perform(get("/api/weather/forecast")
                .param("lat", "43.0731")
                .param("lon", "999"))  // Invalid: must be -180 to 180
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$").isString());  // Error message
    }
    
    /**
     * Test coordinates outside NWS coverage (middle of ocean)
     * Should return 502 Bad Gateway (API call will fail)
     */
    @Test
    void testGetForecast_OceanCoordinates_ReturnsBadGateway() throws Exception {
        mockMvc.perform(get("/api/weather/forecast")
                .param("lat", "0.0")
                .param("lon", "0.0"))
                .andExpect(status().isBadGateway())
                .andExpect(jsonPath("$").isString());  // Error message
    }
    
    /**
     * Test multiple valid locations through the API
     * Ensures endpoint works for different US cities
     */
    @Test
    void testGetForecast_MultipleValidLocations() throws Exception {
        // Test Madison, WI
        mockMvc.perform(get("/api/weather/forecast")
                .param("lat", "43.0731")
                .param("lon", "-89.4012"))
                .andExpect(status().isOk());
        
        // Test New York, NY
        mockMvc.perform(get("/api/weather/forecast")
                .param("lat", "40.7128")
                .param("lon", "-74.0060"))
                .andExpect(status().isOk());
        
        // Test Los Angeles, CA
        mockMvc.perform(get("/api/weather/forecast")
                .param("lat", "34.0522")
                .param("lon", "-118.2437"))
                .andExpect(status().isOk());
    }
}