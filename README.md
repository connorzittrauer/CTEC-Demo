# FRABIX - Tiny Home 3D Printing
## Concept 
## Design choices 
FABRIX is a small full-stack authentication demo built for the CTC coding challenge. It includes:

- User signup with server-side validation
- User login with bcrypt password verification
- JWT-based authenticated session checks
- Client-side logout
- Dockerized frontend, backend, and PostgreSQL services

## Stack

- Frontend: React, TypeScript, Vite, Tailwind CSS
- Backend: Go, `net/http`, PostgreSQL, `bcrypt`, JWT
- Infrastructure: Docker, Docker Compose

## Project Structure

```text
frontend/   React client
backend/    Go API
db/         PostgreSQL schema initialization
```

## Clone the Repository

```bash
git clone https://github.com/connorzittrauer/CTEC-Demo.git
cd CTEC-Demo
```

## Running the Project

Recommended usage:

- Use the production-style Compose run if you are cloning the repo to evaluate or test the submission quickly.
- Use the development Compose run only if you want hot reload and plan to modify the code locally.

### Production-Style Compose Run (Recommended) 🟢

```bash
cp backend/.env.example backend/.env
docker compose up --build
```

Access:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:8080`

## Runtime Configuration

### Development

```bash
cp backend/.env.example backend/.env
docker compose -f docker-compose.dev.yml up --build
```

Access:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:8080`
- Postgres: `localhost:5433`



Copy [backend/.env.example](backend/.env.example) to `backend/.env` before starting the project.

```bash
cp backend/.env.example backend/.env
```

The backend and database read runtime settings from `backend/.env`.

Variables currently used by the project:

- `JWT_SECRET`
- `DATABASE_URL`
- `CORS_ALLOWED_ORIGIN`
- `POSTGRES_USER`
- `POSTGRES_PASSWORD`
- `POSTGRES_DB`

## Database Initialization

The PostgreSQL container initializes the schema from [db/initialize.sql](db/initialize.sql).

Schema:

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

To reset the database:

```bash
docker compose down -v
```

## API Overview

### `POST /signup`

Creates a new user account.

Request body:

```json
{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john@example.com",
  "password": "SecurePass1"
}
```

Behavior:

- Rejects malformed JSON and unknown fields
- Normalizes the email before validation and lookup
- Requires first name, last name, email, and password
- Enforces a password policy:
  - at least 8 characters
  - at least one uppercase letter
  - at least one lowercase letter
  - at least one number
- Hashes the password with bcrypt before storage

### `POST /login`

Authenticates an existing user and returns a JWT.

Request body:

```json
{
  "email": "john@example.com",
  "password": "SecurePass1"
}
```

Behavior:

- Rejects malformed JSON and unknown fields
- Normalizes the email before lookup
- Returns a signed JWT on successful authentication

### `GET /me`

Verifies the current authenticated user.

Header:

```text
Authorization: Bearer <JWT_TOKEN>
```

Behavior:

- Validates the JWT using the configured server secret
- Enforces the expected signing method
- Returns the authenticated email if the user still exists

### `POST /logout`

Returns a success response for the client logout flow. The frontend calls this endpoint and then removes the stored token locally.

## cURL Examples

### Signup

```bash
curl -X POST http://localhost:8080/signup \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@example.com",
    "password": "SecurePass1"
  }'
```

### Login

```bash
curl -X POST http://localhost:8080/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass1"
  }'
```

### Authenticated Session Check

```bash
curl -X GET http://localhost:8080/me \
  -H "Authorization: Bearer <JWT_TOKEN>"
```

## Testing

Run backend tests in Docker:

```bash
docker compose down
docker compose run --build --rm backend go test -v ./...
```

Successful test output will look similar to:

```bash
=== RUN   TestSignupHandler
--- PASS: TestSignupHandler (0.08s)
=== RUN   TestLoginHandler
--- PASS: TestLoginHandler (0.09s)
PASS
ok      auth-app/handlers       0.017s
=== RUN   TestAuthMiddleware_ValidToken
--- PASS: TestAuthMiddleware_ValidToken (0.00s)
=== RUN   TestAuthMiddleware_NoToken
--- PASS: TestAuthMiddleware_NoToken (0.00s)
PASS
ok      auth-app/middleware     0.004s
```

Run frontend checks locally:

```bash
cd frontend
npm run build
npm run lint
```

## Notes

- JWT signing and validation are handled server-side using `HS256`.
- The required AI disclosure is documented in [ai-information.md](ai-information.md).
