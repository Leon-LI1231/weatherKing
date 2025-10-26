package edu.wisc.cs506.WeatherKings;

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

    public String createUser(User user) {
        if (userRepository.existsByUsername(user.getUsername())) {
            return "Username already exists";
        }

        userRepository.save(user);
        return "Account created successfully!";
    }

    public boolean validateUser(String username, String rawPassword) {
        Optional<User> existing = userRepository.findByUsername(username);
        return existing.isPresent() && passwordEncoder.matches(rawPassword, existing.get().getPassword());
    }
}