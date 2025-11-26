package edu.wisc.cs506.WeatherKings.bets.service;

import edu.wisc.cs506.WeatherKings.User;
import edu.wisc.cs506.WeatherKings.UserRepository;
import edu.wisc.cs506.WeatherKings.bets.model.Bet;
import edu.wisc.cs506.WeatherKings.bets.model.PlayerBet;
import edu.wisc.cs506.WeatherKings.bets.model.dto.PlaceBetResponse;
import edu.wisc.cs506.WeatherKings.bets.model.dto.PlayerBetHistoryResponse;
import edu.wisc.cs506.WeatherKings.bets.repository.BetRepository;
import edu.wisc.cs506.WeatherKings.bets.repository.PlayerBetRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service for handling player bet operations including placement and history.
 */
@Service
public class PlayerBetService {

    private final PlayerBetRepository playerBetRepository;
    private final BetRepository betRepository;
    private final UserRepository userRepository;

    public PlayerBetService(PlayerBetRepository playerBetRepository,
                           BetRepository betRepository,
                           UserRepository userRepository) {
        this.playerBetRepository = playerBetRepository;
        this.betRepository = betRepository;
        this.userRepository = userRepository;
    }

    /**
     * Place a bet for a user on a specific bet line.
     */
    @Transactional
    public PlaceBetResponse placeBet(String username, Integer betId, BigDecimal amount) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + username));

        Bet bet = betRepository.findById(betId)
                .orElseThrow(() -> new IllegalArgumentException("Bet not found: " + betId));

        if (bet.getBetClose() != null && LocalDateTime.now().isAfter(bet.getBetClose())) {
            throw new IllegalStateException("Bet is closed");
        }

        BigDecimal userBalance = BigDecimal.valueOf(user.getBalanceUsd());
        if (userBalance.compareTo(amount) < 0) {
            throw new IllegalStateException("Insufficient balance");
        }

        BigDecimal potentialPayout = calculatePayout(amount, bet.getMoneylineOdds());
        BigDecimal totalReturn = amount.add(potentialPayout);

        user.setBalanceUsd(userBalance.subtract(amount).doubleValue());
        userRepository.save(user);

        bet.setTotalAmountBet(bet.getTotalAmountBet().add(amount));
        betRepository.save(bet);

        PlayerBet playerBet = new PlayerBet();
        playerBet.setUid(user.getUid());
        playerBet.setBetId(betId);
        playerBet.setBetAmount(amount);
        playerBet.setBetToPay(totalReturn);
        playerBet.setTimePlaced(LocalDateTime.now());
        playerBet = playerBetRepository.save(playerBet);

        return new PlaceBetResponse(
            playerBet.getPlayerBetId(),
            betId,
            amount,
            potentialPayout,
            totalReturn,
            BigDecimal.valueOf(user.getBalanceUsd()),
            "Bet placed successfully!"
        );
    }

    /**
     * Get all active (unresolved) bets for a user.
     */
    public List<PlayerBetHistoryResponse> getUserActiveBets(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        List<PlayerBet> activeBets = playerBetRepository.findByUidAndBetSuccessIsNull(user.getUid());

        return activeBets.stream().map(this::toHistoryResponse).collect(Collectors.toList());
    }

    /**
     * Get betting history for a user.
     */
    public List<PlayerBetHistoryResponse> getUserBetHistory(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        List<PlayerBet> allBets = playerBetRepository.findByUid(user.getUid());

        return allBets.stream().map(this::toHistoryResponse).collect(Collectors.toList());
    }

    /**
     * Calculate payout from wager and American odds.
     */
    public BigDecimal calculatePayout(BigDecimal wager, BigDecimal odds) {
        if (odds.compareTo(BigDecimal.ZERO) >= 0) {
            // Positive odds: payout = wager * (odds / 100)
            return wager.multiply(odds.divide(new BigDecimal("100"), 10, RoundingMode.HALF_UP))
                    .setScale(2, RoundingMode.HALF_UP);
        } else {
            // Negative odds: payout = wager * (100 / |odds|)
            return wager.multiply(new BigDecimal("100").divide(odds.abs(), 10, RoundingMode.HALF_UP))
                    .setScale(2, RoundingMode.HALF_UP);
        }
    }

    private PlayerBetHistoryResponse toHistoryResponse(PlayerBet playerBet) {
        Bet bet = betRepository.findById(playerBet.getBetId()).orElse(null);

        String status;
        BigDecimal actualPayout = BigDecimal.ZERO;

        if (playerBet.getBetSuccess() == null) {
            status = "PENDING";
        } else if (playerBet.getBetSuccess()) {
            status = "WON";
            actualPayout = playerBet.getBetToPay();
        } else {
            status = "LOST";
        }

        BigDecimal potentialPayout = playerBet.getBetToPay() != null ?
                playerBet.getBetToPay().subtract(playerBet.getBetAmount()) : BigDecimal.ZERO;

        return new PlayerBetHistoryResponse(
            playerBet.getPlayerBetId(),
            bet,
            playerBet.getBetAmount(),
            potentialPayout,
            actualPayout,
            status,
            playerBet.getTimePlaced()
        );
    }
}