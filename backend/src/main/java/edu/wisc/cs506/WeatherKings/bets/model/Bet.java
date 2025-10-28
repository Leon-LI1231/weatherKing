package edu.wisc.cs506.WeatherKings.bets.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * JPA Entity for the 'bets' table.
 * This version maps to the *new, enhanced* schema including dedicated fields for 
 * city, date, and moneyline odds.
 */
@Entity
@Table(name = "bets")
public class Bet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "bet_id", nullable = false)
    private Integer betId;

    @Column(name = "city_name", nullable = false, length = 50)
    private String cityName;

    @Column(name = "bet_date", nullable = false)
    private LocalDate betDate;

    @Column(name = "bet_description", nullable = false, length = 255)
    private String betDescription;
    
    @Column(name = "bet_type", nullable = false, length = 50)
    private String betType; 

    @Column(name = "set_line", precision = 12, scale = 1)
    private BigDecimal setLine;
    
    // Dedicated column for the odds (e.g., 100.00 for +100)
    @Column(name = "moneyline_odds", precision = 12, scale = 2)
    private BigDecimal moneylineOdds; 

    @Column(name = "outcome_value", precision = 12, scale = 2)
    private BigDecimal outcomeValue;
    
    @Column(name = "total_amount_bet", nullable = false, precision = 12, scale = 2)
    private BigDecimal totalAmountBet = BigDecimal.ZERO; 

    @Column(name = "bet_hit")
    private Boolean betHit; // Null if unresolved

    @Column(name = "bet_start", nullable = false)
    private LocalDateTime betStart = LocalDateTime.now();

    @Column(name = "bet_close")
    private LocalDateTime betClose;
    
    public Bet() {}

    // --- Getters and Setters ---
    public Integer getBetId() { return betId; }
    public void setBetId(Integer betId) { this.betId = betId; }
    
    public String getCityName() { return cityName; }
    public void setCityName(String cityName) { this.cityName = cityName; }

    public LocalDate getBetDate() { return betDate; }
    public void setBetDate(LocalDate betDate) { this.betDate = betDate; }

    public String getBetDescription() { return betDescription; }
    public void setBetDescription(String betDescription) { this.betDescription = betDescription; }

    public String getBetType() { return betType; }
    public void setBetType(String betType) { this.betType = betType; }

    public BigDecimal getSetLine() { return setLine; }
    public void setSetLine(BigDecimal setLine) { this.setLine = setLine; }
    
    public BigDecimal getMoneylineOdds() { return moneylineOdds; }
    public void setMoneylineOdds(BigDecimal moneylineOdds) { this.moneylineOdds = moneylineOdds; }

    public BigDecimal getOutcomeValue() { return outcomeValue; }
    public void setOutcomeValue(BigDecimal outcomeValue) { this.outcomeValue = outcomeValue; }

    public BigDecimal getTotalAmountBet() { return totalAmountBet; }
    public void setTotalAmountBet(BigDecimal totalAmountBet) { this.totalAmountBet = totalAmountBet; }

    public Boolean getBetHit() { return betHit; }
    public void setBetHit(Boolean betHit) { this.betHit = betHit; }

    public LocalDateTime getBetStart() { return betStart; }
    public void setBetStart(LocalDateTime betStart) { this.betStart = betStart; }

    public LocalDateTime getBetClose() { return betClose; }
    public void setBetClose(LocalDateTime betClose) { this.betClose = betClose; }
}