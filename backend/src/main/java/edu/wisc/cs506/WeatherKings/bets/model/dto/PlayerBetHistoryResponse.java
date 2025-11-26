package edu.wisc.cs506.WeatherKings.bets.model.dto;

import edu.wisc.cs506.WeatherKings.bets.model.Bet;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Response DTO for user bet history.
 */
public class PlayerBetHistoryResponse {
    private Integer playerBetId;
    private Bet bet;
    private BigDecimal betAmount;
    private BigDecimal potentialPayout;
    private BigDecimal actualPayout;
    private String status;
    private LocalDateTime timePlaced;

    public PlayerBetHistoryResponse() {}

    public PlayerBetHistoryResponse(Integer playerBetId, Bet bet, BigDecimal betAmount,
                                   BigDecimal potentialPayout, BigDecimal actualPayout,
                                   String status, LocalDateTime timePlaced) {
        this.playerBetId = playerBetId;
        this.bet = bet;
        this.betAmount = betAmount;
        this.potentialPayout = potentialPayout;
        this.actualPayout = actualPayout;
        this.status = status;
        this.timePlaced = timePlaced;
    }

    public Integer getPlayerBetId() { return playerBetId; }
    public void setPlayerBetId(Integer playerBetId) { this.playerBetId = playerBetId; }

    public Bet getBet() { return bet; }
    public void setBet(Bet bet) { this.bet = bet; }

    public BigDecimal getBetAmount() { return betAmount; }
    public void setBetAmount(BigDecimal betAmount) { this.betAmount = betAmount; }

    public BigDecimal getPotentialPayout() { return potentialPayout; }
    public void setPotentialPayout(BigDecimal potentialPayout) { this.potentialPayout = potentialPayout; }

    public BigDecimal getActualPayout() { return actualPayout; }
    public void setActualPayout(BigDecimal actualPayout) { this.actualPayout = actualPayout; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getTimePlaced() { return timePlaced; }
    public void setTimePlaced(LocalDateTime timePlaced) { this.timePlaced = timePlaced; }
}