package edu.wisc.cs506.WeatherKings.bets.util;

import java.time.LocalDate;
import java.time.ZoneId;

/**
 * Utility class for consistent date calculations across the betting system.
 * Uses a fixed zone so "tomorrow" does not depend on the server's default timezone.
 */
public class DateUtil {

    private static final ZoneId APP_ZONE = ZoneId.of("America/Chicago");

    /**
     * Gets the target date for daily bets (tomorrow).
     * @return LocalDate representing tomorrow
     */
    public static LocalDate getTomorrowDate() {
        return LocalDate.now(APP_ZONE).plusDays(1);
    }

    /**
     * Gets today's date.
     * @return LocalDate representing today
     */
    public static LocalDate getTodayDate() {
        return LocalDate.now(APP_ZONE);
    }
}
