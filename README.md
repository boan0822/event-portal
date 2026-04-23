# Campus Event Portal

A full-stack campus event management system with role-based access control, AI-powered description generation, and containerized deployment.

---

## Features

### For General Users
- Browse all campus events
- Register for events with real-time capacity tracking
- Duplicate registration prevention (same email cannot register twice for the same event)
- User account registration and login

### For Administrators
- Create, update, and delete events
- View full registration list for each event
- Cancel individual registrations
- AI-powered event description generation from keywords

### System
- JWT-based authentication with role separation (USER / ADMIN)
- Fully containerized with Docker Compose
- Auto-generated default admin account on first launch

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Java 17 · Spring Boot 3.2 |
| Security | Spring Security · JWT (jjwt) |
| Database | PostgreSQL 16 · Spring Data JPA · Hibernate |
| Frontend | HTML · CSS · Vanilla JavaScript (Fetch API) |
| AI Integration | Anthropic Claude API |
| DevOps | Docker · Docker Compose |
| Version Control | Git · GitHub |

---

## System Architecture

```
Browser (HTML + CSS + JS)
         │
         │  Fetch API (HTTP requests with JWT Authorization header)
         ▼
┌─────────────────────────────────────────────────┐
│              Spring Boot (port 8080)             │
│                                                  │
│  JwtFilter → Controller → Service → Repository  │
│                               │                  │
│                          AiService               │
│                    (calls Claude API)            │
└─────────────────────────┬───────────────────────┘
                          │
                          ▼
              PostgreSQL Database (port 5432)
              ├── users
              ├── events
              └── registrations
```

### Three-Layer Backend Architecture

| Layer | File | Responsibility |
|-------|------|----------------|
| Controller | `*Controller.java` | Receive HTTP requests, return responses |
| Service | `*Service.java` | Business logic (capacity check, duplicate prevention) |
| Repository | `*Repository.java` | Database operations via JPA |

---

## API Endpoints

### Auth
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/login` | Public | Login and receive JWT token |
| POST | `/api/auth/register` | Public | Register new user account |

### Events
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/events` | Public | Get all events |
| GET | `/api/events/{id}` | Public | Get event by ID |
| POST | `/api/events` | Required | Create new event |
| PUT | `/api/events/{id}` | Required | Update event |
| DELETE | `/api/events/{id}` | Required | Delete event |

### Registrations
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/registrations/event/{eventId}` | Required | Get all registrations for an event |
| POST | `/api/registrations` | Required | Register for an event |
| DELETE | `/api/registrations/{id}` | Required | Cancel a registration |

### AI
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/ai/generate-description` | Required | Generate event description from keywords |

---

## Project Structure

```
event-portal/
├── src/
│   ├── main/
│   │   ├── java/com/github/boan0822/event_portal/
│   │   │   ├── config/
│   │   │   │   ├── DataInitializer.java     # Creates default admin on startup
│   │   │   │   ├── GlobalExceptionHandler.java  # Unified error response format
│   │   │   │   ├── JwtUtil.java             # JWT generate / validate / extract
│   │   │   │   ├── JwtFilter.java           # JWT authentication filter
│   │   │   │   ├── SecurityConfig.java      # Spring Security rules
│   │   │   │   └── WebConfig.java           # CORS settings
│   │   │   ├── controller/
│   │   │   │   ├── AuthController.java      # /api/auth
│   │   │   │   ├── EventController.java     # /api/events
│   │   │   │   ├── RegistrationController.java  # /api/registrations
│   │   │   │   └── AiController.java        # /api/ai
│   │   │   ├── service/
│   │   │   │   ├── EventService.java
│   │   │   │   ├── RegistrationService.java
│   │   │   │   └── AiService.java
│   │   │   ├── repository/
│   │   │   │   ├── UserRepository.java
│   │   │   │   ├── EventRepository.java
│   │   │   │   └── RegistrationRepository.java
│   │   │   ├── model/
│   │   │   │   ├── User.java                # Users table (id, username, password, role)
│   │   │   │   ├── Event.java               # Events table
│   │   │   │   └── Registration.java        # Registrations table (ManyToOne → Event)
│   │   │   ├── dto/
│   │   │   │   ├── AuthRequest.java
│   │   │   │   ├── AuthResponse.java
│   │   │   │   ├── EventRequest.java
│   │   │   │   ├── RegistrationRequest.java
│   │   │   │   └── AiRequest.java
│   │   │   └── EventPortalApplication.java
│   │   └── resources/
│   │       ├── static/
│   │       │   ├── index.html               # Main page (event list + create form)
│   │       │   ├── login.html               # Login / Register page
│   │       │   ├── app.js                   # Main page logic
│   │       │   ├── auth.js                  # Auth logic (login, register, JWT management)
│   │       │   └── style.css
│   │       ├── application.properties
│   │       └── application.properties.example
│   └── test/
├── Dockerfile                               # Multi-stage build (Maven → JRE Alpine)
├── docker-compose.yml                       # App + PostgreSQL services
├── .env.example
├── pom.xml
└── README.md
```

---

## Getting Started

### Prerequisites
- Docker Desktop

### Run with Docker (Recommended)

**1. Clone the repository**
```bash
git clone https://github.com/boan0822/event-portal.git
cd event-portal
```

**2. Set up environment variables**
```bash
cp .env.example .env
```

Edit `.env` and fill in your Anthropic API key:
```
ANTHROPIC_API_KEY=your_api_key_here
```

**3. Set up application properties**
```bash
cp src/main/resources/application.properties.example src/main/resources/application.properties
```

**4. Start all services**
```bash
docker compose up --build
```

**5. Open in browser**
```
http://localhost:8080/login.html
```

Default test admin account (auto-created on first launch):
```
Username: admin
Password: admin123
```

---

### Run Locally (Without Docker)

**Prerequisites:** Java 17, Maven, PostgreSQL

```bash
# Create database
psql -U postgres -c "CREATE DATABASE eventportal;"

# Set environment variable
export ANTHROPIC_API_KEY=your_key_here   # Mac/Linux
$env:ANTHROPIC_API_KEY="your_key_here"   # Windows PowerShell

# Run
./mvnw spring-boot:run
```

---

## Authentication Works

1. User logs in via `POST /api/auth/login`
2. Server verifies credentials, returns a **JWT Token**
3. Frontend stores the token in `sessionStorage`
4. Every subsequent API request includes the token in the `Authorization: Bearer <token>` header
5. `JwtFilter` intercepts each request, validates the token, and sets the user's identity in Spring Security context
6. Controllers receive requests with the authenticated user's role already resolved

---

## AI Description Generation

1. Admin enters keywords (e.g. "hackathon, programming, 48 hours, teams")
2. Frontend calls `POST /api/ai/generate-description`
3. Backend sends a prompt to the Claude API with the keywords
4. Claude returns a generated event description in Traditional Chinese
5. The description is automatically filled into the event creation form

The API key is stored server-side only — never exposed to the frontend.

---

## Docker Details

The project uses a **multi-stage Docker build**:

- **Stage 1 (Build):** Uses full Maven + JDK image to compile the project into a `.jar` file
- **Stage 2 (Runtime):** Uses lightweight JRE Alpine image (~180MB) — Maven is not included

`docker-compose.yml` manages two services:
- `db` — PostgreSQL 16, with health check before app starts
- `app` — Spring Boot, waits for `db` to be healthy via `depends_on`

Database data persists across container restarts via a named Docker volume.
