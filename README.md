# FABRIX - Design. Build. 3D Print your Tiny Home. Pixel by Pixel. 
```markdown
  ___     _     ___   ___   ___  __  __
 │ __│   ╱_╲   │ _ ) │ _ ╲ │_ _│ ╲ ╲╱ ╱
 │ _│   ╱ _ ╲  │ _ ╲ │   ╱  │ │   >  < 
 │_│   ╱_╱ ╲_╲ │___╱ │_│_╲ │___│ ╱_╱╲_╲
                                       
```
## Concept 
## Design choices

## Getting Started

Follow these steps to run the project locally.

### Prerequisites
- [Docker (20.x+)](https://docs.docker.com/get-docker/)
- [Docker Compose (2.x+)](https://docs.docker.com/compose/install/)
- [Git](https://git-scm.com/downloads)

### Installation
```bash
git clone https://github.com/connorzittrauer/CTEC-Demo.git
cd CTEC-Demo
```

## Run with Docker
This project supports both development and production environments via Docker Compose.

### Development
- Hot reloading (Vite, Go Air)
- Local volume mounts
- Shared runtime configuration via `backend/.env`

```bash
docker compose -f docker-compose.dev.yml up --build
```

Frontend: http://localhost:5173  
Backend: http://localhost:8080

### Production
- Optimized builds
- No volume mounts
- Static frontend served via `serve`
- Shared runtime configuration via `backend/.env`

```bash
docker compose up --build
```

--- 

### Running the Application with Docker  
This project supports both **development** and **production** environments using Docker Compose.


### Development Mode
Runs the app with:
* Hot-reloading (Vite + Go Air)
* Local volume mounts for rapid iteration

```bash
docker compose -f docker-compose.dev.yml up --build
```
Access:
* Frontend: http://localhost:5173
* Backend: http://localhost:8080

### Production Mode
Runs the app with:
* Optimized production builds
* No volume mounts
* Static frontend served via `serve`

```bash
docker compose up --build
```

---

### Database Initialization
The PostgreSQL container automatically initializes the schema using:

```
./db/initialize.sql
```
If you need to reset the database:

```bash
docker compose down -v
```


### Notes
* Development and production configurations are intentionally separated to reflect real-world deployment practices.
* Development mode prioritizes speed and flexibility.
* Production mode prioritizes stability and performance.



# Tools/Libaries Used
## Air 
For hot reloading Go
go install github.com/cosmtrek/air@latest

### JWT Configuration
The backend reads the JWT secret from `backend/.env` at runtime.
JWT signing and validation are both handled server-side using `HS256`.

### Runtime Configuration
The backend and database read their runtime settings from `backend/.env`.

Current variables used by the project:

- `JWT_SECRET`
- `DATABASE_URL`
- `CORS_ALLOWED_ORIGIN`
- `POSTGRES_USER`
- `POSTGRES_PASSWORD`
- `POSTGRES_DB`



### PSQL CLI Commands
Open interactive PostgreSQL shell: 
```bash  
docker exec -it auth-db psql -U postgres -d authdb
```
List tables
```bash 
\dt
```

View current users:
```sql 
SELECT * FROM users;
```

Sample output after reseeding or new inserts:
```markdown

 id | first_name | last_name |           email               |                 password                 |         created_at         
----+------------+-----------+-------------------------------------------+--------------------------------------------------------------
  1 | Test       | User      | test_1760...@citytelecoin.com | $2a$10$FAKEHashHere123456789             | 2026-03-27 21:14:53.881312
  2 | Test       | User      | test_1774...@citytelcoin.com  | $2a$10$tFAKEHashHere342342342q3          | 2026-03-27 21:14:53.936665

```

## API Overview
```
/signup   (POST)
├── Description: Registers a new user
├── Handler: `handlers/auth.go → SignupHandler`
├── Request Body:
│   ├── first_name (string, required)
│   ├── last_name  (string, required)
│   ├── email     (string, required)
│   └── password  (string, required)
├── Behavior:
│   ├── Rejects malformed JSON and unknown fields
│   ├── Normalizes the email before validation/storage lookup
│   ├── Validates required fields
│   ├── Enforces password rules (8+ chars, uppercase, lowercase, number)
│   ├── Hashes password using bcrypt
│   ├── Stores user in database
│   └── Returns success message
└── Responses:
    ├── 201 Created
    ├── 400 Bad Request
    └── 500 Internal Server Error

/login   (POST)
├── Description: Authenticates an existing user
├── Handler: `handlers/auth.go → LoginHandler`
├── Request Body:
│   ├── email    (string, required)
│   └── password (string, required)
├── Behavior:
│   ├── Rejects malformed JSON and unknown fields
│   ├── Normalizes the email before lookup
│   ├── Retrieves user from database
│   ├── Compares password using bcrypt
│   ├── Generates JWT token
│   └── Returns token
└── Responses:
    ├── 200 OK (returns JWT)
    ├── 401 Unauthorized
    └── 500 Internal Server Error

/me   (GET)
├── Description: Verifies the current authenticated user
├── Handler: `main.go` (wrapped with middleware)
├── Middleware: `middleware/auth.go → AuthMiddleware`
├── Headers:
│   └── Authorization: Bearer <JWT_TOKEN>
├── Behavior:
│   ├── Validates JWT using the configured server secret
│   ├── Enforces the expected JWT signing method
│   ├── Extracts user email from token
│   └── Returns the authenticated email if the user still exists
└── Responses:
    ├── 200 OK
    └── 401 Unauthorized

/logout   (POST)
├── Description: Logs out the user (client-side token removal)
├── Handler: `handlers/auth.go → LogoutHandler`
├── Behavior:
│   └── Returns success message
└── Responses:
    ├── 200 OK
    └── 405 Method Not Allowed
```

## Testing API Endpoints (cURL)

### /Signup 
```bash
curl -X POST http://localhost:8080/signup \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "John",
    "last_name": "Doe",
    "email": "you@citytelecoin.com",
    "password": "SecurePass1"
  }'
```
#### Response:
```json
{"message":"User created successfully"}
```
### /Login 
```bash
curl -X POST http://localhost:8080/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "you@citytelecoin.com",
    "password": "SecurePass1"
  }'
```
### Response:
```json
{"message":"Login Successful","token":"<JWT_TOKEN>"}
```

### Access Protected Route
Replace <JWT_TOKEN> with the token returned from ```/login```:
```bash
curl -X GET http://localhost:8080/me \
  -H "Authorization: Bearer <JWT_TOKEN>"
```
### Response:
```json
{"message":"Authenticated","email":"you@citytelecoin.com"}
```

## Testing
Although it was not required in the project specs, I felt it important to include light testing suites for our **handlers** and **middleware**.

### 1. Handler Testing
- Handlers are tested using Go’s `httptest` package to simulate HTTP requests and capture responses  
- Tests validate expected status codes and response behavior for `/signup` and `/login`  
- The production database is used for simplicity in this project (instead of mocks or a dedicated test DB)  
- Located in `handlers/auth_test.go`

### 2. Middleware Testing
- Middleware is tested in isolation using Go’s `httptest` package  
- Tests cover:
  - Missing token (unauthorized)
  - Invalid token (rejected)
  - Valid token (request allowed)  
- Ensures JWT authentication properly protects routes  
- Located in `middleware/auth_test.go`


### Running Tests
Since we are using Docker, we need to run the tests in a containerized environment instead of locally. We compose down
first to stop and remove all currently running containers (this avoids 'connection refused' errors): 
```bash
docker compose down
docker compose run --build --rm backend go test -v ./...
```
If the tests are successful, you should see something similiar this in your terminal logs:
```bash
=== RUN   TestSignupHandler
--- PASS: TestSignupHandler (0.08s)
...
PASS
=== RUN   TestAuthMiddleware_ValidToken
--- PASS: TestAuthMiddleware_ValidToken (0.00s)
PASS
```

### Modularization 
The structure of the project is as follows:
//use tree -D here 

I find it is very important to modularize your code, so that no one class 
is either a) assuming too many responsibilities or b) we are not repeating code

### Design References
#### Stripe (Auth Page Animations)
- Signup button vertical shift animation 
- Signup button disabled on empty fields
#### Dribble (Auth Page Splitscreen)
https://dribbble.com/shots/4013348-Login-web-splitscreen
https://piktochart.com/tips/industrial-color-palette
https://dashboard.stripe.com/login
### 

## Demo 
