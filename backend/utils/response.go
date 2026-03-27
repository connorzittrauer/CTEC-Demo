package utils

import (
	"encoding/json"
	"net/http"
)

// Utility function to write JSON responses for our handlers
func WriteJSONResponse(writer http.ResponseWriter, statusCode int, data interface{}) {
	writer.Header().Set("Content-Type", "application/json")
	writer.WriteHeader(statusCode)
	json.NewEncoder(writer).Encode(data)
}