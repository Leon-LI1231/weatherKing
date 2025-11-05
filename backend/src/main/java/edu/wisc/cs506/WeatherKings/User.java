package edu.wisc.cs506.WeatherKings;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "users")
public class User {

    // Primary key
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int uid;

    // Username must be unique and not null
    @Column(nullable = false)
    private String username;

    // Optional email field
    @Column(nullable = true)
    private String email;

    // Hashed password (stored securely)
    @Column(nullable = false)
    private String password;

    // Optional phone number
    @Column(name = "phone_number")
    private String phoneNumber;

    // Default balance
    @Column(name = "balance_usd")
    private Double balanceUsd = 0.00;

    // Account status flag
    @Column(name = "is_disabled")
    private boolean isDisabled = false;

    // Timestamp when account is created
    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    // Timestamp for last login
    @Column(name = "last_login_at")
    private LocalDateTime lastLoginAt;

    // Getters and setters
    public int getUid() { return uid; }
    public void setUid(int uid) { this.uid = uid; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

    public Double getBalanceUsd() { return balanceUsd; }
    public void setBalanceUsd(Double balanceUsd) { this.balanceUsd = balanceUsd; }

    public boolean isDisabled() { return isDisabled; }
    public void setDisabled(boolean disabled) { isDisabled = disabled; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getLastLoginAt() { return lastLoginAt; }
    public void setLastLoginAt(LocalDateTime lastLoginAt) { this.lastLoginAt = lastLoginAt; }
}




