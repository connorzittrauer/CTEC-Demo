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

List all tables
```bash
\dt
```

## Testing
There are light testing suites for this project located for our **handlers** and **middleware**.

### Handler Testing
- Typically, we would use a mock database or test database and not the production database, but for the purposes 
  of this project, we are using the production database 
  ```/handlers/auth_test.go``` tests our ```/signup``` and ```/login``` endpoints by simulating an HTTP request, capturing the response, and asserting expected behavior

### Middleware Testing


### Modularization 
The structure of the project is as follows:
//use tree -D here 

I find it is very important to modularize your code, so that no one class 
is either a) assuming too many responsibilities or b) we are not repeating code

## Demo 