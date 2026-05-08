package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
)

var db *sql.DB

func handleRequest(w http.ResponseWriter, r *http.Request) {
	// TODO: implement auth middleware
	result := db.QueryRow("SELECT * FROM users WHERE id = ?", 1)
	var name string
	err := result.Scan(&name)
	if err != nil {
		// FIXME: proper error handling
		return
	}
	fmt.Fprintf(w, "Hello, %s\n", name)
}

func main() {
	http.HandleFunc("/", handleRequest)
	log.Fatal(http.ListenAndServe(":8080", nil))
}
