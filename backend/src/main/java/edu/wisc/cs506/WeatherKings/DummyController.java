package edu.wisc.cs506.WeatherKings;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dummies")
@CrossOrigin(origins = "http://localhost:5173")
public class DummyController {
    private final DummyRepository repo;

    public DummyController(DummyRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<Dummy> getAll() {
        return repo.findAll();
    }
}
