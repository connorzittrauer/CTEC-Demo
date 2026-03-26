package main

import(
	"fmt"
	"net/http"
)

func main() {
	http.HandleFunc("/test", func(writer http.ResponseWriter, request *http.Request) {
		fmt.Fprint(writer, "AIR server wghjghjorking")
	})

	fmt.Println("Running on port :8080")

	http.ListenAndServe(":8080", nil)
}


