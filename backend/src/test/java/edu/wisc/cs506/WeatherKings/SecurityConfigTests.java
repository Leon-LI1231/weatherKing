package edu.wisc.cs506.WeatherKings;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.password.PasswordEncoder;

class SecurityConfigTests {

    @Test
    void testPasswordEncoder() {
        // encoder bean works
        SecurityConfig config = new SecurityConfig();
        PasswordEncoder enc = config.passwordEncoder();
        assertNotNull(enc);
        assertTrue(enc.matches("p", enc.encode("p")));
    }
}
