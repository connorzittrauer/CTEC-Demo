# Tools/Libaries Used
## Air 
For hot reloading Go
go install github.com/cosmtrek/air@latest

### Exposed JWT key! (intentional)
The JWT session key is exposed and tracked by git. In practice, we would
**never** push a .env file to github. I simply included it for the purposes
of this exercise instead of hardcoding it to demonstrate my backend/security fundamentals.

### Useful Commands
air init
go mod init ctec

### Docker
Opens interactive PostgreSQL shell      
```docker exec -it auth-db psql -U postgres -d authdb```

Lists tables
```\dt```


### Modularization 
The structure of the project is as follows:
//use tree -D here 

I find it is very important to modularize your code, so that no one class 
is either a) assuming too many responsibilities or b) we are not repeating code

## Demo 