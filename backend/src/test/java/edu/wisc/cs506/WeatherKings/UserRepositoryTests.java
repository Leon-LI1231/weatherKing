package edu.wisc.cs506.WeatherKings;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

@DataJpaTest(properties = {
    // use in-memory H2 database that behaves like MySQL
    "spring.jpa.hibernate.ddl-auto=create-drop",
    "spring.datasource.url=jdbc:h2:mem:testdb;DB_CLOSE_DELAY=-1;MODE=MYSQL",
    "spring.datasource.driverClassName=org.h2.Driver",
    "spring.datasource.username=sa",
    "spring.datasource.password="
})
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
        assertFalse(userRepository.existsByUsername("other"));
    }

    @Test
    void testFindByUsername() {
        // check retrieval by username
        User u = new User();
        u.setUsername("alpha");
        u.setPassword("xyz");
        userRepository.save(u);
        assertTrue(userRepository.findByUsername("alpha").isPresent());
        assertFalse(userRepository.findByUsername("beta").isPresent());
    }
}