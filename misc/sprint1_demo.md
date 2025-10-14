# Sprint 1 Demo - WeatherKings Project

**Date:** October 14, 2025  
**Team:** Project 13 - WeatherKings  
**Duration:** 5 minutes

## Demo Objectives
- [ ] Demonstrate successful project setup and infrastructure
- [ ] Show working backend and frontend communication
- [ ] Present basic API functionality
- [ ] Highlight development environment and tools

---

## Demo Flow (5 minutes)

### 1. Introduction
- **What to say:** "Welcome to the WeatherKings Sprint 1 demo. Our goal this sprint was to establish the foundational infrastructure and basic communication between components."
- **Team member:** Sam Christopherson

### 2. Architecture Overview
- **Show:** Project structure in VS Code
- **Highlight:**
  - Spring Boot backend (Java)
  - React frontend
  - MySQL database
  - Docker containerization
- **Navigate through:** File structure showing organized codebase

### 3. Infrastructure Demo
- **Command to run:** `docker-compose up`
- **Show:**
  - Services starting up successfully
  - Backend running on port 8080
  - Frontend running on port 5173
  - Database connectivity

### 4. Backend API Demo 
- **Navigate to:** `http://localhost:8080/api/dummies`
- **Show:**
  - Working Spring Boot application
  - CORS configuration for frontend communication
  - Database connectivity

### 5. Frontend Demo
- **Navigate to:** `http://localhost:5173`
- **Show:**
  - React application loading
  - Basic UI components
  - API call to backend (fetch from `/api/dummies`)
  - Successful frontend-backend communication

---

## Technical Checkpoints

### Before Demo Starts:
- [ ] All services build successfully: `docker-compose build`
- [ ] All services start without errors: `docker-compose up`
- [ ] Backend accessible at `http://localhost:8080`
- [ ] Frontend accessible at `http://localhost:5173`
- [ ] Database connection established
- [ ] Test basic API endpoints

### Backup Plans:
- [ ] If Docker fails: Run services locally
- [ ] If database fails: Show mock data responses
- [ ] If frontend fails: Use Postman to demo backend APIs
- [ ] Have screenshots ready as fallback

---

## Key Messages to Convey

### What We Accomplished:
- ✅ **Infrastructure Setup:** Complete development environment with Docker
- ✅ **Backend Foundation:** Spring Boot application with REST APIs
- ✅ **Frontend Foundation:** React application setup
- ✅ **Database Integration:** MySQL with schema and seed data
- ✅ **Cross-Origin Communication:** CORS properly configured
- ✅ **Development Workflow:** Containerized development environment

### Technical Stack Decisions:
- **Backend:** Spring Boot (Java) for robust enterprise-level development
- **Frontend:** React for modern, responsive UI
- **Database:** MySQL for reliable data persistence
- **Containerization:** Docker for consistent development and deployment
- **Build Tools:** Gradle for backend, npm for frontend

## Post-Demo Next Steps

### Sprint 2 Preview:
- Weather API integration
- User authentication system
- Enhanced UI components
- Data visualization features
- Advanced database operations

---

## Demo Preparation Checklist

### Day Before Demo:
- [ ] Test complete demo flow
- [ ] Prepare backup scenarios
- [ ] Update any documentation
- [ ] Coordinate team member roles

### Day of Demo:
- [ ] Arrive early to test equipment
- [ ] Start services 10 minutes before demo
- [ ] Have backup browser tabs open
- [ ] Prepare for questions about architecture choices

---

## Notes Section
(Use this space for last-minute notes, issues encountered, or feedback received)

