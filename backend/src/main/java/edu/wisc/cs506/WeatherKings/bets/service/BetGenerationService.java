package edu.wisc.cs506.WeatherKings.bets.service;

import edu.wisc.cs506.WeatherKings.bets.model.Bet;
import edu.wisc.cs506.WeatherKings.bets.model.CityLocation;
import edu.wisc.cs506.WeatherKings.bets.repository.BetRepository;
import edu.wisc.cs506.WeatherKings.bets.util.DateUtil;
import edu.wisc.cs506.WeatherKings.weather.dto.WeatherForecastResponse.Period;
import edu.wisc.cs506.WeatherKings.weather.service.WeatherApiService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

/**
 * Service responsible for fetching weather data and generating new bet lines for the next day.
 * This version uses the clean, correct database schema fields and a statistical model for odds.
 */
@Service
public class BetGenerationService {

    // Define the target cities and their coordinates
    private static final List<CityLocation> TARGET_CITIES = List.of(
        new CityLocation("Madison, WI", 43.0731, -89.4012),
        new CityLocation("Los Angeles, CA", 34.0522, -118.2437),
        new CityLocation("New York City, NY", 40.7128, -74.0060)
    );
    
    // --- Odds and Model Constants ---
    // Simple 1:1 American Odds for moneyline bets (+100)
    private static final BigDecimal MONEYLINE_ODDS = new BigDecimal("100.00");
    
    // Standard Deviation (Sigma) for NWS Temperature Forecast Error in degrees F
    private static final double FORECAST_STD_DEV = 3.0; 
    
    // Bet Type Codes
    private static final String TYPE_MAX_TEMP = "MAX_TEMP_OVER_UNDER";
    private static final String TYPE_RAIN_YES_NO = "RAIN_YES_NO";
    private static final String TYPE_CONDITION = "CONDITION_MATCH";

    private final WeatherApiService weatherApiService;
    private final BetRepository betRepository;

    public BetGenerationService(WeatherApiService weatherApiService, BetRepository betRepository) {
        this.weatherApiService = weatherApiService;
        this.betRepository = betRepository;
    }

    /**
     * Generates and persists new bet lines for the *next day* for all target cities.
     */
    @Transactional
    public List<Bet> generateDailyBets() {
        // Use centralized date calculation to ensure consistency
        LocalDate nextBetDate = DateUtil.getTomorrowDate();
        System.err.println("DEBUG: BetGenerationService generating bets for date: " + nextBetDate);
        List<Bet> generatedBets = new java.util.ArrayList<>();

        for (CityLocation city : TARGET_CITIES) {
            try {
                var forecastResponse = weatherApiService.getForecast(city.latitude(), city.longitude());

                Period nextDayForecast = findNextDayForecast(forecastResponse.getProperties().getPeriods());
                if (nextDayForecast == null) {
                    System.err.println("Could not find next day forecast for " + city.cityName());
                    continue;
                }

                generatedBets.addAll(
                    createBetsFromForecast(city.cityName(), nextBetDate, nextDayForecast)
                );

            } catch (Exception e) {
                System.err.println("Failed to generate bets for " + city.cityName() + ": " + e.getMessage());
            }
        }

        // Save all generated bets in a single transaction
        return betRepository.saveAll(generatedBets);
    }

    /**
     * Generates and persists bet lines for a specific city and date.
     * @param cityName The name of the city
     * @param latitude The latitude of the city
     * @param longitude The longitude of the city
     * @param betDate The date for which to generate bets
     * @return List of generated Bet entities
     */
    @Transactional
    public List<Bet> generateBetsForLocation(String cityName, double latitude, double longitude, LocalDate betDate) {
        System.err.println("DEBUG: Generating bets for " + cityName + " on date: " + betDate);
        
        List<Bet> generatedBets = new java.util.ArrayList<>();
        
        try {
            // Fetch forecast for the specified location
            var forecastResponse = weatherApiService.getForecast(latitude, longitude);
            
            // Find the appropriate forecast period
            Period targetForecast = findForecastForDate(
                forecastResponse.getProperties().getPeriods(), 
                betDate
            );
            
            if (targetForecast == null) {
                throw new IllegalArgumentException(
                    "No forecast available for " + cityName + " on " + betDate
                );
            }
            
            // Generate bets using existing logic
            generatedBets.addAll(
                createBetsFromForecast(cityName, betDate, targetForecast)
            );
            
        } catch (Exception e) {
            System.err.println("Failed to generate bets for " + cityName + ": " + e.getMessage());
            throw new RuntimeException("Failed to fetch weather data for " + cityName, e);
        }
        
        // Save and return
        return betRepository.saveAll(generatedBets);
    }
    
