package edu.wisc.cs506.WeatherKings;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import edu.wisc.cs506.WeatherKings.bets.model.Bet;
import edu.wisc.cs506.WeatherKings.bets.model.PlayerBet;
import edu.wisc.cs506.WeatherKings.bets.model.dto.PlaceBetResponse;
import edu.wisc.cs506.WeatherKings.bets.model.dto.PlayerBetHistoryResponse;
import edu.wisc.cs506.WeatherKings.bets.repository.BetRepository;
import edu.wisc.cs506.WeatherKings.bets.repository.PlayerBetRepository;
import edu.wisc.cs506.WeatherKings.bets.service.PlayerBetService;

class PlayerBetServiceTest {

    private PlayerBetRepository playerBetRepository;
    private BetRepository betRepository;
    private UserRepository userRepository;
    private PlayerBetService service;

    @BeforeEach
    void setup() {
        playerBetRepository = mock(PlayerBetRepository.class);
        betRepository = mock(BetRepository.class);
        userRepository = mock(UserRepository.class);
        service = new PlayerBetService(playerBetRepository, betRepository, userRepository);
    }

    @Test
    void testPlaceBet_Success() {
        // Arrange
        User user = new User();
        user.setUid(1);
        user.setUsername("testuser");
        user.setBalanceUsd(500.0);

        Bet bet = new Bet();
        bet.setBetId(1);
        bet.setMoneylineOdds(new BigDecimal("100.00"));
        bet.setBetClose(LocalDateTime.now().plusHours(2));
        bet.setTotalAmountBet(BigDecimal.ZERO);

        PlayerBet savedPlayerBet = new PlayerBet();
        savedPlayerBet.setPlayerBetId(1);
        savedPlayerBet.setBetId(1);
        savedPlayerBet.setUid(1);
        savedPlayerBet.setBetAmount(new BigDecimal("50.00"));
        savedPlayerBet.setBetToPay(new BigDecimal("100.00"));

        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(user));
        when(betRepository.findById(1)).thenReturn(Optional.of(bet));
        when(playerBetRepository.save(any(PlayerBet.class))).thenReturn(savedPlayerBet);

        // Act
        PlaceBetResponse response = service.placeBet("testuser", 1, new BigDecimal("50.00"));

        // Assert
        assertNotNull(response);
        assertEquals(1, response.getPlayerBetId());
        assertEquals(0, new BigDecimal("50.00").compareTo(response.getBetAmount()));
        assertEquals(0, new BigDecimal("50.00").compareTo(response.getPotentialPayout()));
        assertEquals(0, new BigDecimal("100.00").compareTo(response.getTotalReturn()));
        assertEquals(450.0, user.getBalanceUsd(), 0.01);
        verify(userRepository).save(user);
        verify(betRepository).save(bet);
        verify(playerBetRepository).save(any(PlayerBet.class));
    }

    @Test
    void testPlaceBet_UserNotFound() {
        when(userRepository.findByUsername("unknown")).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class, () -> {
            service.placeBet("unknown", 1, new BigDecimal("50.00"));
        });
    }

    @Test
    void testPlaceBet_BetNotFound() {
        User user = new User();
        user.setUsername("testuser");
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(user));
        when(betRepository.findById(999)).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class, () -> {
            service.placeBet("testuser", 999, new BigDecimal("50.00"));
        });
    }

    @Test
    void testPlaceBet_BetClosed() {
        User user = new User();
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(user));

        Bet bet = new Bet();
        bet.setBetClose(LocalDateTime.now().minusHours(1));
        when(betRepository.findById(1)).thenReturn(Optional.of(bet));

        assertThrows(IllegalStateException.class, () -> {
            service.placeBet("testuser", 1, new BigDecimal("50.00"));
        });
    }

    @Test
    void testPlaceBet_InsufficientBalance() {
        User user = new User();
        user.setBalanceUsd(10.0);
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(user));

        Bet bet = new Bet();
        bet.setBetClose(LocalDateTime.now().plusHours(2));
        when(betRepository.findById(1)).thenReturn(Optional.of(bet));

        assertThrows(IllegalStateException.class, () -> {
            service.placeBet("testuser", 1, new BigDecimal("50.00"));
        });
    }

    @Test
    void testCalculatePayout_PositiveOdds() {
        // For +150 odds: payout = wager * (odds / 100)
        // $100 * 1.50 = $150
        BigDecimal payout = service.calculatePayout(new BigDecimal("100.00"), new BigDecimal("150.00"));
        assertEquals(0, new BigDecimal("150.00").compareTo(payout), "Payout should be $150.00");
    }

    @Test
    void testCalculatePayout_NegativeOdds() {
        // For -150 odds: payout = wager * (100 / abs(odds))
        // $150 * (100 / 150) = $100
        BigDecimal payout = service.calculatePayout(new BigDecimal("150.00"), new BigDecimal("-150.00"));
        assertEquals(0, new BigDecimal("100.00").compareTo(payout), "Payout should be $100.00");
    }

    @Test
    void testGetUserActiveBets() {
        User user = new User();
        user.setUid(1);
        user.setUsername("testuser");

        Bet bet = new Bet();
        bet.setBetId(1);

        PlayerBet playerBet = new PlayerBet();
        playerBet.setPlayerBetId(1);
        playerBet.setUid(1);
        playerBet.setBetId(1);
        playerBet.setBetAmount(new BigDecimal("50.00"));
        playerBet.setBetToPay(new BigDecimal("100.00"));
        playerBet.setBetSuccess(null);

        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(user));
        when(playerBetRepository.findByUidAndBetSuccessIsNull(1)).thenReturn(Arrays.asList(playerBet));
        when(betRepository.findById(1)).thenReturn(Optional.of(bet));

        List<PlayerBetHistoryResponse> result = service.getUserActiveBets("testuser");

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("PENDING", result.get(0).getStatus());
    }

    @Test
    void testGetUserBetHistory() {
        User user = new User();
        user.setUid(1);
        user.setUsername("testuser");

        Bet bet = new Bet();
        bet.setBetId(1);

        PlayerBet wonBet = new PlayerBet();
        wonBet.setPlayerBetId(1);
        wonBet.setUid(1);
        wonBet.setBetId(1);
        wonBet.setBetAmount(new BigDecimal("50.00"));
        wonBet.setBetToPay(new BigDecimal("100.00"));
        wonBet.setBetSuccess(true);

        PlayerBet lostBet = new PlayerBet();
        lostBet.setPlayerBetId(2);
        lostBet.setUid(1);
        lostBet.setBetId(1);
        lostBet.setBetAmount(new BigDecimal("25.00"));
        lostBet.setBetToPay(new BigDecimal("50.00"));
        lostBet.setBetSuccess(false);

        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(user));
        when(playerBetRepository.findByUid(1)).thenReturn(Arrays.asList(wonBet, lostBet));
        when(betRepository.findById(1)).thenReturn(Optional.of(bet));

        List<PlayerBetHistoryResponse> result = service.getUserBetHistory("testuser");

        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals("WON", result.get(0).getStatus());
        assertEquals("LOST", result.get(1).getStatus());
    }
}