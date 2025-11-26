package edu.wisc.cs506.WeatherKings.bets.repository;

import edu.wisc.cs506.WeatherKings.bets.model.PlayerBet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository for PlayerBet entity operations.
 */
@Repository
public interface PlayerBetRepository extends JpaRepository<PlayerBet, Integer> {
    
    List<PlayerBet> findByUid(Integer uid);
    
    List<PlayerBet> findByBetId(Integer betId);
    
    List<PlayerBet> findByUidAndBetSuccessIsNull(Integer uid);
    
    List<PlayerBet> findByUidAndBetSuccessIsNotNull(Integer uid);
}