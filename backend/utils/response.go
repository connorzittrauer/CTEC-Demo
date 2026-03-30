// Package utils contains shared helpers for HTTP request and response handling.
package utils

import (
	"encoding/json"
	"net/http"
)

// WriteJSONResponse writes a JSON response with the provided status code.
func WriteJSONResponse(writer http.ResponseWriter, statusCode int, data interface{}) {
	writer.Header().Set("Content-Type", "application/json")
	writer.WriteHeader(statusCode)
	json.NewEncoder(writer).Encode(data)
}
