#  Campus Event Portal

A full-stack event management system for campus activities,  
featuring AI-powered description generation and containerized deployment.

##  Features

- **Event Management** — Create, browse, and delete campus events with full CRUD operations
- **Event Registration** — Register for events with duplicate and capacity validation
- **AI Description Generator** — Auto-generate event descriptions from keywords using Claude AI
- **Containerized Deployment** — Fully dockerized with Docker Compose for one-command startup

##  Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Java 17 · Spring Boot 3.2 |
| Database | PostgreSQL 16 · Spring Data JPA |
| Frontend | HTML · CSS · Vanilla JavaScript |
| AI Integration | Anthropic Claude API |
| DevOps | Docker · Docker Compose |
| Version Control | Git · GitHub |

##  System Architecture
Browser (HTML + JS)
│  Fetch API
▼
Spring Boot (port 8080)
├── Controller  → handles HTTP routes
├── Service     → business logic (capacity check, duplicate prevention)
├── Repository  → database access via JPA
└── AI Service  → calls Claude API for description generation
│
▼
PostgreSQL (port 5432)
├── events
└── registrations
##  Getting Started

### Prerequisites
- Docker Desktop

### Run with Docker 

**1. Clone the repository**
```bash
git clone https://github.com/boan0822/event-portal.git
cd event-portal
```

**2. Set up environment variables**
```bash
cp src/main/resources/application.properties.example src/main/resources/application.properties
# Edit application.properties with your database password

cp .env.example .env
# Edit .env and fill in your Anthropic API key
```

**3. Start all services**
```bash
docker compose up --build
```

**4. Open in browser**
http://localhost:8080
### Run Locally (Without Docker)

**Prerequisites:** Java 17, Maven, PostgreSQL

```bash
# Create database
psql -U postgres -c "CREATE DATABASE eventportal;"

# Run the application
./mvnw spring-boot:run
```

##  API Endpoints

### Events
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/events` | Get all events |
| GET | `/api/events/{id}` | Get event by ID |
| POST | `/api/events` | Create new event |
| PUT | `/api/events/{id}` | Update event |
| DELETE | `/api/events/{id}` | Delete event |

### Registrations
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/registrations/event/{eventId}` | Get registrations for an event |
| POST | `/api/registrations` | Register for an event |
| DELETE | `/api/registrations/{id}` | Cancel registration |

### AI
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/ai/generate-description` | Generate event description from keywords |

##  Project Structure
event-portal/
├── src/main/java/com/github/boan0822/event_portal/
│   ├── controller/          # REST API routes
│   ├── service/             # Business logic
│   ├── repository/          # Database access
│   ├── model/               # JPA entities
│   ├── dto/                 # Request/Response schemas
│   └── config/              # CORS and app config
├── src/main/resources/
│   ├── static/              # Frontend (HTML, CSS, JS)
│   └── application.properties
├── Dockerfile               # Multi-stage build
├── docker-compose.yml       # Multi-container setup
└── pom.xml                  # Maven dependencies
