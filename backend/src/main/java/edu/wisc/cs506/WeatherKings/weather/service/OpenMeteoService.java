package edu.wisc.cs506.WeatherKings.weather.service;

import com.fasterxml.jackson.databind.JsonNode;
import edu.wisc.cs506.WeatherKings.weather.dto.WeatherForecastResponse;
import edu.wisc.cs506.WeatherKings.weather.dto.WeatherObservation;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.format.TextStyle;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

/**
 * Weather source for locations outside the United States, where api.weather.gov has no coverage.
 * Responses are mapped onto the same DTOs the NWS client produces, so the rest of the
 * system does not care which provider a city uses.
 */
@Service
public class OpenMeteoService {

    private final RestClient restClient;

    public OpenMeteoService(@Value("${openmeteo.api.base-url:https://api.open-meteo.com}") String baseUrl) {
        this.restClient = RestClient.builder().baseUrl(baseUrl).build();
    }

    /** True when the coordinates are inside the area covered by the NWS API. */
    public static boolean isOutsideNwsCoverage(double lat, double lon) {
        boolean conus = lat >= 24.0 && lat <= 50.0 && lon >= -125.0 && lon <= -66.0;
        boolean alaska = lat >= 51.0 && lat <= 72.0 && lon >= -170.0 && lon <= -129.0;
        boolean hawaii = lat >= 18.0 && lat <= 23.0 && lon >= -161.0 && lon <= -154.0;
        return !(conus || alaska || hawaii);
    }

    /**
     * Daily forecast shaped like NWS output: for each day a day period followed by a night period
     * ("Today", "Today Night", "Friday", "Friday Night", ...), temperatures in Fahrenheit.
     */
    public WeatherForecastResponse getForecast(double lat, double lon) {
        JsonNode root = restClient.get()
                .uri(u -> u.path("/v1/forecast")
                        .queryParam("latitude", lat)
                        .queryParam("longitude", lon)
                        .queryParam("daily", "temperature_2m_max,temperature_2m_min,precipitation_probability_max,weather_code")
                        .queryParam("temperature_unit", "fahrenheit")
                        .queryParam("timezone", "auto")
                        .queryParam("forecast_days", 7)
                        .build())
                .retrieve()
                .body(JsonNode.class);

        JsonNode daily = root == null ? null : root.get("daily");
        if (daily == null || daily.get("time") == null) {
            throw new WeatherApiService.WeatherApiException("Invalid Open-Meteo response");
        }

        List<WeatherForecastResponse.Period> periods = new ArrayList<>();
        for (int i = 0; i < daily.get("time").size(); i++) {
            LocalDate date = LocalDate.parse(daily.get("time").get(i).asText());
            String name = i == 0 ? "Today"
                    : DayOfWeek.from(date).getDisplayName(TextStyle.FULL, Locale.ENGLISH);
            int prob = daily.get("precipitation_probability_max").get(i).asInt(0);
            String text = describe(daily.get("weather_code").get(i).asInt(0));

            periods.add(period(name, (int) Math.round(daily.get("temperature_2m_max").get(i).asDouble()), prob, text));
            periods.add(period(name + " Night", (int) Math.round(daily.get("temperature_2m_min").get(i).asDouble()), prob, text));
        }

        WeatherForecastResponse.Properties props = new WeatherForecastResponse.Properties();
        props.setPeriods(periods);
        WeatherForecastResponse response = new WeatherForecastResponse();
        response.setProperties(props);
        return response;
    }

    /** Current conditions mapped onto the NWS observation DTO. */
    public WeatherObservation getObservation(double lat, double lon) {
        JsonNode root = restClient.get()
                .uri(u -> u.path("/v1/forecast")
                        .queryParam("latitude", lat)
                        .queryParam("longitude", lon)
                        .queryParam("current", "temperature_2m,precipitation,weather_code")
                        .queryParam("timezone", "auto")
                        .build())
                .retrieve()
                .body(JsonNode.class);

        JsonNode current = root == null ? null : root.get("current");
        if (current == null) {
            throw new WeatherObservationService.ObservationException("Invalid Open-Meteo response");
        }

        WeatherObservation.TemperatureValue temp = new WeatherObservation.TemperatureValue();
        temp.setValue(current.get("temperature_2m").asDouble());
        temp.setUnitCode("wmoUnit:degC");

        WeatherObservation.PrecipitationValue precip = new WeatherObservation.PrecipitationValue();
        precip.setValue(current.get("precipitation").asDouble(0) / 1000.0); // mm -> m

        WeatherObservation.Properties props = new WeatherObservation.Properties();
        props.setTemperature(temp);
        props.setPrecipitationLastHour(precip);
        props.setTextDescription(describe(current.get("weather_code").asInt(0)));

        WeatherObservation observation = new WeatherObservation();
        observation.setProperties(props);
        return observation;
    }

    private static WeatherForecastResponse.Period period(String name, int temp, int precipProb, String text) {
        WeatherForecastResponse.ProbabilityValue p = new WeatherForecastResponse.ProbabilityValue();
        p.setValue(precipProb);
        WeatherForecastResponse.Period period = new WeatherForecastResponse.Period();
        period.setName(name);
        period.setTemperature(temp);
        period.setTemperatureUnit("F");
        period.setProbabilityOfPrecipitation(p);
        period.setShortForecast(text);
        period.setDetailedForecast(text);
        return period;
    }

    /** WMO weather interpretation codes -> short text understood by the bet logic ("sunny", "clear", ...). */
    static String describe(int code) {
        if (code == 0) return "Sunny";
        if (code <= 2) return "Mostly Clear";
        if (code == 3) return "Cloudy";
        if (code == 45 || code == 48) return "Fog";
        if (code >= 51 && code <= 67) return "Rain";
        if (code >= 71 && code <= 77) return "Snow";
        if (code >= 80 && code <= 82) return "Rain Showers";
        if (code == 85 || code == 86) return "Snow Showers";
        if (code >= 95) return "Thunderstorms";
        return "Cloudy";
    }
}