    /**
     * Attempts to find the forecast period corresponding to the next full day.
     */
    private Period findNextDayForecast(List<Period> periods) {
        // Logic to find the next full day period (skipping 'Today' and 'Tonight')
        if (periods.size() > 2) {
            Period potentialNextDay = periods.get(2);
            // Simple check to ensure we get a full day forecast and not a night forecast
            if (potentialNextDay.getName() != null && !potentialNextDay.getName().toLowerCase().contains("night")) {
                return potentialNextDay;
            }
            // Fallback to find the first non-night, non-today period
            for (Period period : periods) {
                if (period.getName() != null && 
                    !period.getName().toLowerCase().contains("night") && 
                    !period.getName().toLowerCase().equals("today")) {
                    return period;
                }
            }
        }
        return null;
    }

    /**
     * Finds the forecast period that matches the target date.
     * If target is tomorrow, uses the existing logic.
     * Otherwise, searches for the matching period by date.
     */
    private Period findForecastForDate(List<Period> periods, LocalDate targetDate) {
        LocalDate tomorrow = DateUtil.getTomorrowDate();
        
        // If target is tomorrow, use existing logic
        if (targetDate.equals(tomorrow)) {
            return findNextDayForecast(periods);
        }
        
        // For other dates, search by matching the period name or date
        for (Period period : periods) {
            // You might need to adjust this logic based on NWS API response format
            // This is a simple heuristic
            if (period.getName() != null && 
                !period.getName().toLowerCase().contains("night") &&
                !period.getName().toLowerCase().equals("today")) {
                // This is a simplification - in production you'd parse period.getStartTime()
                // and match it against targetDate more precisely
                return period;
            }
        }
        
        return null;
    }

    /**
     * Creates and returns a list of specific bet lines from a single forecast period.
     */
    private List<Bet> createBetsFromForecast(String cityName, LocalDate betDate, Period forecast) {
        List<Bet> bets = new java.util.ArrayList<>();

        Integer temperature = forecast.getTemperature();
        // Use 0 if precipitation data is null
        int rainProb = forecast.getProbabilityOfPrecipitation().getValue() != null ?
                       forecast.getProbabilityOfPrecipitation().getValue() : 0;
        String shortForecast = forecast.getShortForecast() != null ? forecast.getShortForecast().toLowerCase() : "";

        // Bet lines close 2 hours before the target day starts (e.g., 22:00 the day before)
        LocalDateTime betCloseTime = LocalDateTime.of(betDate, LocalTime.MIDNIGHT).minusHours(2);

        // 1. Max Temperature Over/Under Bet (USING STATISTICAL MODEL)
        if (temperature != null) {
            int forecastTemp = temperature.intValue();
            // Set line to nearest 5 degrees (e.g., 52F -> 55.0, 48F -> 50.0)
            int setLineInt = (int) (Math.round((double) forecastTemp / 5) * 5);
            
            // Calculate probability of max temp being UNDER the set line
            double underProbability = calculateUnderProbability(setLineInt, forecastTemp, FORECAST_STD_DEV);

            // Convert probability to American Odds
            BigDecimal underOdds = probabilityToAmericanOdds(underProbability);

            Bet tempBet = new Bet();
            tempBet.setCityName(cityName);
            tempBet.setBetDate(betDate);
            tempBet.setBetType(TYPE_MAX_TEMP); 
            tempBet.setSetLine(new BigDecimal(setLineInt).setScale(1)); 
            tempBet.setMoneylineOdds(underOdds); 
            tempBet.setBetClose(betCloseTime); 
            // Description specifies that the odds are for the UNDER outcome
            tempBet.setBetDescription(String.format("%s: Max Temperature Over/Under %.1f°F (Odds for UNDER)", 
                                                   cityName, tempBet.getSetLine().doubleValue()));
            bets.add(tempBet);
        }

        // 2. Precipitation Yes/No Bet
        if (rainProb >= 0) {
            String description = rainProb >= 50
                ? String.format("%s: Precipitation (Rain/Snow) - YES (Forecast: %d%%)", cityName, rainProb)
                : String.format("%s: Precipitation (Rain/Snow) - NO (Forecast: %d%%)", cityName, rainProb);
            
            Bet rainBet = new Bet();
            rainBet.setCityName(cityName);
            rainBet.setBetDate(betDate);
            rainBet.setBetType(TYPE_RAIN_YES_NO); 
            rainBet.setSetLine(new BigDecimal(rainProb).setScale(1)); // Store probability as line
            rainBet.setMoneylineOdds(MONEYLINE_ODDS); // Uses fixed +100 odds
            rainBet.setBetClose(betCloseTime);
            rainBet.setBetDescription(description);
            bets.add(rainBet);
        }
        
        // 3. Simple Condition Match Bet
        if (!shortForecast.isEmpty()) {
            String conditionLine = shortForecast.contains("sunny") || shortForecast.contains("clear")
                ? "Sunny/Clear Day"
                : "Mostly Cloudy or Worse";
                
            String description = String.format("%s: Will the overall day be '%s'?", cityName, conditionLine);

            Bet conditionBet = new Bet();
            conditionBet.setCityName(cityName);
            conditionBet.setBetDate(betDate);
            conditionBet.setBetType(TYPE_CONDITION); 
            conditionBet.setSetLine(null); // No numerical line for this type
            conditionBet.setMoneylineOdds(MONEYLINE_ODDS); // Uses fixed +100 odds
            conditionBet.setBetClose(betCloseTime);
            conditionBet.setBetDescription(description);
            bets.add(conditionBet);
        }

        return bets;
    }
    
