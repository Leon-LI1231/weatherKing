package edu.wisc.cs506.WeatherKings;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    private final UserService userService;

    // Inject UserService through constructor
    public UserController(UserService userService) {
        this.userService = userService;
    }

    // Handle user registration
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        String result = userService.createUser(user);
        if (result.equals("Username already exists") || result.equals("Email already exists")) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("message", result));
        }
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of("message", result));
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

    // Get user information by username
    @GetMapping("/user/{username}")
    public ResponseEntity<?> getUserInfo(@PathVariable String username) {
        User user = userService.getUserByUsername(username);
        if (user != null) {
            // Return user info without password
            Map<String, Object> userInfo = Map.of(
                "uid", user.getUid(),
                "username", user.getUsername(),
                "email", user.getEmail(),
                "balanceUsd", user.getBalanceUsd(),
                "createdAt", user.getCreatedAt()
            );
            return ResponseEntity.ok(userInfo);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("message", "User not found."));
    }

    // Handle deposit
    @PostMapping("/deposit")
    public ResponseEntity<?> deposit(@RequestBody Map<String, Object> request) {
        String username = (String) request.get("username");
        Double amount = ((Number) request.get("amount")).doubleValue();
        
        if (amount == null || amount <= 0 || amount > 1000) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Invalid deposit amount."));
        }
        
        boolean success = userService.depositFunds(username, amount);
        if (success) {
            User user = userService.getUserByUsername(username);
            return ResponseEntity.ok(Map.of(
                "message", "Deposit successful!",
                "newBalance", user.getBalanceUsd()
            ));
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("message", "User not found."));
    }
}
