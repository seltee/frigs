package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"strings"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"

)

type DBStructure struct {
	RegRequests *mongo.Collection
	Players     *mongo.Collection
	MotherShips *mongo.Collection
	Fregates    *mongo.Collection
	Auth        *mongo.Collection
}

var dbStructure DBStructure

func createHandlers(dbStructure DBStructure) {
	http.HandleFunc("/api/registration", playerRegistrationRequest)
	http.HandleFunc("/api/confirmation", playerConfirmationRequest)
	http.HandleFunc("/api/user", requireAuth(playerGetInfo))

	http.HandleFunc("/api/auth", authDo)

	http.HandleFunc("/api/crypt_pwd", func(w http.ResponseWriter, r *http.Request) {
		query := r.URL.Query()
		pwd := strings.Join(query["pwd"], "")
		email := strings.Join(query["email"], "")

		fmt.Fprintln(w, "Generating for:")
		fmt.Fprintln(w, email)
		fmt.Fprintln(w, pwd)
		fmt.Fprintln(w, cryptPWD(email, pwd))
	})
}

func main() {
	// MONGO CONNECTION
	client, err := mongo.NewClient(options.Client().ApplyURI("mongodb://127.0.0.1:27017"))
	if err != nil {
		log.Fatal(err)
	}

	// Create connect
	err = client.Connect(context.TODO())
	if err != nil {
		log.Fatal(err)
	}

	// Check the connection
	err = client.Ping(context.TODO(), nil)
	if err != nil {
		log.Fatal(err)
	}

	fmt.Println("Connected to MongoDB!")

	dbStructure.RegRequests = client.Database("fregates").Collection("reg_requests")
	dbStructure.Players = client.Database("fregates").Collection("players")
	dbStructure.MotherShips = client.Database("fregates").Collection("motherShips")
	dbStructure.Fregates = client.Database("fregates").Collection("fregates")
	dbStructure.Auth = client.Database("fregates").Collection("auth")

	fmt.Println("Collections created")

	// HTTP HANDLERS
	createHandlers(dbStructure)
	fmt.Println("Handlers created")

	// LISTEN
	fmt.Println("Server is listening on :80")
	http.ListenAndServe(":80", nil)
}
