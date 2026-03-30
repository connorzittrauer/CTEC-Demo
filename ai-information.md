
# AI Usage Information
 **NOTICE** 🔴   
I wrote this document myself. I only used AI to help me format a few things in markdown and check grammar.       

## AI Tools Used
### 1. ChatGPT (Primary)
- Browser
- ***Go Tier***
### 2. Copilot (Supplemental)
- Claude Haiku 4.5
- ***Free tier***

### 3 Codex (Codebase Auditing)
- VS Code Extension
- GPT-5.4

## ChatGPT Workflow

#### **I. Project Guidance**
I started with the **/backend** of the application. I fed ChatGPT the project requirements and instructed it to walk through each step of the entire design process after submitting the requirements for the project. I specifically instructed it not to offer every solution at once. Instead, we implemented each feature one at a time. 

**Initial prompt:** 
```markdown
I have to do this project for work: requirements.pdf ... Let's walk through this from the ground up, carefully, step by step, and explain what is going on at each step. When one step is completed, I will explicitly instruct you to move to the next step."
```
This placed us in a **prompt-loop** such that I could logically move stepwise through the project without my context being obliterated in the debugging process as messages accumulated. 

The **prompt loop** for the project looked like this at a high level:     

### Prompt Loop ⟳
```
Init Backend Project Directories
    ↓
Init PSQL Database
    ↓
Handler Logic
    ↓
Dockerize
    ↓
Middleware
    ↓
JWT
    ↓
Tests
    ↓
Init React Project
    ↓
User Interface
    ↓
Wire Endpoints to Server
    ↓
Wire JWT
    ↓
Negative Testing
    ↓
Dockerize
    ↓
Final UX/UI Polish
``` 
Additionally:
- ChatGPT would offer the generated scripts for the project and a detailed explanation of what each code block was doing. 
  - For the purposes of this project, I wrote most of the **Go** code by hand instead of copying and pasting. 
   - I wanted to get a feel for Go syntax when writing my files, even if I was copying from ChatGPT. This gave me a better understanding of the Go syntax/language. 
 - As my comfort with Go increased, I became more keen to accept
  VSCode AI-generated tab completion and audit heavily in my workflows. 

#### **II. Learning Go**    
Whenever ChatGPT generated a script, I instructed it that I had a full-stack background but wanted a thorough explanation for each block. I specifically prompted it to explain each line or code block it offered. I have solid fundamentals in full-stack web design. I explained this to ChatGPT and prompted it to explain each script that it offered during the design process. 

Here are some important Go concepts I learned while building out the backend:
- "***What's Convention in Go?"***
    - When abstracting code out, I explicitly asked ChatGPT for advice on what is and isn't convention in Go. By doing so, I structured my project to adhere to D.R.Y. (don't repeat yourself) and Single Responsibility design practices, such that the logic in ```/handlers/auth.go``` only processed handlers, ```jwt.go``` strictly handled session tokens, etc.
- **JWT Session Handling**
    - JWT session handling is a bit new to me. I had never implemented it from scratch. So, I carefully read the generated code in ```jwt.go``` 
- **Syntax Explanation**
    - I carefully read the generated code and typed it mostly by hand, to learn it better. 
    - I learned that return types in Go occur *after* the parameter definition
    - Type declaration occurs *after* variable declaration, this was new to me!

  
#### III. **AI-Assisted Debugging**
**Faulty Authentication Pattern**     
I used ChatGPT frequently to help me debug edge cases while testing the frontend of my application. While intentionally trying to break the site, I encountered an odd bug. Below is a sample of the prompt I gave ChatGPT to assist with debugging:

> *"When the user navigates to the dashboard after signing in and clicks the logout button, that works great. HOWEVER, when the user goes to the dashboard and enters a random string in the search bar, e.g.:*
> *http://localhost:5173/dashboardsdfsdf*
> *The page remains the same with the login button. BUT, when they press the logout button, it does not redirect — instead, the page goes blank and the console throws this error:*
> *App.tsx:32 Maximum update depth exceeded..."*

The bug resulted from faulty authentication pattern being used in `App.tsx`. I *learned* from this prompting session that it is bad practice to include route authentication login within `App.tsx`.

**Client-side Routing Flaw**  
I used ChatGPT again while testing edge cases related to routing and authentication. While intentionally trying to break the application, I encountered an inconsistency in route protection. Below is a sample of the prompt I gave ChatGPT:

> *"When the user logs out and is redirected to `/auth`, everything works correctly. HOWEVER, if the user then enters a random route like:*
> *http://localhost:5173/dashboard_blahblah*
> *they are redirected to `/auth`, but can then manually navigate back to `/dashboard` and gain access without logging in again."*

