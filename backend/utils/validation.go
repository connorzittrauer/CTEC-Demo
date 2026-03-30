// Package utils contains shared helpers for HTTP request and response handling.
package utils

import (
	"net/mail"
	"regexp"
	"strings"
)

var (
	uppercasePattern = regexp.MustCompile(`[A-Z]`)
	lowercasePattern = regexp.MustCompile(`[a-z]`)
	numberPattern    = regexp.MustCompile(`\d`)
)

// NormalizeEmail trims surrounding whitespace and lowercases the email.
func NormalizeEmail(email string) string {
	return strings.ToLower(strings.TrimSpace(email))
}

// ValidateName ensures a required name field is not blank.
func ValidateName(value, field string) string {
	if strings.TrimSpace(value) == "" {
		return field + " is required"
	}

	return ""
}

// ValidateEmail ensures the email is present and formatted correctly.
func ValidateEmail(email string) string {
	normalized := NormalizeEmail(email)
	if normalized == "" {
		return "Email is required"
	}

	address, err := mail.ParseAddress(normalized)
	if err != nil || address.Address != normalized {
		return "Invalid email format"
	}

	return ""
}

// ValidatePassword applies the backend password policy for signup requests.
func ValidatePassword(password string) string {
	if password == "" {
		return "Password is required"
	}
	if len(password) < 8 {
		return "Password must be at least 8 characters long"
	}
	if !uppercasePattern.MatchString(password) {
		return "Password must contain at least one uppercase letter"
	}
	if !lowercasePattern.MatchString(password) {
		return "Password must contain at least one lowercase letter"
	}
	if !numberPattern.MatchString(password) {
		return "Password must contain at least one number"
	}

	return ""
}
