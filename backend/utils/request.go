// Package utils contains shared helpers for HTTP request and response handling.
package utils

import (
	"encoding/json"
	"errors"
	"io"
	"net/http"
)

// DecodeJSONBody decodes a single JSON object and rejects unknown fields.
func DecodeJSONBody(request *http.Request, destination interface{}) error {
	decoder := json.NewDecoder(request.Body)
	decoder.DisallowUnknownFields()

	if err := decoder.Decode(destination); err != nil {
		return err
	}

	if err := decoder.Decode(&struct{}{}); err != io.EOF {
		return errors.New("request body must contain a single JSON object")
	}

	return nil
}
