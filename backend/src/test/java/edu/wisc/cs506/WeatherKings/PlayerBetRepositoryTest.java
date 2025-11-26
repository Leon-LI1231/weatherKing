package edu.wisc.cs506.WeatherKings;

import static org.junit.jupiter.api.Assertions.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

import edu.wisc.cs506.WeatherKings.bets.model.PlayerBet;
import edu.wisc.cs506.WeatherKings.bets.repository.PlayerBetRepository;

@DataJpaTest(properties = {
    "spring.jpa.hibernate.ddl-auto=create-drop",
    "spring.datasource.url=jdbc:h2:mem:testdb;DB_CLOSE_DELAY=-1;MODE=MYSQL",
    "spring.datasource.driverClassName=org.h2.Driver",
    "spring.datasource.username=sa",
    "spring.datasource.password="
})
class PlayerBetRepositoryTest {

    @Autowired
    private PlayerBetRepository playerBetRepository;

    @Autowired
    private TestEntityManager entityManager;

    @Test
    void testFindByUid() {
        // Create test data - uid is the user ID we're searching for
        PlayerBet bet1 = createPlayerBet(1, 101, new BigDecimal("50.00"), null);
        PlayerBet bet2 = createPlayerBet(1, 102, new BigDecimal("25.00"), null);
        PlayerBet bet3 = createPlayerBet(2, 103, new BigDecimal("30.00"), null);

        entityManager.persist(bet1);
        entityManager.persist(bet2);
        entityManager.persist(bet3);
        entityManager.flush();

        // Test
        List<PlayerBet> result = playerBetRepository.findByUid(1);

        assertEquals(2, result.size());
        assertTrue(result.stream().allMatch(b -> b.getUid() == 1));
    }

    @Test
    void testFindByBetId() {
        // Create test data - betId is the bet line we're searching for
        PlayerBet bet1 = createPlayerBet(1, 100, new BigDecimal("50.00"), null);
        PlayerBet bet2 = createPlayerBet(2, 100, new BigDecimal("25.00"), null);
        PlayerBet bet3 = createPlayerBet(3, 100, new BigDecimal("30.00"), null);

        entityManager.persist(bet1);
        entityManager.persist(bet2);
        entityManager.persist(bet3);
        entityManager.flush();

        List<PlayerBet> result = playerBetRepository.findByBetId(100);

        assertEquals(3, result.size());
        assertTrue(result.stream().allMatch(b -> b.getBetId() == 100));
    }

    @Test
    void testFindByUidAndBetSuccessIsNull() {
        PlayerBet pending1 = createPlayerBet(1, 101, new BigDecimal("50.00"), null);
        PlayerBet pending2 = createPlayerBet(1, 102, new BigDecimal("25.00"), null);
        PlayerBet won = createPlayerBet(1, 103, new BigDecimal("30.00"), true);
        PlayerBet lost = createPlayerBet(1, 104, new BigDecimal("20.00"), false);

        entityManager.persist(pending1);
        entityManager.persist(pending2);
        entityManager.persist(won);
        entityManager.persist(lost);
        entityManager.flush();

        List<PlayerBet> result = playerBetRepository.findByUidAndBetSuccessIsNull(1);

        assertEquals(2, result.size());
        assertTrue(result.stream().allMatch(b -> b.getBetSuccess() == null));
    }

    @Test
    void testFindByUidAndBetSuccessIsNotNull() {
        PlayerBet pending = createPlayerBet(1, 101, new BigDecimal("50.00"), null);
        PlayerBet won = createPlayerBet(1, 102, new BigDecimal("25.00"), true);
        PlayerBet lost = createPlayerBet(1, 103, new BigDecimal("30.00"), false);

        entityManager.persist(pending);
        entityManager.persist(won);
        entityManager.persist(lost);
        entityManager.flush();

        List<PlayerBet> result = playerBetRepository.findByUidAndBetSuccessIsNotNull(1);

        assertEquals(2, result.size());
        assertTrue(result.stream().allMatch(b -> b.getBetSuccess() != null));
    }

    private PlayerBet createPlayerBet(Integer uid, Integer betId, BigDecimal amount, Boolean success) {
        PlayerBet bet = new PlayerBet();
        bet.setUid(uid);
        bet.setBetId(betId);
        bet.setBetAmount(amount);
        bet.setBetToPay(amount.multiply(new BigDecimal("2")));
        bet.setBetSuccess(success);
        bet.setTimePlaced(LocalDateTime.now());
        return bet;
    }
}