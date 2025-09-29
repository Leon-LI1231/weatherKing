# Coding Standards and Conventions

**Stack:** React Native, Spring Boot, MySQL, Docker

## General Principles
- **Readability First:** Write code that is easy to understand and maintain
- **Consistency:** Follow established patterns throughout the codebase
- **DRY & KISS:** Avoid duplication, prefer simple solutions
- **Document:** Comment complex logic and public APIs

---

## Naming Conventions

### Frontend (React Native/JavaScript)
- **Variables/Functions:** `camelCase` → `userName`, `fetchUserData()`
- **Components:** `PascalCase` → `UserProfile`, `LoginScreen`
- **Constants:** `UPPER_SNAKE_CASE` → `API_BASE_URL`, `MAX_RETRY_ATTEMPTS`
- **Files:** Components use `PascalCase.jsx`, utilities use `camelCase.js`

### Backend (Spring Boot/Java)
- **Classes/Interfaces:** `PascalCase` → `UserService`, `UserRepository`
- **Methods/Variables:** `camelCase` → `userName`, `getUserById()`
- **Constants:** `UPPER_SNAKE_CASE` → `MAX_LOGIN_ATTEMPTS`
- **Packages:** `lowercase.with.dots` → `com.project.user.service`

### Database (MySQL)
- **Tables:** `snake_case`, plural → `users`, `order_items`
- **Columns:** `snake_case` → `user_id`, `first_name`, `created_at`
- **Keys:** Primary key is `id`, foreign keys are `{table}_id`

---

## Code Formatting

### Frontend
- **Indentation:** 2 spaces
- **Quotes:** Double quotes
- **Semicolons:** Required
- **Line Length:** 100 characters (soft limit)
- **Braces:** Always use for conditionals/loops
- **Functions:** Prefer arrow functions for callbacks

### Backend
- **Indentation:** 4 spaces
- **Braces:** K&R style (opening brace same line)
- **Line Length:** 120 characters
- **Annotations:** Separate lines above methods

---

## Project Structure

**Frontend:**
```
/src
  /components  /screens  /navigation  /services
  /utils  /hooks  /constants  /assets  /styles
```

**Backend:**
```
/src/main/java/com/project
  /controller  /service  /repository  /model
  /dto  /config  /exception  /util
```

---

## Git Conventions

**Branches:**
- `main` (production), `develop` (development)
- `feature/{name}`, `bugfix/{name}`, `hotfix/{name}`

**Commits:** Use conventional commits
```
<type>: <description>

Types: feat, fix, docs, style, refactor, test, chore
Examples:
  feat: add user authentication endpoint
  fix: resolve null pointer in user service
```

---

## Documentation

**Comment When:**
- Complex algorithms or business logic
- Non-obvious decisions/workarounds
- Public APIs (use JavaDoc/JSDoc)
- TODO items (`// TODO:`)

**Don't Comment:** Self-explanatory or redundant code

**API Docs:** Use Swagger/OpenAPI for backend, TypeScript/PropTypes for frontend

---

## Testing

**File Naming:**
- Frontend: `ComponentName.test.js`
- Backend: `ClassNameTest.java`

**Structure:** Follow AAA (Arrange, Act, Assert)
**Naming:** Descriptive names explaining what's tested
```javascript
it('should display user name when loaded', () => {})
```
```java
void shouldReturnUserWhenValidIdProvided() {}
```

---

## Docker

**Files:** `Dockerfile`, `Dockerfile.dev`, `docker-compose.yml`, `docker-compose.dev.yml`
**Images:** Use lowercase with hyphens → `project-name-frontend`

---

## Code Review Checklist
- [ ] Follows style guide
- [ ] All tests pass
- [ ] No commented-out code (unless explained)
- [ ] No debug statements (`console.log`, `System.out.println`)
- [ ] Documentation updated if needed

---

## Tools
- **Frontend:** ESLint, Prettier
- **Backend:** Checkstyle, SonarLint
- **Git Hooks:** Consider Husky for pre-commit checks

---

**Note:** This is a living document. Update as team conventions evolve.

**Last Updated:** [Date] | **Version:** 1.0