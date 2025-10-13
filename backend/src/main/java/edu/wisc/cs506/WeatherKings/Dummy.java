package edu.wisc.cs506.WeatherKings;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "DummyTable")
public class Dummy {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "uid", nullable = false)
    private Integer uid;

    @Column(name = "username", nullable = false)
    private String username;

    public Dummy() {}
    public Integer getUid() { return uid; }
    public void setUid(Integer uid) { this.uid = uid; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
}
