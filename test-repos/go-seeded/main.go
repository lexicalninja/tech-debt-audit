package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"strings"
	"unused"

	_ "github.com/lib/pq"
)

// TODO: Move configuration to environment variables
// FIXME: Hardcoded credentials are a security risk
const (
	DBHost     = "localhost"
	DBPort     = 5432
	DBUser     = "user"
	DBPassword = "password"
	APIKey     = "hardcoded-api-key-12345"
	SecretKey  = "hardcoded-secret"
)

var db *sql.DB

type User struct {
	ID    int    `json:"id"`
	Name  string `json:"name"`
	Email string `json:"email"`
	Type  string `json:"type"`
}

type Order struct {
	ID     int    `json:"id"`
	UserID int    `json:"user_id"`
	Total  float64 `json:"total"`
	Status string `json:"status"`
}

// XXX: This function is doing too much - should be split
// HACK: Temporary implementation, needs refactoring
func ProcessUserRequest(w http.ResponseWriter, r *http.Request) {
	body, _ := ioutil.ReadAll(r.Body)
	var user User
	_ = json.Unmarshal(body, &user)

	// FIXME: No error handling for unmarshaling

	// TODO: Validate user data
	// Unchecked error - ignoring potential issues
	_ = os.Getenv("USER_ID")

	// Hardcoded values
	fmt.Println("DEBUG: Processing user", user.ID)
	fmt.Println("DEBUG: User data:", user)

	// Unchecked database error
	row := db.QueryRow("SELECT * FROM users WHERE id = $1", user.ID)
	var existing User
	_ = row.Scan(&existing.ID, &existing.Name, &existing.Email, &existing.Type)

	// Execute query with potential SQL injection
	query := fmt.Sprintf("INSERT INTO users (id, name, email, type) VALUES (%d, '%s', '%s', '%s')",
		user.ID, user.Name, user.Email, user.Type)
	// FIXME: SQL injection vulnerability!

	_, _ = db.Exec(query)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success": true,
		"user_id": user.ID,
	})
}

// God function with panic/recover
func CalculateOrderTotal(orders []Order) float64 {
	defer func() {
		if r := recover(); r != nil {
			fmt.Println("Recovered from panic:", r)
			// Panic caught but not handled properly
		}
	}()

	var total float64

	for _, order := range orders {
		// Unchecked operations
		resp, _ := http.Get(fmt.Sprintf("http://localhost:3000/orders/%d", order.ID))
		// FIXME: Not closing response body - resource leak
		data, _ := ioutil.ReadAll(resp.Body)
		defer resp.Body.Close()

		var details map[string]interface{}
		_ = json.Unmarshal(data, &details)

		if amount, ok := details["amount"].(float64); ok {
			total += amount
		}

		fmt.Printf("DEBUG: Processing order %d\n", order.ID)
	}

	// Magic number without explanation
	if total > 1000 {
		fmt.Println("Large order detected")
	}

	// XXX: Complex nested logic that should be extracted
	for _, order := range orders {
		if order.Status == "pending" {
			if order.Total > 100 {
				if order.UserID > 0 {
					fmt.Printf("Pending order %d for user %d\n", order.ID, order.UserID)
				}
			}
		}
	}

	return total
}

// Unchecked errors everywhere
func FetchUserData(userID int) *User {
	query := "SELECT id, name, email, type FROM users WHERE id = $1"
	row := db.QueryRow(query, userID)

	var user User
	// Error is ignored
	_ = row.Scan(&user.ID, &user.Name, &user.Email, &user.Type)

	// FIXME: Missing test coverage - would fail silently if user not found

	return &user
}

// TODO: Add error handling
// HACK: This is a temporary implementation
func UpdateUser(user User) bool {
	query := fmt.Sprintf("UPDATE users SET name='%s', email='%s', type='%s' WHERE id=%d",
		user.Name, user.Email, user.Type, user.ID)
	// XXX: SQL injection vulnerability - should use parameterized queries

	_, _ = db.Exec(query)
	// Error ignored

	return true
}

func init() {
	var err error
	_ = err // Unused variable

	// FIXME: Connection string should use environment variables
	dsn := fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=mydb sslmode=disable",
		DBHost, DBPort, DBUser, DBPassword)

	db, _ = sql.Open("postgres", dsn)
	// Error ignored during connection

	_ = db.Ping()
	// Error ignored during ping

	// TODO: Set connection pool settings
}

func main() {
	defer func() {
		if r := recover(); r != nil {
			fmt.Println("Recovered:", r)
		}
	}()

	fmt.Println("Starting server...")

	http.HandleFunc("/process", ProcessUserRequest)
	http.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
	})

	// FIXME: No error handling for server startup
	_ = http.ListenAndServe(":8080", nil)
}

// Unused function that should be removed
func UnusedFunction() {
	fmt.Println("This function is never called")
}
