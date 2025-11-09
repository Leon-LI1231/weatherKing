package edu.wisc.cs506.WeatherKings.bets.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;

import edu.wisc.cs506.WeatherKings.bets.model.Bet;
import edu.wisc.cs506.WeatherKings.bets.repository.BetRepository;
import edu.wisc.cs506.WeatherKings.bets.util.DateUtil;

/**
 * Service for fetching bet data for the frontend.
 */
@Service
public class BetService {

    private final BetRepository betRepository;

    public BetService(BetRepository betRepository) {
        this.betRepository = betRepository;
    }

    /**
     * Retrieves all bet lines for the *next day* (tomorrow).
     * This method only fetches existing bets - auto-generation is handled by the controller.
     * @return List of Bet entities.
     */
    public List<Bet> getDailyBetsForNextDay() {
        LocalDate tomorrow = DateUtil.getTomorrowDate();
        System.err.println("DEBUG: BetService looking for bets on date: " + tomorrow);
        
        List<Bet> existingBets = betRepository.findByBetDate(tomorrow);
        System.err.println("DEBUG: BetService found " + existingBets.size() + " existing bets for " + tomorrow);
        
        return existingBets;
    }
}
