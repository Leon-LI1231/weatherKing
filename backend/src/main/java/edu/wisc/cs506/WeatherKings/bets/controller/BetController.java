package edu.wisc.cs506.WeatherKings.bets.controller;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import edu.wisc.cs506.WeatherKings.bets.model.Bet;
import edu.wisc.cs506.WeatherKings.bets.model.dto.BetGenerationRequest;
import edu.wisc.cs506.WeatherKings.bets.service.BetGenerationService;
import edu.wisc.cs506.WeatherKings.bets.service.BetResolutionService;
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
    private final BetResolutionService betResolutionService;

    public BetController(BetGenerationService betGenerationService, 
                        BetService betService,
                        BetResolutionService betResolutionService) {
        this.betGenerationService = betGenerationService;
        this.betService = betService;
        this.betResolutionService = betResolutionService;
    }

    /**
     * Endpoint for the frontend to fetch all available bets for the next day.
     * URL: GET /api/bets/daily
     */
    @GetMapping("/daily")
    public ResponseEntity<List<Bet>> getDailyBets() {
        List<Bet> dailyBets = betService.getDailyBetsForNextDay();
        return ResponseEntity.ok(dailyBets);
    }

    /**
     * Endpoint to manually trigger the generation of new bets for the next day.
     * URL: POST /api/bets/generate-daily
     */
    @PostMapping("/generate-daily")
    public ResponseEntity<List<Bet>> generateDailyBets() {
        List<Bet> newBets = betGenerationService.generateDailyBets();
        return ResponseEntity.ok(newBets);
    }

    /**
     * Endpoint to generate bets for any city given coordinates.
     * URL: POST /api/bets/generate-for-location
     */
    @PostMapping("/generate-for-location")
    public ResponseEntity<?> generateBetsForLocation(@Valid @RequestBody BetGenerationRequest request) {
        try {
            LocalDate targetDate = request.getBetDate() != null ? 
                                  request.getBetDate() : 
                                  DateUtil.getTomorrowDate();
            
            if (targetDate.isBefore(LocalDate.now())) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Cannot generate bets for past dates");
                return ResponseEntity.badRequest().body(error);
            }
            
            List<Bet> existingBets = betService.getBetsForCityAndDate(
                request.getCityName(), 
                targetDate
            );
            
            if (!existingBets.isEmpty()) {
                Map<String, Object> response = new HashMap<>();
                response.put("message", "Bets already exist for this city and date");
                response.put("bets", existingBets);
                return ResponseEntity.ok(response);
            }
            
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

    /**
     * Resolve a specific bet by fetching actual weather data.
     * URL: POST /api/bets/resolve/{betId}
     */
    @PostMapping("/resolve/{betId}")
    public ResponseEntity<?> resolveBet(@PathVariable Integer betId) {
        try {
            Map<String, Object> result = betResolutionService.resolveBet(betId);
            return ResponseEntity.ok(result);
            
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(404).body(error);
            
        } catch (IllegalStateException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
            
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to resolve bet");
            error.put("message", e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }

    /**
     * Resolve all bets for a specific date.
     * URL: POST /api/bets/resolve-daily?date=2025-11-27
     */
    @PostMapping("/resolve-daily")
    public ResponseEntity<?> resolveDailyBets(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        try {
            Map<String, Object> summary = betResolutionService.resolveDailyBets(date);
            return ResponseEntity.ok(summary);
            
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to resolve daily bets");
            error.put("message", e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }
}