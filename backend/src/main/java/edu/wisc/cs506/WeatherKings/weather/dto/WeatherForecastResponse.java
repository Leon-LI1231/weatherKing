package edu.wisc.cs506.WeatherKings.weather.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

/**
 * DTO for NWS API forecast response
 * Contains all weather data needed for creating bets:
 * - Temperature (for over/under bets)
 * - Precipitation probability (for rain/snow bets)
 * - Wind speed and direction (for wind bets)
 * - Detailed forecasts (for conditions bets)
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class WeatherForecastResponse {
    private Properties properties;
    
    public Properties getProperties() { 
        return properties; 
    }
    
    public void setProperties(Properties properties) { 
        this.properties = properties; 
    }
    
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Properties {
        private List<Period> periods;  // List of forecast periods (Today, Tonight, Tomorrow, etc.)
        
        public List<Period> getPeriods() { 
            return periods; 
        }
        
        public void setPeriods(List<Period> periods) { 
            this.periods = periods; 
        }
    }
    
    /**
     * Each Period represents a forecast time block (e.g., "Tonight", "Tomorrow", "Wednesday Night")
     * Typically contains 14 periods covering ~7 days
     */
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Period {
        private String name;                    // e.g., "Tonight", "Tomorrow"
        private Integer temperature;            // e.g., 45
        private String temperatureUnit;         // "F" or "C"
        private String windSpeed;               // e.g., "5 to 10 mph"
        private String windDirection;           // e.g., "NW", "SE"
        
        @JsonProperty("probabilityOfPrecipitation")
        private ProbabilityValue probabilityOfPrecipitation;  // Nested object
        
        private String shortForecast;           // e.g., "Partly Cloudy"
        private String detailedForecast;        // Full text description
        
        // Getters and Setters
        public String getName() { 
            return name; 
        }
        
        public void setName(String name) { 
            this.name = name; 
        }
        
        public Integer getTemperature() { 
            return temperature; 
        }
        
        public void setTemperature(Integer temperature) { 
            this.temperature = temperature; 
        }
        
        public String getTemperatureUnit() { 
            return temperatureUnit; 
        }
        
        public void setTemperatureUnit(String unit) { 
            this.temperatureUnit = unit; 
        }
        
        public String getWindSpeed() { 
            return windSpeed; 
        }
        
        public void setWindSpeed(String windSpeed) { 
            this.windSpeed = windSpeed; 
        }
        
        public String getWindDirection() { 
            return windDirection; 
        }
        
        public void setWindDirection(String windDirection) { 
            this.windDirection = windDirection; 
        }
        
        public ProbabilityValue getProbabilityOfPrecipitation() { 
            return probabilityOfPrecipitation; 
        }
        
        public void setProbabilityOfPrecipitation(ProbabilityValue prob) { 
            this.probabilityOfPrecipitation = prob; 
        }
        
        public String getShortForecast() { 
            return shortForecast; 
        }
        
        public void setShortForecast(String forecast) { 
            this.shortForecast = forecast; 
        }
        
        public String getDetailedForecast() { 
            return detailedForecast; 
        }
        
        public void setDetailedForecast(String forecast) { 
            this.detailedForecast = forecast; 
        }
    }
    
    /**
     * Precipitation probability is nested in the JSON as {"value": 20}
     */
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class ProbabilityValue {
        private Integer value;  // 0-100 percentage
        
        public Integer getValue() { 
            return value; 
        }
        
        public void setValue(Integer value) { 
            this.value = value; 
        }
    }
}