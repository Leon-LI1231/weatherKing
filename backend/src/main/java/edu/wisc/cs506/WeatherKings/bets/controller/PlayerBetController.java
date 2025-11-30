package edu.wisc.cs506.WeatherKings.bets.controller;

import edu.wisc.cs506.WeatherKings.bets.model.dto.PlaceBetRequest;
import edu.wisc.cs506.WeatherKings.bets.model.dto.PlaceBetResponse;
import edu.wisc.cs506.WeatherKings.bets.model.dto.PlayerBetHistoryResponse;
import edu.wisc.cs506.WeatherKings.bets.service.PlayerBetService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Controller for player betting operations.
 */
@RestController
@RequestMapping("/api/player-bets")
@CrossOrigin(origins = "http://localhost:5173")
public class PlayerBetController {

    private final PlayerBetService playerBetService;

    public PlayerBetController(PlayerBetService playerBetService) {
        this.playerBetService = playerBetService;
    }

    /**
     * Place a bet.
     * POST /api/player-bets/place
     */
    @PostMapping("/place")
    public ResponseEntity<?> placeBet(@Valid @RequestBody PlaceBetRequest request) {
        try {
            PlaceBetResponse response = playerBetService.placeBet(
                request.getUsername(),
                request.getBetId(),
                request.getBetAmount()
            );
            return ResponseEntity.ok(response);
            
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
            
        } catch (IllegalStateException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
            
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to place bet");
            error.put("message", e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }

    /**
     * Get active (unresolved) bets for a user.
     * GET /api/player-bets/active/{username}
     */
    @GetMapping("/active/{username}")
    public ResponseEntity<?> getActiveBets(@PathVariable String username) {
        try {
            List<PlayerBetHistoryResponse> activeBets = playerBetService.getUserActiveBets(username);
            return ResponseEntity.ok(activeBets);
            
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(404).body(error);
        }
    }

    /**
     * Get betting history for a user.
     * GET /api/player-bets/history/{username}
     */
    @GetMapping("/history/{username}")
    public ResponseEntity<?> getBetHistory(@PathVariable String username) {
        try {
            List<PlayerBetHistoryResponse> history = playerBetService.getUserBetHistory(username);
            return ResponseEntity.ok(history);
            
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(404).body(error);
        }
    }
}