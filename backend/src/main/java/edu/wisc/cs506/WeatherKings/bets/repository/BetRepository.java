package edu.wisc.cs506.WeatherKings.bets.repository;

import edu.wisc.cs506.WeatherKings.bets.model.Bet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

/**
 * Repository for Bet entities, now with specific query method for daily bets.
 */
@Repository
public interface BetRepository extends JpaRepository<Bet, Integer> {
    
    /**
     * Retrieves all bets for a specific target date.
     * @param betDate The date the weather event is scheduled for.
     * @return List of Bet entities.
     */
    List<Bet> findByBetDate(LocalDate betDate);
}
