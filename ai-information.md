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

### Copilot (VSCode)
- Debugging Tailwind
    - I do most of my CSS debugging in the browswer console or by hand in the code, but 
      I found the built-in copilot in VSCode useful for debugging tricky layout/CSS ussues when I could not identify the issue in the browser console.
        - I would highlight the snippet and prompt at fix

### Workflow 
I instructed ChatGPT to walkthrough each step of the entire design process after submitting the requirements for the project. 
Instead of offering every solution at once, we implemented each feature one at a time. ChatGPT would offer the generated 
scripts for the project and a detailed explanation of what each code block was doing. I wrote the code by hand, instead of copying
and pasting. This allowed me to audit each line, especially since I am new to golang. 

The workflow at a high level:


1. Define Project Structure 
    - 1.1. Create project directories/subdirectories
        - /backend, /frontend, /db/... 
    - 1.2. Create DB initialization script ```initalize.sql```
    - 1.3. Create README.md
2. Develop & Test Backend
    - 2.1 Create server with generic endpoint in main()
        - Containerize with Docker
            - 2.1.1 Install Docker
    - 2.1 Write Login/Signup Handlers and register them
    - 2.2 JWT Session Logic
    - 2.3 Middleware logic
    - 2.4 Handler & Middleware Testing



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

## Learning Go
### Explanatory Code Snippets

Whenever ChatGPT generated a script. I instructed ChatGPT that I had a fullstack background but wanted a thorough explanation for each block. I specifically prompted it to explain each line or code block it offered. 
At the outset, ``backend/handlers/auth.go```
I wanted to have a solid understanding of what  

## AI-Generated Code Shortfalls ⚠️
### 1. Abstraction
While AI quickly generated scripts for me, it often fell short in modularizing code, ChatGPT often suggested longer project files than I was comfortable with. 
For example, in ```backend/handlers/auth.go``` where we handle our JSON logic for sending http requests
to our handlers, ChatGPT generated scripts included logic for JWT session token generation as well
as JSON response handling. I felt it important to abstract these duties out to separate files into
utility modules, ```jwt.go``` and ```response.go```, respectively

### 2. Docker Debugging Hallucinations
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

### 3. Overengineered Solutions
ChatGPT can sometimes offer over-engineered solutions to problems. While I was testing the `/Signup` form in the frontend, I asked it
what **convention** would dictate be the best error message to send when a user tries to sign up with a duplicate email. We were already sending
a JSON error message from the backend in our `/handlers`: 
```go
if err != nil {
    utils.WriteJSONResponse(writer, http.StatusInternalServerError, map[string]string{
        "error": "User may already exist",
    })
    return
}
```
ChatGPT recommended instead to modfy the *frontend*  check the error message, and map it to a different message
```typescript
if (err.message.includes("Email already registered")) {
setError("An account with this email already exists.");
    }
```
This is overengineered an unecssary as all we needed to do was update the backend error message.  This shows the importance of **auditing AI-generated solutions/debugging** to avoid adding unnecessary complexity. When pointed out, ChatGPT acknowledged this was bad practice. 

Why did you suggest changing it in the front? Why not just change it in the auth.,go? Here: if err != nil { utils.WriteJSONResponse(writer, http.StatusInternalServerError, map[string]string{ "error": "User may already exist", }) return

### 3. Incorrect /route definitions
talk about how you instructe chatgpt that you wanted a modal login page, but it gave you unecssary routes for /login and /signup 
before you decided to switch to a singular /auth route. This demonstrates the necessary to audit AI-generated code before implementation. 
This could have generated too much boilerplate for later cleanup. 