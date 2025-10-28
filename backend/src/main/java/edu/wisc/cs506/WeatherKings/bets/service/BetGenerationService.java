package edu.wisc.cs506.WeatherKings.bets.service;

import edu.wisc.cs506.WeatherKings.bets.model.Bet;
import edu.wisc.cs506.WeatherKings.bets.model.CityLocation;
import edu.wisc.cs506.WeatherKings.bets.repository.BetRepository;
import edu.wisc.cs506.WeatherKings.weather.dto.WeatherForecastResponse.Period;
import edu.wisc.cs506.WeatherKings.weather.service.WeatherApiService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

/**
 * Service responsible for fetching weather data and generating new bet lines for the next day.
 * This version uses the clean, correct database schema fields.
 */
@Service
public class BetGenerationService {

    // Define the target cities and their coordinates
    private static final List<CityLocation> TARGET_CITIES = List.of(
        new CityLocation("Madison, WI", 43.0731, -89.4012),
        new CityLocation("Los Angeles, CA", 34.0522, -118.2437),
        new CityLocation("New York City, NY", 40.7128, -74.0060)
    );
    
    // Simple fixed American Odds for every bet (+100)
    private static final BigDecimal FIXED_ODDS = new BigDecimal("100.00");
    
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
        // The bet target is for tomorrow
        LocalDate nextBetDate = LocalDate.now().plus(1, ChronoUnit.DAYS);
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

        // 1. Max Temperature Over/Under Bet
        if (temperature != null) {
            // Set line to nearest 5 degrees (e.g., 52F -> 55.0, 48F -> 50.0)
            int setLine = (int) (Math.round((double) temperature / 5) * 5);

            Bet tempBet = new Bet();
            tempBet.setCityName(cityName);
            tempBet.setBetDate(betDate);
            tempBet.setBetType(TYPE_MAX_TEMP); 
            tempBet.setSetLine(new BigDecimal(setLine).setScale(1)); 
            tempBet.setMoneylineOdds(FIXED_ODDS); // Set the odds
            tempBet.setBetClose(betCloseTime); 
            tempBet.setBetDescription(String.format("%s: Max Temperature Over/Under %.1f°F", cityName, tempBet.getSetLine().doubleValue()));
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
            rainBet.setMoneylineOdds(FIXED_ODDS); // Set the odds
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
            conditionBet.setMoneylineOdds(FIXED_ODDS); // Set the odds
            conditionBet.setBetClose(betCloseTime);
            conditionBet.setBetDescription(description);
            bets.add(conditionBet);
        }

        return bets;
    }
}
