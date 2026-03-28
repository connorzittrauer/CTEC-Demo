/* 
*	Author: Connor Zittrauer
*
*	This script defines our USER struct with fields for first name, last name, email, and password.
*/

package models

type User struct {
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
	Email     string `json:"email"`
	Password  string `json:"password"`
}