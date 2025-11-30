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
import org.springframework.test.context.ActiveProfiles;


/**
 * Integration tests for BetController.
 * This test uses the full Spring context but mocks the external NWS API calls.
 */
@SpringBootTest
@AutoConfigureMockMvc
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.ANY)
@ActiveProfiles("test")
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

    private static final BigDecimal EXPECTED_TEMP_ODDS = new BigDecimal("269.83");

    private static final double MADISON_LAT = 43.0731;
    private static final double MADISON_LON = -89.4012;
    private static final double LA_LAT = 34.0522;
    private static final double LA_LON = -118.2437;
    private static final double NYC_LAT = 40.7128;
    private static final double NYC_LON = -74.0060;
    private static final double SEATTLE_LAT = 47.6062;
    private static final double SEATTLE_LON = -122.3321;

    @BeforeEach
    void setup() {
        betRepository.deleteAll();

        Period tomorrowForecast = new Period();
        tomorrowForecast.setName("Tomorrow");
        tomorrowForecast.setTemperature(52);
        tomorrowForecast.setShortForecast("Mostly Sunny");

        WeatherForecastResponse.ProbabilityValue lowPrecip = new WeatherForecastResponse.ProbabilityValue();
        lowPrecip.setValue(35);
        tomorrowForecast.setProbabilityOfPrecipitation(lowPrecip);

        WeatherForecastResponse.Properties props = new WeatherForecastResponse.Properties();
        props.setPeriods(List.of(new Period(), new Period(), tomorrowForecast));

        mockForecast = new WeatherForecastResponse();
        mockForecast.setProperties(props);

        when(weatherApiService.getForecast(MADISON_LAT, MADISON_LON)).thenReturn(mockForecast);
        when(weatherApiService.getForecast(LA_LAT, LA_LON)).thenReturn(mockForecast);
        when(weatherApiService.getForecast(NYC_LAT, NYC_LON)).thenReturn(mockForecast);
        when(weatherApiService.getForecast(SEATTLE_LAT, SEATTLE_LON)).thenReturn(mockForecast);
        when(weatherApiService.getForecast(anyDouble(), anyDouble())).thenReturn(mockForecast);
    }

    @Test
    void generateDailyBets_shouldCreateAndReturnBets() throws Exception {
        mockMvc.perform(post("/api/bets/generate-daily")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());

        List<Bet> createdBets = betRepository.findAll();
        assertEquals(9, createdBets.size(), "Should have created 9 bets in the database.");

        Bet tempBet = createdBets.stream()
                .filter(b -> b.getBetType().equals("MAX_TEMP_OVER_UNDER"))
                .findFirst()
                .orElseThrow(() -> new AssertionError("Missing MAX_TEMP_OVER_UNDER bet"));

        assertEquals(new BigDecimal("50.0"), tempBet.getSetLine(), "Set line should be rounded down to 50.0.");
        assertEquals(EXPECTED_TEMP_ODDS, tempBet.getMoneylineOdds(), "Moneyline odds must reflect the calculated statistical value.");
        assertTrue(tempBet.getBetDescription().contains("Over/Under 50.0°F (Odds for UNDER)"),
                "Bet description should reflect the rounded line and odds side.");

        Bet rainBet = createdBets.stream()
                .filter(b -> b.getBetType().equals("RAIN_YES_NO"))
                .findFirst()
                .orElseThrow(() -> new AssertionError("Missing RAIN_YES_NO bet"));
        assertEquals(new BigDecimal("100.00"), rainBet.getMoneylineOdds(), "Rain odds should remain fixed at 100.00.");
    }

    @Test
    void getDailyBets_shouldReturnGeneratedBets() throws Exception {
        mockMvc.perform(post("/api/bets/generate-daily"));

        mockMvc.perform(get("/api/bets/daily")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(9))
                .andExpect(jsonPath("$[0].moneylineOdds").value(269.83))
                .andExpect(jsonPath("$[0].betDescription").isString());
    }

    @Test
    void generateDailyBets_shouldHandleMissingForecastPeriod() throws Exception {
        WeatherForecastResponse.Properties props = new WeatherForecastResponse.Properties();
        props.setPeriods(List.of(new Period()));

        WeatherForecastResponse incompleteForecast = new WeatherForecastResponse();
        incompleteForecast.setProperties(props);

        when(weatherApiService.getForecast(MADISON_LAT, MADISON_LON)).thenReturn(incompleteForecast);
        when(weatherApiService.getForecast(LA_LAT, LA_LON)).thenReturn(incompleteForecast);
        when(weatherApiService.getForecast(NYC_LAT, NYC_LON)).thenReturn(incompleteForecast);

        mockMvc.perform(post("/api/bets/generate-daily")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(0));

        assertEquals(0, betRepository.findAll().size(), "No bets should have been created if tomorrow's forecast is missing.");
    }

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

        List<Bet> createdBets = betRepository.findAll();
        assertEquals(3, createdBets.size(), "Should have created 3 bets for Seattle");
        assertTrue(createdBets.stream().allMatch(bet -> bet.getCityName().equals("Seattle, WA")));
    }

    @Test
    void generateBetsForLocation_shouldRejectInvalidLatitude() throws Exception {
        BetGenerationRequest request = new BetGenerationRequest(
            "Invalid City",
            95.0,
            -122.3321,
            DateUtil.getTomorrowDate()
        );

        mockMvc.perform(post("/api/bets/generate-for-location")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());

        assertEquals(0, betRepository.findAll().size());
    }

    @Test
    void generateBetsForLocation_shouldRejectInvalidLongitude() throws Exception {
        BetGenerationRequest request = new BetGenerationRequest(
            "Invalid City",
            47.6062,
            -200.0,
            DateUtil.getTomorrowDate()
        );

        mockMvc.perform(post("/api/bets/generate-for-location")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());

        assertEquals(0, betRepository.findAll().size());
    }

    @Test
    void generateBetsForLocation_shouldRejectPastDate() throws Exception {
        BetGenerationRequest request = new BetGenerationRequest(
            "Seattle, WA",
            SEATTLE_LAT,
            SEATTLE_LON,
            LocalDate.now().minusDays(1)
        );

        mockMvc.perform(post("/api/bets/generate-for-location")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Cannot generate bets for past dates"));

        assertEquals(0, betRepository.findAll().size());
    }

    @Test
    void generateBetsForLocation_shouldReturnExistingBetsIfAlreadyGenerated() throws Exception {
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
                .andExpect(jsonPath("$.length()").value(3));

        mockMvc.perform(post("/api/bets/generate-for-location")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Bets already exist for this city and date"))
                .andExpect(jsonPath("$.bets").isArray())
                .andExpect(jsonPath("$.bets.length()").value(3));

        assertEquals(3, betRepository.findAll().size(), "Should not create duplicate bets");
    }

    @Test
    void generateBetsForLocation_shouldRejectEmptyCityName() throws Exception {
        BetGenerationRequest request = new BetGenerationRequest(
            "",
            SEATTLE_LAT,
            SEATTLE_LON,
            DateUtil.getTomorrowDate()
        );

        mockMvc.perform(post("/api/bets/generate-for-location")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());

        assertEquals(0, betRepository.findAll().size());
    }

    @Test
    void generateBetsForLocation_shouldUseDefaultDateWhenNotProvided() throws Exception {
        BetGenerationRequest request = new BetGenerationRequest(
            "Seattle, WA",
            SEATTLE_LAT,
            SEATTLE_LON,
            null
        );

        mockMvc.perform(post("/api/bets/generate-for-location")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(3));

        List<Bet> createdBets = betRepository.findAll();
        assertEquals(3, createdBets.size());
        assertTrue(createdBets.stream().allMatch(bet ->
            bet.getBetDate().equals(DateUtil.getTomorrowDate())
        ));
    }

    @Test
    void generateBetsForLocation_shouldHandleWeatherApiFailure() throws Exception {
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

        assertEquals(0, betRepository.findAll().size());
    }

    // ========== NEW RESOLUTION ENDPOINT TESTS ==========

    /**
     * Test resolution endpoint when bet doesn't exist.
     */
    @Test
    void resolveBet_shouldReturn404WhenBetNotFound() throws Exception {
        mockMvc.perform(post("/api/bets/resolve/99999"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.error").exists());
    }

    /**
     * Test resolution endpoint when bet already resolved.
     */
    @Test
    void resolveBet_shouldReturn400WhenBetAlreadyResolved() throws Exception {
        // Create and resolve a bet first
        Bet bet = new Bet();
        bet.setCityName("Madison, WI");
        bet.setBetDate(LocalDate.now());
        bet.setBetType("MAX_TEMP_OVER_UNDER");
        bet.setBetDescription("Test bet");
        bet.setSetLine(new BigDecimal("45.0"));
        bet.setMoneylineOdds(new BigDecimal("100.00"));
        bet.setTotalAmountBet(BigDecimal.ZERO);
        bet.setBetHit(true); // Already resolved
        bet = betRepository.save(bet);

        mockMvc.perform(post("/api/bets/resolve/" + bet.getBetId()))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Bet already resolved"));
    }

    /**
     * Test daily resolution endpoint with valid date.
     */
    @Test
    void resolveDailyBets_shouldReturnSummaryForValidDate() throws Exception {
        mockMvc.perform(post("/api/bets/resolve-daily")
                .param("date", "2025-11-25"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.date").value("2025-11-25"))
                .andExpect(jsonPath("$.totalBetsResolved").exists())
                .andExpect(jsonPath("$.totalWinners").exists())
                .andExpect(jsonPath("$.totalPaidOut").exists());
    }

    /**
     * Test daily resolution endpoint without date parameter.
     */
    @Test
    void resolveDailyBets_shouldReturn400WhenDateMissing() throws Exception {
        mockMvc.perform(post("/api/bets/resolve-daily"))
                .andExpect(status().isBadRequest());
    }

    /**
     * Test daily resolution endpoint with invalid date format.
     */
    @Test
    void resolveDailyBets_shouldReturn400WhenDateFormatInvalid() throws Exception {
        mockMvc.perform(post("/api/bets/resolve-daily")
                .param("date", "invalid-date"))
                .andExpect(status().isBadRequest());
    }

    /**
     * Test resolution endpoint handles weather service failures gracefully.
     */
    @Test
    void resolveBet_shouldReturn500WhenWeatherServiceFails() throws Exception {
        // Create an unresolved bet
        Bet bet = new Bet();
        bet.setCityName("Test City");
        bet.setBetDate(LocalDate.now());
        bet.setBetType("MAX_TEMP_OVER_UNDER");
        bet.setBetDescription("Test bet for weather failure");
        bet.setSetLine(new BigDecimal("45.0"));
        bet.setMoneylineOdds(new BigDecimal("100.00"));
        bet.setTotalAmountBet(BigDecimal.ZERO);
        bet.setBetHit(null); // Not resolved yet
        bet = betRepository.save(bet);

        // Note: This test may behave differently depending on whether
        // the geocoding service or weather observation service fails.
        // The actual behavior will depend on the real implementation.

        mockMvc.perform(post("/api/bets/resolve/" + bet.getBetId()))
                .andExpect(status().is5xxServerError())
                .andExpect(jsonPath("$.error").exists());
    }
}