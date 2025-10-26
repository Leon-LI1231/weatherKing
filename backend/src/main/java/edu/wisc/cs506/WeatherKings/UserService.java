package edu.wisc.cs506.WeatherKings;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public String createUser(User user) {
        if (userRepository.existsByUsername(user.getUsername())) {
            return "Username already exists";
        }

        // encode password before saving
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        userRepository.save(user);
        return "Account created successfully!";
    }

    public boolean validateUser(String username, String rawPassword) {
        return userRepository.findByUsername(username)
                .map(existing -> passwordEncoder.matches(rawPassword, existing.getPassword()))
                .orElse(false);
    }
}