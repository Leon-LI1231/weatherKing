package edu.wisc.cs506.WeatherKings;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public String registerUser(String username, String email, String plainPassword) {
        if (userRepository.existsByUsername(username)) {
            return "Username already exists.";
        }
        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(plainPassword));
        user.setCreatedAt(LocalDateTime.now());
        userRepository.save(user);
        return "User registered successfully.";
    }

    public String loginUser(String username, String plainPassword) {
        Optional<User> optionalUser = userRepository.findByUsername(username);
        if (optionalUser.isEmpty()) {
            return "User not found.";
        }

        User user = optionalUser.get();
        if (!passwordEncoder.matches(plainPassword, user.getPassword())) {
            return "Invalid password.";
        }

        user.setLastLoginAt(LocalDateTime.now());
        userRepository.save(user);
        return "Login successful.";
    }
}
