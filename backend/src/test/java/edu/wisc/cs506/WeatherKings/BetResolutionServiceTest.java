package edu.wisc.cs506.WeatherKings;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import edu.wisc.cs506.WeatherKings.bets.model.Bet;
import edu.wisc.cs506.WeatherKings.bets.model.PlayerBet;
import edu.wisc.cs506.WeatherKings.bets.model.dto.GeocodeResponse;
import edu.wisc.cs506.WeatherKings.bets.repository.BetRepository;
import edu.wisc.cs506.WeatherKings.bets.repository.PlayerBetRepository;
import edu.wisc.cs506.WeatherKings.bets.service.BetResolutionService;
import edu.wisc.cs506.WeatherKings.bets.service.GeocodeService;
import edu.wisc.cs506.WeatherKings.weather.dto.WeatherObservation;
import edu.wisc.cs506.WeatherKings.weather.service.WeatherObservationService;

class BetResolutionServiceTest {

    private BetRepository betRepository;
    private PlayerBetRepository playerBetRepository;
    private UserRepository userRepository;
    private WeatherObservationService observationService;
    private GeocodeService geocodeService;
    private BetResolutionService service;

    @BeforeEach
    void setup() {
        betRepository = mock(BetRepository.class);
        playerBetRepository = mock(PlayerBetRepository.class);
        userRepository = mock(UserRepository.class);
        observationService = mock(WeatherObservationService.class);
        geocodeService = mock(GeocodeService.class);
        service = new BetResolutionService(
            betRepository,
            playerBetRepository,
            userRepository,
            observationService,
            geocodeService
        );
    }

    @Test
    void testResolveBet_TemperatureBet_Won() {
        // Arrange
        Bet bet = new Bet();
        bet.setBetId(1);
        bet.setCityName("Madison, WI");
        bet.setBetType("MAX_TEMP_OVER_UNDER");
        bet.setSetLine(new BigDecimal("45.0"));
        bet.setBetHit(null);

        User user = new User();
        user.setUid(1);
        user.setBalanceUsd(400.0);

        PlayerBet playerBet = new PlayerBet();
        playerBet.setPlayerBetId(1);
        playerBet.setUid(1);
        playerBet.setBetId(1);
        playerBet.setBetAmount(new BigDecimal("50.00"));
        playerBet.setBetToPay(new BigDecimal("100.00"));

        GeocodeResponse location = new GeocodeResponse("Madison, WI", 43.0731, -89.4012, "", "");
        
        WeatherObservation observation = createMockObservation(43.0); // 43°F < 45°F → UNDER wins

        when(betRepository.findById(1)).thenReturn(Optional.of(bet));
        when(geocodeService.geocodeCity("Madison, WI")).thenReturn(location);
        when(observationService.getObservationForLocation(43.0731, -89.4012)).thenReturn(observation);
        when(playerBetRepository.findByBetId(1)).thenReturn(Arrays.asList(playerBet));
        when(userRepository.findById(1)).thenReturn(Optional.of(user));

        // Act
        Map<String, Object> result = service.resolveBet(1);

        // Assert
        assertTrue(bet.getBetHit());
        assertEquals(new BigDecimal("43.00"), bet.getOutcomeValue());
        assertTrue(playerBet.getBetSuccess());
        assertEquals(500.0, user.getBalanceUsd()); // 400 + 100
        assertEquals(1, result.get("winnersCount"));
        verify(betRepository).save(bet);
        verify(playerBetRepository).save(playerBet);
        verify(userRepository).save(user);
    }

