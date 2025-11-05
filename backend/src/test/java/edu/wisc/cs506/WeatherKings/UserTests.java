package edu.wisc.cs506.WeatherKings;

import static org.junit.jupiter.api.Assertions.*;

import java.time.LocalDateTime;

import org.junit.jupiter.api.Test;

class UserTests {

    @Test
    void testUserGettersSetters() {
        // verify field assignments
        User u = new User();
        u.setUid(1);
        u.setUsername("x");
        u.setEmail("e");
        u.setPassword("p");
        u.setPhoneNumber("123");
        u.setBalanceUsd(5.0);
        u.setDisabled(true);
        LocalDateTime now = LocalDateTime.now();
        u.setCreatedAt(now);
        u.setLastLoginAt(now);

        assertEquals(1, u.getUid());
        assertEquals("x", u.getUsername());
        assertEquals("e", u.getEmail());
        assertEquals("p", u.getPassword());
        assertEquals("123", u.getPhoneNumber());
        assertEquals(5.0, u.getBalanceUsd());
        assertTrue(u.isDisabled());
        assertEquals(now, u.getCreatedAt());
        assertEquals(now, u.getLastLoginAt());
    }
}