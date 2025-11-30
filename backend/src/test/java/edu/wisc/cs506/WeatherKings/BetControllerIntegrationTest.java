package edu.wisc.cs506.WeatherKings.bets.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import edu.wisc.cs506.WeatherKings.bets.model.Bet;
import edu.wisc.cs506.WeatherKings.bets.model.dto.BetGenerationRequest;
import edu.wisc.cs506.WeatherKings.bets.repository.BetRepository;
import edu.wisc.cs506.WeatherKings.bets.util.DateUtil;
import edu.wisc.cs506.WeatherKings.weather.dto.WeatherForecastResponse;
import edu.wisc.cs506.WeatherKings.weather.dto.WeatherForecastResponse.Period;
import edu.wisc.cs506.WeatherKings.weather.service.WeatherApiService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.anyDouble;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;


/**
 * Integration tests for BetController.
 * This test uses the full Spring context but mocks the external NWS API calls.
 */
@SpringBootTest
@AutoConfigureMockMvc
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.ANY)
@Transactional // Ensures each test rolls back DB changes
class BetControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private BetRepository betRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private WeatherApiService weatherApiService;

    private WeatherForecastResponse mockForecast;

    // FIX: The correct odds for a 52F forecast against a 50.0 line is 269.83.
    private static final BigDecimal EXPECTED_TEMP_ODDS = new BigDecimal("269.83"); 
    
    // Coordinates from BetGenerationService.java for explicit mocking
    private static final double MADISON_LAT = 43.0731;
    private static final double MADISON_LON = -89.4012;
    private static final double LA_LAT = 34.0522;
    private static final double LA_LON = -118.2437;
    private static final double NYC_LAT = 40.7128;
    private static final double NYC_LON = -74.0060;
    
    // Test city coordinates
    private static final double SEATTLE_LAT = 47.6062;
    private static final double SEATTLE_LON = -122.3321;

    @BeforeEach
    void setup() {
        betRepository.deleteAll();
        
        // Setup mock weather data (52F -> 50.0 line)
        Period tomorrowForecast = new Period();
        tomorrowForecast.setName("Tomorrow");
        tomorrowForecast.setTemperature(52); // This value results in a 50.0 line
        tomorrowForecast.setShortForecast("Mostly Sunny");

        WeatherForecastResponse.ProbabilityValue lowPrecip = new WeatherForecastResponse.ProbabilityValue();
        lowPrecip.setValue(35); 
        tomorrowForecast.setProbabilityOfPrecipitation(lowPrecip);
        
        // Mock the periods list to ensure the BetGenerationService finds the correct one (period index 2)
        WeatherForecastResponse.Properties props = new WeatherForecastResponse.Properties();
        props.setPeriods(List.of(new Period(), new Period(), tomorrowForecast)); 

        mockForecast = new WeatherForecastResponse();
        mockForecast.setProperties(props);

        // Explicitly mock the forecast for each city using its specific coordinates.
        when(weatherApiService.getForecast(MADISON_LAT, MADISON_LON)).thenReturn(mockForecast); 
        when(weatherApiService.getForecast(LA_LAT, LA_LON)).thenReturn(mockForecast);
        when(weatherApiService.getForecast(NYC_LAT, NYC_LON)).thenReturn(mockForecast);
        when(weatherApiService.getForecast(SEATTLE_LAT, SEATTLE_LON)).thenReturn(mockForecast);
        
        // Safety mock for any other coordinates
        when(weatherApiService.getForecast(anyDouble(), anyDouble())).thenReturn(mockForecast); 
    }

    /**
     * Tests the core flow: Call POST generate, confirm 9 bets created, and verify calculated odds.
     */
    @Test
    void generateDailyBets_shouldCreateAndReturnBets() throws Exception {
        // Act: Call the generation endpoint
        mockMvc.perform(post("/api/bets/generate-daily")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray()); 

        // Assert 1: Verify all 9 bets were saved to the database (The count is now fixed)
        List<Bet> createdBets = betRepository.findAll();
        assertEquals(9, createdBets.size(), "Should have created 9 bets in the database."); 

        // Assert 2: Verify the content of a representative Temperature bet
        Bet tempBet = createdBets.stream()
                .filter(b -> b.getBetType().equals("MAX_TEMP_OVER_UNDER"))
                .findFirst()
                .orElseThrow(() -> new AssertionError("Missing MAX_TEMP_OVER_UNDER bet"));

        // FIX: Correct the expected set line from 55.0 to 50.0
        assertEquals(new BigDecimal("50.0"), tempBet.getSetLine(), "Set line should be rounded down to 50.0.");
        
        // Check if the calculated odds from the statistical model were saved correctly.
        assertEquals(EXPECTED_TEMP_ODDS, tempBet.getMoneylineOdds(), "Moneyline odds must reflect the calculated statistical value.");
        
        // FIX: Update the description to reflect the correct 50.0 line
        assertTrue(tempBet.getBetDescription().contains("Over/Under 50.0°F (Odds for UNDER)"), "Bet description should reflect the rounded line and odds side.");

        // Assert 3: Check a fixed odds bet remains correct (Rain Yes/No)
        Bet rainBet = createdBets.stream()
                .filter(b -> b.getBetType().equals("RAIN_YES_NO"))
                .findFirst()
                .orElseThrow(() -> new AssertionError("Missing RAIN_YES_NO bet"));
        assertEquals(new BigDecimal("100.00"), rainBet.getMoneylineOdds(), "Rain odds should remain fixed at 100.00.");
    }

    /**
     * Tests the retrieval endpoint used by the frontend.
     */
    @Test
    void getDailyBets_shouldReturnGeneratedBets() throws Exception {
        // Arrange 1: Generate the bets first (ensuring data exists)
        mockMvc.perform(post("/api/bets/generate-daily"));

        // Act & Assert: Call the retrieval endpoint and verify the response structure
        mockMvc.perform(get("/api/bets/daily")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(9))
                // FIX: Updating JSONPath assertion to the correct calculated value 269.83
                .andExpect(jsonPath("$[0].moneylineOdds").value(269.83)) 
                .andExpect(jsonPath("$[0].betDescription").isString());
    }

    /**
     * Test case to ensure the system handles incomplete forecast data gracefully.
     */
    @Test
    void generateDailyBets_shouldHandleMissingForecastPeriod() throws Exception {
        // Arrange: Create a mock response that only contains the current period, not tomorrow's
        WeatherForecastResponse.Properties props = new WeatherForecastResponse.Properties();
        props.setPeriods(List.of(new Period())); 

        WeatherForecastResponse incompleteForecast = new WeatherForecastResponse();
        incompleteForecast.setProperties(props);

        // Arrange: Mock the service to return the incomplete data explicitly for each city
        when(weatherApiService.getForecast(MADISON_LAT, MADISON_LON)).thenReturn(incompleteForecast); 
        when(weatherApiService.getForecast(LA_LAT, LA_LON)).thenReturn(incompleteForecast);
        when(weatherApiService.getForecast(NYC_LAT, NYC_LON)).thenReturn(incompleteForecast);

        // Act: Call the generation endpoint
        mockMvc.perform(post("/api/bets/generate-daily")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                // Ensure the response is an empty array
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(0));

        // Assert: Verify no bets were persisted (Primary check)
        assertEquals(0, betRepository.findAll().size(), "No bets should have been created if tomorrow's forecast is missing.");
    }

    // ========== NEW TESTS FOR GENERATE-FOR-LOCATION ENDPOINT ==========

    /**
     * Test successful bet generation for a custom location.
     */
    @Test
    void generateBetsForLocation_shouldCreateAndReturnBets() throws Exception {
        BetGenerationRequest request = new BetGenerationRequest(
            "Seattle, WA",
            SEATTLE_LAT,
            SEATTLE_LON,
            DateUtil.getTomorrowDate()
        );

        mockMvc.perform(post("/api/bets/generate-for-location")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(3))
                .andExpect(jsonPath("$[0].cityName").value("Seattle, WA"))
                .andExpect(jsonPath("$[0].betType").exists());

        // Verify bets were saved to database
        List<Bet> createdBets = betRepository.findAll();
        assertEquals(3, createdBets.size(), "Should have created 3 bets for Seattle");
        assertTrue(createdBets.stream().allMatch(bet -> bet.getCityName().equals("Seattle, WA")));
    }

    /**
     * Test validation for invalid latitude.
     */
    @Test
    void generateBetsForLocation_shouldRejectInvalidLatitude() throws Exception {
        BetGenerationRequest request = new BetGenerationRequest(
            "Invalid City",
            95.0, // Invalid latitude (must be -90 to 90)
            -122.3321,
            DateUtil.getTomorrowDate()
        );

        mockMvc.perform(post("/api/bets/generate-for-location")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());

        // Verify no bets were created
        assertEquals(0, betRepository.findAll().size());
    }

    /**
     * Test validation for invalid longitude.
     */
    @Test
    void generateBetsForLocation_shouldRejectInvalidLongitude() throws Exception {
        BetGenerationRequest request = new BetGenerationRequest(
            "Invalid City",
            47.6062,
            -200.0, // Invalid longitude (must be -180 to 180)
            DateUtil.getTomorrowDate()
        );

        mockMvc.perform(post("/api/bets/generate-for-location")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());

        // Verify no bets were created
        assertEquals(0, betRepository.findAll().size());
    }

    /**
     * Test rejection of past dates.
     */
    @Test
    void generateBetsForLocation_shouldRejectPastDate() throws Exception {
        BetGenerationRequest request = new BetGenerationRequest(
            "Seattle, WA",
            SEATTLE_LAT,
            SEATTLE_LON,
            LocalDate.now().minusDays(1) // Past date
        );

        mockMvc.perform(post("/api/bets/generate-for-location")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Cannot generate bets for past dates"));

        // Verify no bets were created
        assertEquals(0, betRepository.findAll().size());
    }

    /**
     * Test handling of duplicate bet generation (should return existing bets).
     */
    @Test
    void generateBetsForLocation_shouldReturnExistingBetsIfAlreadyGenerated() throws Exception {
        BetGenerationRequest request = new BetGenerationRequest(
            "Seattle, WA",
            SEATTLE_LAT,
            SEATTLE_LON,
            DateUtil.getTomorrowDate()
        );

        // First request - creates bets
        mockMvc.perform(post("/api/bets/generate-for-location")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.length()").value(3));

        // Second request - should return existing bets with 200 OK
        mockMvc.perform(post("/api/bets/generate-for-location")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Bets already exist for this city and date"))
                .andExpect(jsonPath("$.bets").isArray())
                .andExpect(jsonPath("$.bets.length()").value(3));

        // Verify only 3 bets exist (not 6)
        assertEquals(3, betRepository.findAll().size(), "Should not create duplicate bets");
    }

    /**
     * Test missing required field (city name).
     */
    @Test
    void generateBetsForLocation_shouldRejectEmptyCityName() throws Exception {
        BetGenerationRequest request = new BetGenerationRequest(
            "", // Empty city name
            SEATTLE_LAT,
            SEATTLE_LON,
            DateUtil.getTomorrowDate()
        );

        mockMvc.perform(post("/api/bets/generate-for-location")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());

        // Verify no bets were created
        assertEquals(0, betRepository.findAll().size());
    }

    /**
     * Test default date handling (should use tomorrow if date not provided).
     */
    @Test
    void generateBetsForLocation_shouldUseDefaultDateWhenNotProvided() throws Exception {
        BetGenerationRequest request = new BetGenerationRequest(
            "Seattle, WA",
            SEATTLE_LAT,
            SEATTLE_LON,
            null // No date provided
        );

        mockMvc.perform(post("/api/bets/generate-for-location")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(3));

        // Verify bets were created for tomorrow
        List<Bet> createdBets = betRepository.findAll();
        assertEquals(3, createdBets.size());
        assertTrue(createdBets.stream().allMatch(bet -> 
            bet.getBetDate().equals(DateUtil.getTomorrowDate())
        ));
    }

    /**
     * Test weather API failure handling.
     */
    @Test
    void generateBetsForLocation_shouldHandleWeatherApiFailure() throws Exception {
        // Mock weather service to throw exception
        double testLat = 50.0;
        double testLon = -100.0;
        when(weatherApiService.getForecast(testLat, testLon))
            .thenThrow(new RuntimeException("Weather API unavailable"));

        BetGenerationRequest request = new BetGenerationRequest(
            "Test City",
            testLat,
            testLon,
            DateUtil.getTomorrowDate()
        );

        mockMvc.perform(post("/api/bets/generate-for-location")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$.error").value("Failed to generate bets"))
                .andExpect(jsonPath("$.message").exists());

        // Verify no bets were created
        assertEquals(0, betRepository.findAll().size());
    }
}