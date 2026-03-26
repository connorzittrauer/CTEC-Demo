package main

import (
	"fmt"
	"net/http"
)



func helloHandler(write http.ResponseWriter, r *http.Request) {
	fmt.Fprint(write, "HELLO DOG!")
}

func main() {

	// define route
	http.HandleFunc("/test", helloHandler)
	
	fmt.Println("Server running on http://localhost:8080")
	
	// defines port to be run on 
	http.ListenAndServe(":8080", nil)

}