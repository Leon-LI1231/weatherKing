package edu.wisc.cs506.WeatherKings.bets.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Entity representing a user's bet on a specific bet line.
 * Maps to player_bets table.
 */
@Entity
@Table(name = "player_bets")
public class PlayerBet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "player_bet_id")
    private Integer playerBetId;

    @Column(name = "bet_id", nullable = false)
    private Integer betId;

    @Column(name = "uid", nullable = false)
    private Integer uid;

    @Column(name = "bet_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal betAmount;

    @Column(name = "bet_to_pay", precision = 10, scale = 2)
    private BigDecimal betToPay;

    @Column(name = "bet_success")
    private Boolean betSuccess;

    @Column(name = "time_placed")
    private LocalDateTime timePlaced;

    @Column(name = "time_made")
    private LocalDateTime timeMade = LocalDateTime.now();

    public PlayerBet() {}

    // Getters and Setters
    public Integer getPlayerBetId() { return playerBetId; }
    public void setPlayerBetId(Integer playerBetId) { this.playerBetId = playerBetId; }

    public Integer getBetId() { return betId; }
    public void setBetId(Integer betId) { this.betId = betId; }

    public Integer getUid() { return uid; }
    public void setUid(Integer uid) { this.uid = uid; }

    public BigDecimal getBetAmount() { return betAmount; }
    public void setBetAmount(BigDecimal betAmount) { this.betAmount = betAmount; }

    public BigDecimal getBetToPay() { return betToPay; }
    public void setBetToPay(BigDecimal betToPay) { this.betToPay = betToPay; }

    public Boolean getBetSuccess() { return betSuccess; }
    public void setBetSuccess(Boolean betSuccess) { this.betSuccess = betSuccess; }

    public LocalDateTime getTimePlaced() { return timePlaced; }
    public void setTimePlaced(LocalDateTime timePlaced) { this.timePlaced = timePlaced; }

    public LocalDateTime getTimeMade() { return timeMade; }
    public void setTimeMade(LocalDateTime timeMade) { this.timeMade = timeMade; }
}