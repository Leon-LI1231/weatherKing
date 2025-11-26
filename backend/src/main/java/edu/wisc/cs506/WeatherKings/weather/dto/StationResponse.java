package edu.wisc.cs506.WeatherKings.weather.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.util.List;

/**
 * DTO for NWS stations endpoint response.
 * Used to find nearest weather station for a location.
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class StationResponse {
    private List<String> observationStations;
    
    public List<String> getObservationStations() { return observationStations; }
    public void setObservationStations(List<String> observationStations) { 
        this.observationStations = observationStations; 
    }
}