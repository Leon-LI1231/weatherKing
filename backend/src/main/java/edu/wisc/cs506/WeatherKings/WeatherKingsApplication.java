package edu.wisc.cs506.WeatherKings;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling; 
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;


@SpringBootApplication
@RestController
@EnableScheduling 
public class WeatherKingsApplication {

    public static void main(String[] args) {
        SpringApplication.run(WeatherKingsApplication.class, args);
    }

    @GetMapping("/")
    public String hello(@RequestParam(value = "name", defaultValue = "World") String name) {
        return String.format("Hello %s!", name);
    }
}
@RestController
@CrossOrigin(origins = "http://localhost:5173")
class HelloController { // temporary function to test if we can fetch this from frontend
    @GetMapping("/api/hello")
    public String hello() {
        return "This message is created in WeatherKings Application.java";
    }
}
