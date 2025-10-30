package edu.wisc.cs506.WeatherKings;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.password.PasswordEncoder;

class UserServiceTests {

    private UserRepository repo;
    private PasswordEncoder encoder;
    private UserService service;

    @BeforeEach
    void setup() {
        // mock dependencies
        repo = mock(UserRepository.class);
        encoder = mock(PasswordEncoder.class);
        // inject mocks using constructor
        service = new UserService(repo, encoder);
    }

    @Test
    void testCreateUserSuccess() {
        // new user gets saved
        User u = new User();
        u.setUsername("new");
        u.setPassword("p");
        when(repo.existsByUsername("new")).thenReturn(false);
        when(encoder.encode("p")).thenReturn("hashed");
        String result = service.createUser(u);
        assertEquals("Account created successfully!", result);
        verify(repo).save(u);
        assertEquals("hashed", u.getPassword());
    }

    @Test
    void testCreateUserDuplicate() {
        // duplicate username blocked
        User u = new User();
        u.setUsername("dup");
        when(repo.existsByUsername("dup")).thenReturn(true);
        String result = service.createUser(u);
        assertEquals("Username already exists", result);
        verify(repo, never()).save(any());
    }

    @Test
    void testValidateUserSuccess() {
        // valid password matches
        User u = new User();
        u.setPassword("hashed");
        when(repo.findByUsername("kris")).thenReturn(Optional.of(u));
        when(encoder.matches("raw", "hashed")).thenReturn(true);
        assertTrue(service.validateUser("kris", "raw"));
    }

    @Test
    void testValidateUserFail() {
        // invalid username returns false
        when(repo.findByUsername("none")).thenReturn(Optional.empty());
        assertFalse(service.validateUser("none", "x"));
    }
}