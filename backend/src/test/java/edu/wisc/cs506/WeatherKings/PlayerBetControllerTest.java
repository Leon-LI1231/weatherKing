package edu.wisc.cs506.WeatherKings;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Arrays;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import edu.wisc.cs506.WeatherKings.bets.controller.PlayerBetController;
import edu.wisc.cs506.WeatherKings.bets.model.Bet;
import edu.wisc.cs506.WeatherKings.bets.model.dto.PlaceBetResponse;
import edu.wisc.cs506.WeatherKings.bets.model.dto.PlayerBetHistoryResponse;
import edu.wisc.cs506.WeatherKings.bets.service.PlayerBetService;

@WebMvcTest(PlayerBetController.class)
class PlayerBetControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private PlayerBetService playerBetService;

    @Test
    void testPlaceBet_Success() throws Exception {
        PlaceBetResponse response = new PlaceBetResponse(
            1, 1, 
            new BigDecimal("50.00"), 
            new BigDecimal("50.00"),
            new BigDecimal("100.00"),
            new BigDecimal("450.00"),
            "Bet placed successfully!"
        );

        when(playerBetService.placeBet(eq("testuser"), eq(1), any(BigDecimal.class)))
            .thenReturn(response);

        mockMvc.perform(post("/api/player-bets/place")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"username\":\"testuser\",\"betId\":1,\"betAmount\":50.00}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.playerBetId").value(1))
                .andExpect(jsonPath("$.betAmount").value(50.00))
                .andExpect(jsonPath("$.message").value("Bet placed successfully!"));
    }

    @Test
    void testPlaceBet_InsufficientBalance() throws Exception {
        when(playerBetService.placeBet(anyString(), anyInt(), any(BigDecimal.class)))
            .thenThrow(new IllegalStateException("Insufficient balance"));

        mockMvc.perform(post("/api/player-bets/place")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"username\":\"testuser\",\"betId\":1,\"betAmount\":1000.00}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Insufficient balance"));
    }

    @Test
    void testPlaceBet_BetClosed() throws Exception {
        when(playerBetService.placeBet(anyString(), anyInt(), any(BigDecimal.class)))
            .thenThrow(new IllegalStateException("Bet is closed"));

        mockMvc.perform(post("/api/player-bets/place")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"username\":\"testuser\",\"betId\":1,\"betAmount\":50.00}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Bet is closed"));
    }

    @Test
    void testPlaceBet_UserNotFound() throws Exception {
        when(playerBetService.placeBet(anyString(), anyInt(), any(BigDecimal.class)))
            .thenThrow(new IllegalArgumentException("User not found: unknown"));

        mockMvc.perform(post("/api/player-bets/place")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"username\":\"unknown\",\"betId\":1,\"betAmount\":50.00}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("User not found: unknown"));
    }

    @Test
    void testGetActiveBets_Success() throws Exception {
        Bet bet = new Bet();
        bet.setBetId(1);
        bet.setCityName("Madison, WI");

        PlayerBetHistoryResponse response = new PlayerBetHistoryResponse(
            1, bet,
            new BigDecimal("50.00"),
            new BigDecimal("50.00"),
            BigDecimal.ZERO,
            "PENDING",
            LocalDateTime.now()
        );

        when(playerBetService.getUserActiveBets("testuser"))
            .thenReturn(Arrays.asList(response));

        mockMvc.perform(get("/api/player-bets/active/testuser"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].status").value("PENDING"))
                .andExpect(jsonPath("$[0].betAmount").value(50.00));
    }

    @Test
    void testGetActiveBets_UserNotFound() throws Exception {
        when(playerBetService.getUserActiveBets("unknown"))
            .thenThrow(new IllegalArgumentException("User not found"));

        mockMvc.perform(get("/api/player-bets/active/unknown"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.error").value("User not found"));
    }

    @Test
    void testGetBetHistory_Success() throws Exception {
        Bet bet = new Bet();
        bet.setBetId(1);

        PlayerBetHistoryResponse wonBet = new PlayerBetHistoryResponse(
            1, bet,
            new BigDecimal("50.00"),
            new BigDecimal("50.00"),
            new BigDecimal("100.00"),
            "WON",
            LocalDateTime.now()
        );

        PlayerBetHistoryResponse lostBet = new PlayerBetHistoryResponse(
            2, bet,
            new BigDecimal("25.00"),
            new BigDecimal("25.00"),
            BigDecimal.ZERO,
            "LOST",
            LocalDateTime.now()
        );

        when(playerBetService.getUserBetHistory("testuser"))
            .thenReturn(Arrays.asList(wonBet, lostBet));

        mockMvc.perform(get("/api/player-bets/history/testuser"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].status").value("WON"))
                .andExpect(jsonPath("$[1].status").value("LOST"));
    }
}