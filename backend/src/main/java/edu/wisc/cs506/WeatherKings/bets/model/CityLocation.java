package edu.wisc.cs506.WeatherKings.bets.model;

/**
 * Simple record to hold the name and coordinates of a city.
 */
public record CityLocation(
    String cityName, 
    double latitude, 
    double longitude
) { }
