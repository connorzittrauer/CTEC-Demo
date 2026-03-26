/* 
	Author: Connor Zittrauer

	This script defines our USER struct with 
	fields for email and password.
*/

package models

type User struct {
	Email string `json:"email"`
	Password string `json:"password"`
}