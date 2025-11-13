package edu.wisc.cs506.WeatherKings.bets.model.dto;

/**
 * DTO for geocoding API responses.
 */
public class GeocodeResponse {
    private String cityName;
    private double latitude;
    private double longitude;
    private String displayName;
    private String country;

    public GeocodeResponse() {}

    public GeocodeResponse(String cityName, double latitude, double longitude, String displayName, String country) {
        this.cityName = cityName;
        this.latitude = latitude;
        this.longitude = longitude;
        this.displayName = displayName;
        this.country = country;
    }

    // Getters and Setters
    public String getCityName() { return cityName; }
    public void setCityName(String cityName) { this.cityName = cityName; }

    public double getLatitude() { return latitude; }
    public void setLatitude(double latitude) { this.latitude = latitude; }

    public double getLongitude() { return longitude; }
    public void setLongitude(double longitude) { this.longitude = longitude; }

    public String getDisplayName() { return displayName; }
    public void setDisplayName(String displayName) { this.displayName = displayName; }

    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }
}