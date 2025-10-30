package edu.wisc.cs506.WeatherKings;

import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;

    // constructor injection for easier testing
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // create a new user
    public String createUser(User user) {
        if (userRepository.existsByUsername(user.getUsername())) {
            return "Username already exists";
        }
        // directly save password as provided (no encoding yet)
        userRepository.save(user);
        return "Account created successfully!";
    }

    // validate user credentials (plaintext comparison)
    public boolean validateUser(String username, String rawPassword) {
        return userRepository.findByUsername(username)
                .map(existing -> existing.getPassword().equals(rawPassword))
                .orElse(false);
    }
}