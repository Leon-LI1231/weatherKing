package edu.wisc.cs506.WeatherKings.weather.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * DTO for actual weather observations from NWS stations.
 * Used for bet resolution to compare against predictions.
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class WeatherObservation {
    private Properties properties;
    
    public Properties getProperties() { return properties; }
    public void setProperties(Properties properties) { this.properties = properties; }
    
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Properties {
        private TemperatureValue temperature;
        
        @JsonProperty("precipitationLastHour")
        private PrecipitationValue precipitationLastHour;
        
        private String textDescription;
        
        public TemperatureValue getTemperature() { return temperature; }
        public void setTemperature(TemperatureValue temperature) { this.temperature = temperature; }
        
        public PrecipitationValue getPrecipitationLastHour() { return precipitationLastHour; }
        public void setPrecipitationLastHour(PrecipitationValue precipitationLastHour) { 
            this.precipitationLastHour = precipitationLastHour; 
        }
        
        public String getTextDescription() { return textDescription; }
        public void setTextDescription(String textDescription) { this.textDescription = textDescription; }
    }
    
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class TemperatureValue {
        private Double value;  // In Celsius from API
        private String unitCode;
        
        public Double getValue() { return value; }
        public void setValue(Double value) { this.value = value; }
        
        public String getUnitCode() { return unitCode; }
        public void setUnitCode(String unitCode) { this.unitCode = unitCode; }
        
        public Double getValueInFahrenheit() {
            if (value == null) return null;
            return (value * 9.0 / 5.0) + 32.0;
        }
    }
    
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class PrecipitationValue {
        private Double value;  // In meters from API
        
        public Double getValue() { return value; }
        public void setValue(Double value) { this.value = value; }
        
        public boolean hasRain() {
            return value != null && value > 0.0;
        }
    }
}