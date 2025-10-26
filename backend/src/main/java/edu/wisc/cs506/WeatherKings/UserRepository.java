package edu.wisc.cs506.WeatherKings;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

// Repository interface for User entity
public interface UserRepository extends JpaRepository<User, Integer> {

    // Check if a username already exists in the database
    boolean existsByUsername(String username);

    // Find a user by their username
    Optional<User> findByUsername(String username);
}
