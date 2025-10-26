package edu.wisc.cs506.WeatherKings;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

@DataJpaTest
class UserRepositoryTests {

    @Autowired
    private UserRepository userRepository;

    @Test
    void testExistsByUsername() {
        // save user and verify existence
        User u = new User();
        u.setUsername("kris");
        u.setPassword("abc");
        userRepository.save(u);
        assertTrue(userRepository.existsByUsername("kris"));
    }

    @Test
    void testFindByUsername() {
        // check retrieval by username
        User u = new User();
        u.setUsername("alpha");
        u.setPassword("xyz");
        userRepository.save(u);
        assertTrue(userRepository.findByUsername("alpha").isPresent());
    }
}