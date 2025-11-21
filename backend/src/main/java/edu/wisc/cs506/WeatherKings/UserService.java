package edu.wisc.cs506.WeatherKings;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // constructor injection for easier testing
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // create a new user
    public String createUser(User user) {
        if (userRepository.existsByUsername(user.getUsername())) {
            return "Username already exists";
        }
        if (userRepository.existsByEmail(user.getEmail())) {
            return "Email already exists";
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);
        return "Account created successfully!";
    }

    // validate user credentials
    public boolean validateUser(String username, String rawPassword) {
        return userRepository.findByUsername(username)
                .map(existing -> passwordEncoder.matches(rawPassword, existing.getPassword()))
                .orElse(false);
    }

    // get user by username
    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username).orElse(null);
    }

    // deposit funds to user account
    public boolean depositFunds(String username, Double amount) {
        return userRepository.findByUsername(username)
                .map(user -> {
                    user.setBalanceUsd(user.getBalanceUsd() + amount);
                    userRepository.save(user);
                    return true;
                })
                .orElse(false);
    }
}