    @Test
    void testResolveBet_TemperatureBet_Lost() {
        // Arrange
        Bet bet = new Bet();
        bet.setBetId(1);
        bet.setCityName("Madison, WI");
        bet.setBetType("MAX_TEMP_OVER_UNDER");
        bet.setSetLine(new BigDecimal("45.0"));
        bet.setBetHit(null);

        User user = new User();
        user.setUid(1);
        user.setBalanceUsd(400.0);

        PlayerBet playerBet = new PlayerBet();
        playerBet.setUid(1);
        playerBet.setBetId(1);
        playerBet.setBetAmount(new BigDecimal("50.00"));
        playerBet.setBetToPay(new BigDecimal("100.00"));

        GeocodeResponse location = new GeocodeResponse("Madison, WI", 43.0731, -89.4012, "", "");
        WeatherObservation observation = createMockObservation(47.0); // 47°F > 45°F → UNDER loses

        when(betRepository.findById(1)).thenReturn(Optional.of(bet));
        when(geocodeService.geocodeCity("Madison, WI")).thenReturn(location);
        when(observationService.getObservationForLocation(43.0731, -89.4012)).thenReturn(observation);
        when(playerBetRepository.findByBetId(1)).thenReturn(Arrays.asList(playerBet));
        when(userRepository.findById(1)).thenReturn(Optional.of(user));

        // Act
        Map<String, Object> result = service.resolveBet(1);

        // Assert
        assertFalse(bet.getBetHit());
        assertFalse(playerBet.getBetSuccess());
        assertEquals(400.0, user.getBalanceUsd()); // No payout
        assertEquals(0, result.get("winnersCount"));
    }

    @Test
    void testResolveBet_AlreadyResolved_ThrowsException() {
        Bet bet = new Bet();
        bet.setBetId(1);
        bet.setBetHit(true);

        when(betRepository.findById(1)).thenReturn(Optional.of(bet));

        assertThrows(IllegalStateException.class, () -> {
            service.resolveBet(1);
        });
    }

    @Test
    void testResolveBet_BetNotFound_ThrowsException() {
        when(betRepository.findById(999)).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class, () -> {
            service.resolveBet(999);
        });
    }

    @Test
    void testResolveDailyBets() {
        LocalDate date = LocalDate.now();

        Bet bet1 = new Bet();
        bet1.setBetId(1);
        bet1.setCityName("Madison, WI");
        bet1.setBetType("MAX_TEMP_OVER_UNDER");
        bet1.setSetLine(new BigDecimal("45.0"));
        bet1.setBetHit(null);

        Bet bet2 = new Bet();
        bet2.setBetId(2);
        bet2.setCityName("Madison, WI");
        bet2.setBetType("MAX_TEMP_OVER_UNDER");
        bet2.setSetLine(new BigDecimal("50.0"));
        bet2.setBetHit(null);

        GeocodeResponse location = new GeocodeResponse("Madison, WI", 43.0731, -89.4012, "", "");
        WeatherObservation observation = createMockObservation(43.0);

        when(betRepository.findByBetDate(date)).thenReturn(Arrays.asList(bet1, bet2));
        when(betRepository.findById(anyInt())).thenAnswer(inv -> {
            int id = inv.getArgument(0);
            return id == 1 ? Optional.of(bet1) : Optional.of(bet2);
        });
        when(geocodeService.geocodeCity(anyString())).thenReturn(location);
        when(observationService.getObservationForLocation(anyDouble(), anyDouble())).thenReturn(observation);
        when(playerBetRepository.findByBetId(anyInt())).thenReturn(Arrays.asList());

        // Act
        Map<String, Object> summary = service.resolveDailyBets(date);

        // Assert
        assertEquals(2, summary.get("totalBetsResolved"));
        assertEquals(date, summary.get("date"));
    }

    private WeatherObservation createMockObservation(double fahrenheit) {
        WeatherObservation obs = new WeatherObservation();
        WeatherObservation.Properties props = new WeatherObservation.Properties();
        WeatherObservation.TemperatureValue temp = new WeatherObservation.TemperatureValue();
        
        double celsius = (fahrenheit - 32.0) * 5.0 / 9.0;
        temp.setValue(celsius);
        
        props.setTemperature(temp);
        obs.setProperties(props);
        
        return obs;
    }
}