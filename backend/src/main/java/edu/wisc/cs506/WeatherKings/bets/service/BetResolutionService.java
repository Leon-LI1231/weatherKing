package edu.wisc.cs506.WeatherKings.bets.service;

import edu.wisc.cs506.WeatherKings.User;
import edu.wisc.cs506.WeatherKings.UserRepository;
import edu.wisc.cs506.WeatherKings.bets.model.Bet;
import edu.wisc.cs506.WeatherKings.bets.model.PlayerBet;
import edu.wisc.cs506.WeatherKings.bets.model.dto.GeocodeResponse;
import edu.wisc.cs506.WeatherKings.bets.repository.BetRepository;
import edu.wisc.cs506.WeatherKings.bets.repository.PlayerBetRepository;
import edu.wisc.cs506.WeatherKings.weather.dto.WeatherObservation;
import edu.wisc.cs506.WeatherKings.weather.service.WeatherObservationService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Service for resolving bets after weather events occur.
 * Fetches actual weather data and determines winners/losers.
 */
@Service
public class BetResolutionService {

    private final BetRepository betRepository;
    private final PlayerBetRepository playerBetRepository;
    private final UserRepository userRepository;
    private final WeatherObservationService observationService;
    private final GeocodeService geocodeService;

    public BetResolutionService(BetRepository betRepository,
                               PlayerBetRepository playerBetRepository,
                               UserRepository userRepository,
                               WeatherObservationService observationService,
                               GeocodeService geocodeService) {
        this.betRepository = betRepository;
        this.playerBetRepository = playerBetRepository;
        this.userRepository = userRepository;
        this.observationService = observationService;
        this.geocodeService = geocodeService;
    }

    /**
     * Resolve a specific bet by fetching actual weather and paying winners.
     */
    @Transactional
    public Map<String, Object> resolveBet(Integer betId) {
        Bet bet = betRepository.findById(betId)
                .orElseThrow(() -> new IllegalArgumentException("Bet not found: " + betId));
        
        if (bet.getBetHit() != null) {
            throw new IllegalStateException("Bet already resolved");
        }
        
        GeocodeResponse location = geocodeService.geocodeCity(bet.getCityName());
        WeatherObservation observation = observationService.getObservationForLocation(
            location.getLatitude(), 
            location.getLongitude()
        );
        
        boolean betWon = evaluateBetOutcome(bet, observation);
        
        Double actualTemp = observation.getProperties().getTemperature() != null ? 
                observation.getProperties().getTemperature().getValueInFahrenheit() : null;
        
        bet.setBetHit(betWon);
        if (actualTemp != null) {
            bet.setOutcomeValue(BigDecimal.valueOf(actualTemp).setScale(2, BigDecimal.ROUND_HALF_UP));
        }
        betRepository.save(bet);
        
        return payoutWinners(bet);
    }

    /**
     * Resolve all bets for a specific date.
     */
    @Transactional
    public Map<String, Object> resolveDailyBets(LocalDate date) {
        List<Bet> bets = betRepository.findByBetDate(date);
        
        int totalResolved = 0;
        int totalWinners = 0;
        BigDecimal totalPaidOut = BigDecimal.ZERO;
        
        for (Bet bet : bets) {
            if (bet.getBetHit() == null) {
                try {
                    Map<String, Object> result = resolveBet(bet.getBetId());
                    totalResolved++;
                    totalWinners += (Integer) result.get("winnersCount");
                    totalPaidOut = totalPaidOut.add((BigDecimal) result.get("totalPaidOut"));
                } catch (Exception e) {
                    System.err.println("Failed to resolve bet " + bet.getBetId() + ": " + e.getMessage());
                }
            }
        }
        
        Map<String, Object> summary = new HashMap<>();
        summary.put("date", date);
        summary.put("totalBetsResolved", totalResolved);
        summary.put("totalWinners", totalWinners);
        summary.put("totalPaidOut", totalPaidOut);
        return summary;
    }

    /**
     * Evaluate if bet won based on actual weather vs prediction.
     */
    private boolean evaluateBetOutcome(Bet bet, WeatherObservation observation) {
        String betType = bet.getBetType();
        
        if ("MAX_TEMP_OVER_UNDER".equals(betType)) {
            if (observation.getProperties().getTemperature() == null) {
                throw new IllegalStateException("Temperature data not available");
            }
            
            Double actualTemp = observation.getProperties().getTemperature().getValueInFahrenheit();
            Double setLine = bet.getSetLine().doubleValue();
            
            return actualTemp < setLine;
            
        } else if ("RAIN_YES_NO".equals(betType)) {
            boolean didRain = observation.getProperties().getPrecipitationLastHour() != null &&
                            observation.getProperties().getPrecipitationLastHour().hasRain();
            
            boolean predictedRain = bet.getSetLine().doubleValue() >= 50;
            
            return didRain == predictedRain;
            
        } else if ("CONDITION_MATCH".equals(betType)) {
            String actualCondition = observation.getProperties().getTextDescription();
            if (actualCondition == null) {
                return false;
            }
            
            actualCondition = actualCondition.toLowerCase();
            boolean isSunny = actualCondition.contains("sunny") || actualCondition.contains("clear");
            boolean predictedSunny = bet.getBetDescription().toLowerCase().contains("sunny/clear");
            
            return isSunny == predictedSunny;
        }
        
        return false;
    }

    /**
     * Payout all winners for a resolved bet.
     */
    private Map<String, Object> payoutWinners(Bet bet) {
        List<PlayerBet> playerBets = playerBetRepository.findByBetId(bet.getBetId());
        
        int winnersCount = 0;
        BigDecimal totalPaidOut = BigDecimal.ZERO;
        
        for (PlayerBet playerBet : playerBets) {
            boolean won = bet.getBetHit();
            playerBet.setBetSuccess(won);
            
            if (won) {
                User user = userRepository.findById(playerBet.getUid()).orElse(null);
                if (user != null) {
                    BigDecimal payout = playerBet.getBetToPay();
                    user.setBalanceUsd(user.getBalanceUsd() + payout.doubleValue());
                    userRepository.save(user);
                    
                    winnersCount++;
                    totalPaidOut = totalPaidOut.add(payout);
                }
            }
            
            playerBetRepository.save(playerBet);
        }
        
        Map<String, Object> result = new HashMap<>();
        result.put("betId", bet.getBetId());
        result.put("betHit", bet.getBetHit());
        result.put("outcomeValue", bet.getOutcomeValue());
        result.put("winnersCount", winnersCount);
        result.put("totalPaidOut", totalPaidOut);
        return result;
    }
}