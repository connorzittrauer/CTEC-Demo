/* 
*	Author: Connor Zittrauer
*
*	This script defines our USER struct with fields for first name, last name, email, and password.
*/

package models

type User struct {
	FirstName string `json:"firstName"`
	LastName  string `json:"lastName"`
	Email     string `json:"email"`
	Password  string `json:"password"`
}