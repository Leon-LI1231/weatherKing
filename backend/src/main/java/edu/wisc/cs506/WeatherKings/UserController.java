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
    public UserController(UserService userService) { this.userService = userService; }

    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> registerUser(@RequestBody Map<String, String> body) {
        String username = body.get("username");
        String email = body.get("email");
        String password = body.get("password");
        String result = userService.registerUser(username, email, password);
        HttpStatus status = result.equals("User registered successfully.") ? HttpStatus.CREATED : HttpStatus.BAD_REQUEST;
        return new ResponseEntity<>(Map.of("message", result), status);
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> loginUser(@RequestBody Map<String, String> body) {
        String username = body.get("username");
        String password = body.get("password");
        String result = userService.loginUser(username, password);
        HttpStatus status = result.equals("Login successful.") ? HttpStatus.OK : HttpStatus.UNAUTHORIZED;
        return new ResponseEntity<>(Map.of("message", result), status);
    }
}
