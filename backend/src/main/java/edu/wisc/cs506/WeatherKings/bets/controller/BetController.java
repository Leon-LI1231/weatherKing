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
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import edu.wisc.cs506.WeatherKings.bets.model.Bet;
import edu.wisc.cs506.WeatherKings.bets.service.BetGenerationService;
import edu.wisc.cs506.WeatherKings.bets.service.BetService;

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
}