The bug resulted from an incomplete client-side routing pattern. While I had implemented a `ProtectedRoute` to guard authenticated routes, I had not implemented the inverse logic for public routes. I resolved this by introducing a `PublicRoute` component to implement **symmetric route protection** in my app.
## Copilot Workflow 
**I. Debugging Tailwind**
- I do a lot of my CSS debugging in the browser console and sometimes in the code, but 
  I found the built-in Copilot in VSCode useful for debugging tricky layout/CSS issues when I could not quickly identify the issue in the browser console.
- I would highlight the snippet and prompt a fix
  
**II. Rapid TailwindCSS Styling**
  - While I consulted ChatGPT for boilerplate TailwindCSS, I also used *Copilot* in VSCode to quickly edit CSS to save time.  

Sample prompt:
```markdown
I want to add a one of those icons in my password field that you can click to view the password. One of the eye icons.  
```
Copilot is a useful tool for quickly resolving one-off issues. But, fails for larger audits of project. 

## Codex Workflow
### I. Security Issues
After every feature from the requirements had been satisfied, I wanted to interace with a LLM locally to perform an audit of my entire codebase. I wanted to audit the codebase for three purposes, in order of importance:

1. Security Issues
2. Bugs
3. Refactors

Here is a sample of the prompt after I had codex analyze my codebase:
```markdown
I am finishing up this project for work. Everything works correctly. However, I really want to clean up my codebase where possible. There is some slop-code at certain points. I want to refactor where possible while adhering closely to the convetions of the lanuguage. I also want to check for glaring security issue. I want you to analyze the code base and assign high, medium, and low priorites to what you think needs to be adjusted. 
```
Codex identified around four high risk issues with my codebase. One high vulnerability security error I am embarassed I did not catch was a set of - **hardcoded DB credentials** in my Docker compose file. We moved the credentials into the `.env` file:

```yaml
  db:
    ...
    # Not good!
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password 
      POSTGRES_DB: authdb
```
### II. Bugs
The backend was accepting malformed or extra JSON fields more loosely than it should have been, so we introduced `request.go`

### Refactors
As part of the front end cleanpup, codex ran `npm lint` as enforce styling standards and act as a quality gate check. Also, some of the frontend code was ***modularized for readability/maintanability***. The `auth.ts` file was making raw `fetch` calls fdirectly. Codex suggested adding a wrapper in `client.ts`

Before codex refactor:
```js
export async function login(email: string, password: string) {
  const res = await fetch("http://localhost:8080/login", {
    method: "POST",
    ...
}
```

After: 
```js
export async function login(email: string, password: string) {
  return apiFetch("/login",  // wrapper
  { 
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}
```
This example demonstrtes Codex's ability to enhance readability and maintainability. 

## ⚠️ AI-Generated Code Shortfalls 
### 1. Lack of Abstraction
While AI quickly generated scripts for me, it often fell short in modularizing code and abstraction. ChatGPT often suggested longer project files than I was comfortable with. It's important 

For example, in `backend/handlers/auth.go` where we handle our JSON logic for sending http requests
to our handlers, ChatGPT generated scripts included logic for JWT session token generation as well
as JSON response handling. I felt it was important to abstract these duties out to separate utility modules,
```jwt.go``` and ```response.go```, respectively at adhere as closely as possible to the design principle of *single responsibility*

### 2. Errors 
While errors like this is are relatively rare, ChatGPT suggested code sometimes failed to fully implement the requirements. When auditing the  generated React code at the end of the, I noticed my `DashboardPage` logout button was not actually  calling my /logout endpoint. 

```js
const handleLogout = () => {
    removeToken(); // We remove the token, but never hit the endpoint
    navigate("/auth", { replace: true }); 
};

```
More importantly, the frontend API bridge, `auth.ts`, did not yet define a `logout()` function:
```js
export async function login(email: string, password: string) {
  return apiFetch("/login", 
  ...
  ...
export async function signup(
  return apiFetch("/signup", 

// Missing /logout function defintion to backend  
```

The function had never been defined. While the `/logout` handler in our code is mainly symbolic, this could have introduced bugs and errors later if the project scope broadened and we enhanced `/logout` functionality in the backend.

This example shows the importance of **auditing AI-generated solutions!**. 

### 3. Overengineered Solutions
ChatGPT can sometimes offer over-engineered solutions to problems. While I was testing the `/Signup` form in the frontend, I asked it
what **convention** would dictate the best error message to send when a user tries to sign up with a duplicate email. We were already sending
a JSON error message from the backend in our `/handlers`: 
```go
if err != nil {
    utils.WriteJSONResponse(writer, http.StatusInternalServerError, map[string]string{
        "error": "User may already exist",
    })
    return
}
```
ChatGPT recommended instead modifying the *frontend* to check the error message and map it to a different message:
```ts
if (err.message.includes("Email already registered")) {
setError("An account with this email already exists.");
    }
```
This is overengineered and unnecessary, as all we needed to do was update the backend error message. This shows the importance of **auditing AI-generated solutions/debugging** to avoid adding unnecessary complexity. When pointed out, ChatGPT acknowledged this was bad practice. 
