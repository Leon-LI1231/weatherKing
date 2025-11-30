package edu.wisc.cs506.WeatherKings.bets.model.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

/**
 * Request DTO for placing a bet.
 */
public class PlaceBetRequest {
    
    @NotNull(message = "Bet ID is required")
    private Integer betId;
    
    @NotNull(message = "Bet amount is required")
    @DecimalMin(value = "1.00", message = "Minimum bet is $1.00")
    private BigDecimal betAmount;
    
    @NotNull(message = "Username is required")
    private String username;

    public PlaceBetRequest() {}

    public PlaceBetRequest(Integer betId, BigDecimal betAmount, String username) {
        this.betId = betId;
        this.betAmount = betAmount;
        this.username = username;
    }

    public Integer getBetId() { return betId; }
    public void setBetId(Integer betId) { this.betId = betId; }

    public BigDecimal getBetAmount() { return betAmount; }
    public void setBetAmount(BigDecimal betAmount) { this.betAmount = betAmount; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
}