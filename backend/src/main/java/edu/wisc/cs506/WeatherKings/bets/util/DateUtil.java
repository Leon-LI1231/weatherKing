package edu.wisc.cs506.WeatherKings.bets.util;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

/**
 * Utility class for consistent date calculations across the betting system.
 */
public class DateUtil {
    
    /**
     * Gets the target date for daily bets (tomorrow).
     * This method ensures consistent date calculation across all services.
     * @return LocalDate representing tomorrow
     */
    public static LocalDate getTomorrowDate() {
        return LocalDate.now().plus(1, ChronoUnit.DAYS);
    }
    
    /**
     * Gets today's date.
     * @return LocalDate representing today
     */
    public static LocalDate getTodayDate() {
        return LocalDate.now();
    }
}