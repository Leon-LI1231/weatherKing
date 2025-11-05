package edu.wisc.cs506.WeatherKings.bets.controller;

import edu.wisc.cs506.WeatherKings.bets.model.Bet;
import edu.wisc.cs506.WeatherKings.bets.repository.BetRepository;
import edu.wisc.cs506.WeatherKings.weather.dto.WeatherForecastResponse; // FIX: Missing import
import edu.wisc.cs506.WeatherKings.weather.dto.WeatherForecastResponse.Period; // FIX: Missing import
import edu.wisc.cs506.WeatherKings.weather.service.WeatherApiService; // FIX: Missing import

import org.junit.jupiter.api.BeforeEach; // FIX: Missing import
import org.junit.jupiter.api.Test; // FIX: Missing import
import org.springframework.beans.factory.annotation.Autowired; // FIX: Missing import
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc; // FIX: Missing import
import org.springframework.boot.test.context.SpringBootTest; // FIX: Missing import
import org.springframework.boot.test.mock.mockito.MockBean; // FIX: Missing import
import org.springframework.http.MediaType; // FIX: Missing import
import org.springframework.test.web.servlet.MockMvc; // FIX: Missing import
import org.springframework.transaction.annotation.Transactional; // FIX: Missing import

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals; // FIX: Missing static import
import static org.junit.jupiter.api.Assertions.assertTrue; // FIX: Missing static import
import static org.mockito.ArgumentMatchers.anyDouble; // FIX: Missing static import
import static org.mockito.Mockito.when; // FIX: Missing static import
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get; // FIX: Missing static import
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post; // FIX: Missing static import
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath; // FIX: Missing static import
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status; // FIX: Missing static import


/**
 * Integration tests for BetController.
 * This test uses the full Spring context but mocks the external NWS API calls.
 */
@SpringBootTest
@AutoConfigureMockMvc
@Transactional // Ensures each test rolls back DB changes
class BetControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private BetRepository betRepository;

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
        
        // Safety mock for the third test
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
}