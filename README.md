# Tools/Libaries Used
## Air 
For hot reloading Go
go install github.com/cosmtrek/air@latest

### Exposed JWT key! (intentional)
The JWT session key is exposed and tracked by git. In practice, we would
**never** push a .env file to github. I simply included it for the purposes
of this exercise instead of hardcoding it to demonstrate my backend/security fundamentals.

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

View current users
```sql 
SELECT * FROM users;
```

Sample output after reseeding or new inserts:
```sql
id |          email          |                           password                           |         created_at         
---+-------------------------+--------------------------------------------------------------+----------------------------
 1 | bob@citytelecoin.com    | $2a$10$examplehashnotreal123456789                           | 2026-03-27 17:19:13.515744
 2 | joel_newcombe@gmail.com | $2a$10$examplehashnotreal342342342q3                         | 2026-03-27 17:19:37.82899
 3 | connor@protonmail.com   | $2a$10$examplehashnotreal53156426642                         | 2026-03-27 17:19:56.14417 
```




## Testing
Although it was not required in the project specs, I felt it important to include light testing. There are light testing suites for this project for the **handlers** and **middleware**.

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

## Demo 