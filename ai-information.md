### ChatGPT (Browser)
ChatGPT often suggested longer project files than I was comfortable with. 
For example, in ```backend/handlers/auth.go``` where we handle our JSON logic for sending http requests
to our handlers, ChatGPT generated scripts included logic for JWT session token generation as well
as JSON response handling. I felt it important to abstract these duties out to separate files into
utility modules, ```jwt.go``` and ```response.go```, respectively

- Instead of blind copy-pasting from chatgpt, for the purposes of this project, I found it important to 
get a feel for Go syntax when writing my files, even if I was copying from ChatGPT. This gave me a better
understanding of the Go syntax/language. As my comfort with go increased, I will be more keen to accept
vscode ai-generated tab completion and audit heavily in my workflows. 


### Workflow 


## Using ChatGPT to learn GO
While I do have solid fundamentals in full stack web design, at the outset of the project, I prompted
ChatGPT to explain each script it that it offered during the desing process. Here are some important 
Golang concepts I learned while building out the backend:
- Middleware Logic
    - 
- JWT Session Handling
    - JWT session handling is a bit new to me. I had never implemented it from scratch. So I carefully read the generated code 
     in ```jwt.go``` 
- Syntax Explanation
    - I carefully audited the generated code and typed it mostly by hand, to learn it better. 
    I learned that return types in Go occur *after* the parameter definition
    - Type declaration occurs *after* variable declaration, this was new to me!
- Convention 
    - When abstracting code out, I explicitly asked ChatGPT for advice on what is and isn't convention in Go. By doing so, 
      I structured my project as to adhere to D.R.Y (don't repeat yourself) and Single Responsibilty design practices. Such 
      that the logic in ```/handlers/auth.go``` only processed handlers, ```jwt.go``` strictly h

### Learning Go
Whenever ChatGPT generated a script. I instructed ChatGPT that I had a fullstack background but wanted a thorough explanation for each block. I specifically prompted it to explain each line or code block it offered. 
At the outset, ``backend/handlers/auth.go```
I wanted to have a solid understanding of what  

## AI-Generated Code Shortfalls ⚠️
### Abstraction
While AI quickly generated scripts for me, it often fell short in modularizing code, ChatGPT often suggested longer project files than I was comfortable with. 
For example, in ```backend/handlers/auth.go``` where we handle our JSON logic for sending http requests
to our handlers, ChatGPT generated scripts included logic for JWT session token generation as well
as JSON response handling. I felt it important to abstract these duties out to separate files into
utility modules, ```jwt.go``` and ```response.go```, respectively

### Docker Debugging Hallucinations
ChatGPT started suggesting vebose strategies while I was debugging the ```/login``` endpoint in Postman and a *"connection refused error"* in docker. 
AI suggested adding a for-loop in my initialization logic to ping the DB connection. After auditing this, my instinct told me this was overkill:

```go
func InitializeDatabase() *sql.DB {
	connectionString :=  ...

    // initialization logic
    ...
    ...

	// For-loop?
	for i := 0; i < 5; i++ {
		err = db.Ping()
		if err == nil {
			log.Println("Successfully connected to database")
			return db
		}

		log.Println("Waiting for database...")
		time.Sleep(2 * time.Second)
	}
}
```
The ultimate solution resulted from a duplicate instance of docker running. I ran ```docker prune``` and restarted the docker containers, and the
issue resolved itself. This shows the importance of **auditing AI-generated solutions/debugging**. 