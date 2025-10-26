package edu.wisc.cs506.WeatherKings;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class UserController {

    private final UserService userService;

    // Inject UserService through constructor
    public UserController(UserService userService) {
        this.userService = userService;
    }

    // Handle user registration
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        userService.createUser(user);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of("message", "User registered successfully."));
    }

    // Handle user login
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {
        boolean valid = userService.validateUser(request.get("username"), request.get("password"));
        if (valid) {
            return ResponseEntity.ok(Map.of("message", "Login successful."));
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("message", "Invalid credentials."));
    }
}
