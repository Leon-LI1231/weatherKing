package edu.wisc.cs506.WeatherKings.bets.model.dto;

import java.math.BigDecimal;

/**
 * Response DTO after placing a bet.
 */
public class PlaceBetResponse {
    private Integer playerBetId;
    private Integer betId;
    private BigDecimal betAmount;
    private BigDecimal potentialPayout;
    private BigDecimal totalReturn;
    private BigDecimal newBalance;
    private String message;

    public PlaceBetResponse() {}

    public PlaceBetResponse(Integer playerBetId, Integer betId, BigDecimal betAmount, 
                           BigDecimal potentialPayout, BigDecimal totalReturn, 
                           BigDecimal newBalance, String message) {
        this.playerBetId = playerBetId;
        this.betId = betId;
        this.betAmount = betAmount;
        this.potentialPayout = potentialPayout;
        this.totalReturn = totalReturn;
        this.newBalance = newBalance;
        this.message = message;
    }

    public Integer getPlayerBetId() { return playerBetId; }
    public void setPlayerBetId(Integer playerBetId) { this.playerBetId = playerBetId; }

    public Integer getBetId() { return betId; }
    public void setBetId(Integer betId) { this.betId = betId; }

    public BigDecimal getBetAmount() { return betAmount; }
    public void setBetAmount(BigDecimal betAmount) { this.betAmount = betAmount; }

    public BigDecimal getPotentialPayout() { return potentialPayout; }
    public void setPotentialPayout(BigDecimal potentialPayout) { this.potentialPayout = potentialPayout; }

    public BigDecimal getTotalReturn() { return totalReturn; }
    public void setTotalReturn(BigDecimal totalReturn) { this.totalReturn = totalReturn; }

    public BigDecimal getNewBalance() { return newBalance; }
    public void setNewBalance(BigDecimal newBalance) { this.newBalance = newBalance; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}