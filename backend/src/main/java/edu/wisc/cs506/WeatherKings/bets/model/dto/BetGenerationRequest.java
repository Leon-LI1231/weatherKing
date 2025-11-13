package edu.wisc.cs506.WeatherKings.bets.model.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

/**
 * Request DTO for generating bets for a specific location.
 */
public class BetGenerationRequest {
    
    @NotBlank(message = "City name is required")
    private String cityName;
    
    @NotNull(message = "Latitude is required")
    @Min(value = -90, message = "Latitude must be between -90 and 90")
    @Max(value = 90, message = "Latitude must be between -90 and 90")
    private Double latitude;
    
    @NotNull(message = "Longitude is required")
    @Min(value = -180, message = "Longitude must be between -180 and 180")
    @Max(value = 180, message = "Longitude must be between -180 and 180")
    private Double longitude;
    
    // Optional - defaults to tomorrow if not provided
    private LocalDate betDate;

    public BetGenerationRequest() {}

    public BetGenerationRequest(String cityName, Double latitude, Double longitude, LocalDate betDate) {
        this.cityName = cityName;
        this.latitude = latitude;
        this.longitude = longitude;
        this.betDate = betDate;
    }

    // Getters and Setters
    public String getCityName() { return cityName; }
    public void setCityName(String cityName) { this.cityName = cityName; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public LocalDate getBetDate() { return betDate; }
    public void setBetDate(LocalDate betDate) { this.betDate = betDate; }
}