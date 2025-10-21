package edu.wisc.cs506.WeatherKings.weather.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

/**
 * DTO for NWS API /points endpoint response
 * The NWS API requires a two-step process:
 * 1. Call /points/{lat},{lon} to get forecast URLs
 * 2. Use those URLs to get actual weather data
 */
@JsonIgnoreProperties(ignoreUnknown = true)  // Ignore fields we don't need
public class PointsResponse {
    private Properties properties;
    
    public Properties getProperties() { 
        return properties; 
    }
    
    public void setProperties(Properties properties) { 
        this.properties = properties; 
    }
    
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Properties {
        private String forecast;           // URL for forecast data
        private String forecastHourly;     // URL for hourly forecast
        
        public String getForecast() { 
            return forecast; 
        }
        
        public void setForecast(String forecast) { 
            this.forecast = forecast; 
        }
        
        public String getForecastHourly() { 
            return forecastHourly; 
        }
        
        public void setForecastHourly(String forecastHourly) { 
            this.forecastHourly = forecastHourly; 
        }
    }
}