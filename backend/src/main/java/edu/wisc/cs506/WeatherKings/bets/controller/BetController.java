package edu.wisc.cs506.WeatherKings.bets.controller;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import edu.wisc.cs506.WeatherKings.bets.model.Bet;
import edu.wisc.cs506.WeatherKings.bets.model.dto.BetGenerationRequest;
import edu.wisc.cs506.WeatherKings.bets.service.BetGenerationService;
import edu.wisc.cs506.WeatherKings.bets.service.BetService;
import edu.wisc.cs506.WeatherKings.bets.util.DateUtil;
import jakarta.validation.Valid;

/**
 * REST controller for managing and fetching betting lines.
 */
@RestController
@RequestMapping("/api/bets")
@CrossOrigin(origins = "http://localhost:5173")
public class BetController {

    private final BetGenerationService betGenerationService;
    private final BetService betService;

    public BetController(BetGenerationService betGenerationService, BetService betService) {
        this.betGenerationService = betGenerationService;
        this.betService = betService;
    }

    /**
     * Endpoint for the frontend to fetch all available bets for the next day.
     * URL: GET /api/bets/daily
     * @return List of Bet lines.
     */
    @GetMapping("/daily")
    public ResponseEntity<List<Bet>> getDailyBets() {
        List<Bet> dailyBets = betService.getDailyBetsForNextDay();
        return ResponseEntity.ok(dailyBets);
    }

    /**
     * Endpoint to manually trigger the generation of new bets for the next day.
     * URL: POST /api/bets/generate-daily
     * @return List of the newly created Bet lines.
     */
    @PostMapping("/generate-daily")
    public ResponseEntity<List<Bet>> generateDailyBets() {
        List<Bet> newBets = betGenerationService.generateDailyBets();
        return ResponseEntity.ok(newBets);
    }

    /**
     * Endpoint to generate bets for any city given coordinates.
     * URL: POST /api/bets/generate-for-location
     * @param request Contains city name, coordinates, and optional date
     * @return List of newly created Bet lines
     */
    @PostMapping("/generate-for-location")
    public ResponseEntity<?> generateBetsForLocation(@Valid @RequestBody BetGenerationRequest request) {
        try {
            // Validate date is not in the past
            LocalDate targetDate = request.getBetDate() != null ? 
                                  request.getBetDate() : 
                                  DateUtil.getTomorrowDate();
            
            if (targetDate.isBefore(LocalDate.now())) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Cannot generate bets for past dates");
                return ResponseEntity.badRequest().body(error);
            }
            
            // Check if bets already exist for this city and date
            List<Bet> existingBets = betService.getBetsForCityAndDate(
                request.getCityName(), 
                targetDate
            );
            
            if (!existingBets.isEmpty()) {
                // Return existing bets instead of creating duplicates
                Map<String, Object> response = new HashMap<>();
                response.put("message", "Bets already exist for this city and date");
                response.put("bets", existingBets);
                return ResponseEntity.ok(response);
            }
            
            // Generate new bets
            List<Bet> newBets = betGenerationService.generateBetsForLocation(
                request.getCityName(),
                request.getLatitude(),
                request.getLongitude(),
                targetDate
            );
            
            return ResponseEntity.status(201).body(newBets);
            
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to generate bets");
            error.put("message", e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }
}