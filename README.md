# Tools/Libaries Used
## Air 
For hot reloading Go
go install github.com/cosmtrek/air@latest

### Exposed JWT key! (intentional)
The JWT session key is exposed and tracked by git. In practice, we would
**never** push a .env file to github. I simply included it for the purposes
of this exercise instead of hardcoding it to demonstrate my backend/security fundamentals.

### Getting Started
1. Clone the repository
2. Verify the latest version of Docker is installed
2. Run: 
```bash
docker compose up --build
```
2. If that fails, you may have existing containers running, shut them down and run:
```bash
docker compose down -v
docker compose build --no-cache
docker compose up
```

## Useful Commands
air init
go mod init ctec

### Docker Commands

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
```sql

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
│   ├── firstName (string, required)
│   ├── lastName  (string, required)
│   ├── email     (string, required)
│   └── password  (string, required)
├── Behavior:
│   ├── Validates input
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
│   ├── Retrieves user from database
│   ├── Compares password using bcrypt
│   ├── Generates JWT token
│   └── Returns token
└── Responses:
    ├── 200 OK (returns JWT)
    ├── 401 Unauthorized
    └── 500 Internal Server Error

/protected   (GET)
├── Description: Example protected route
├── Handler: `main.go` (wrapped with middleware)
├── Middleware: `middleware/auth.go → AuthMiddleware`
├── Headers:
│   └── Authorization: Bearer <JWT_TOKEN>
├── Behavior:
│   ├── Validates JWT
│   ├── Extracts user email from token
│   └── Returns protected data
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
    "firstName": "John",
    "lastName": "Doe",
    "email": "you@citytelecoin.com",
    "password": "secure_password"
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
    "password": "secure_password"
  }'
```
### Response:
```json
{"message":"Login Successful","token":"<JWT_TOKEN>"}
```

### Access Protected Route
Replace <JWT_TOKEN> with the token returned from ```/login```:
```bash
curl -X GET http://localhost:8080/protected \
  -H "Authorization: Bearer <JWT_TOKEN>"
```
### Response:
```json
{"email":"you@citytelecoin.com","message":"You accessed a protected route!"}
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
docker compose run --rm backend go test -v ./...
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