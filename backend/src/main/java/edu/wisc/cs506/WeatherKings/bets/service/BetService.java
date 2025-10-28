package edu.wisc.cs506.WeatherKings.bets.service;

import edu.wisc.cs506.WeatherKings.bets.model.Bet;
import edu.wisc.cs506.WeatherKings.bets.repository.BetRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

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
     * @return List of Bet entities.
     */
    public List<Bet> getDailyBetsForNextDay() {
        LocalDate tomorrow = LocalDate.now().plus(1, ChronoUnit.DAYS);
        return betRepository.findByBetDate(tomorrow);
    }
}