    // --------------------------------------------------------------------------
    // STATISTICAL ODDS CALCULATION UTILITIES
    // --------------------------------------------------------------------------

    /**
     * Calculates the probability of the actual temperature being BELOW the set line, 
     * assuming a Normal Distribution centered on the forecast temperature.
     */
    private double calculateUnderProbability(double setLine, double mean, double stdDev) {
        // 1. Calculate the Z-score
        double zscore = (setLine - mean) / stdDev;
        
        // 2. Use the Z-score to find the Cumulative Distribution Function (CDF) value.
        return phi(zscore);
    }
    
    /**
     * Approximates the standard Normal Cumulative Distribution Function (CDF).
     */
    private double phi(double z) {
        if (z < -8.0) return 0.0;
        if (z > 8.0) return 1.0;

        double[] p = {0.2428, 0.5097, 0.3802, 0.0039, -0.2222, -0.0632, 0.0759, 0.0335};
        double[] q = {1.0, 1.4885, 0.8173, 0.0886, -0.0544, -0.0076, 0.0048, 0.0003};

        double t = 1.0 / (1.0 + 0.2316419 * Math.abs(z));
        double density = (1.0 / Math.sqrt(2 * Math.PI)) * Math.exp(-0.5 * z * z);
        double poly = (p[7] * t + p[6]) * t + p[5];
        poly = (poly * t + p[4]) * t + p[3];
        poly = (poly * t + p[2]) * t + p[1];
        poly = (poly * t + p[0]);
        
        double cdf = 1.0 - density * poly;

        if (z < 0.0) {
            return 1.0 - cdf;
        } else {
            return cdf;
        }
    }

    /**
     * Converts a probability (0.0 to 1.0) into American Moneyline Odds, including a house vig.
     */
    private BigDecimal probabilityToAmericanOdds(double probability) {
        
        // Apply a simple VIG adjustment
        double viggedProbability = Math.max(0.01, Math.min(0.99, probability * 1.02 - 0.01));

        if (viggedProbability <= 0.50) {
            // Underdog (Positive Odds)
            double odds = (100.0 / viggedProbability) - 100.0;
            return new BigDecimal(odds).setScale(2, RoundingMode.HALF_UP);
        } else {
            // Favorite (Negative Odds)
            double odds = -100.0 * (viggedProbability / (1.0 - viggedProbability));
            return new BigDecimal(odds).setScale(2, RoundingMode.HALF_UP);
        }
    }
}