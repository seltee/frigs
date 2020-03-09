package main

import (
	"context"
	"encoding/json"
	"net/http"
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
	"golang.org/x/crypto/bcrypt"

)

type AuthRequest struct {
	Email    string
	Password string
}

type AuthInfo struct {
	ID primitive.ObjectID
	IP string
}

var tokens map[string]AuthInfo = make(map[string]AuthInfo)

func processAuthSession(w http.ResponseWriter, playerID primitive.ObjectID, IP string) {
	token := genAuthToken()
	auth := DBAuth{primitive.NilObjectID, playerID, token, IP}
	dbStructure.Auth.InsertOne(context.TODO(), auth)
	expiration := time.Now().Add(365 * 24 * time.Hour)
	cookie := http.Cookie{Name: "auth_token", Value: token, Expires: expiration}
	http.SetCookie(w, &cookie)
	tokens[token] = AuthInfo{ID: playerID, IP: IP}
}

func authDo(w http.ResponseWriter, r *http.Request) {
	var parsedReq AuthRequest
	err := json.NewDecoder(r.Body).Decode(&parsedReq)
	if err != nil {
		SError(w, err.Error(), http.StatusBadRequest)
		return
	}

	player := getUserByEmail(parsedReq.Email)
	if player == nil {
		SError(w, "Wrong user and/or password", http.StatusBadRequest)
		return
	}

	err = bcrypt.CompareHashAndPassword([]byte(player.Password), []byte(parsedReq.Email+"_"+parsedReq.Password))
	if err != nil {
		SError(w, "Wrong user and/or password", http.StatusBadRequest)
		return
	}

	processAuthSession(w, player.ID, ReadUserIP(r))
	SAnswer(w, "authorized")
}

func requireAuth(callback func(http.ResponseWriter, *http.Request, primitive.ObjectID)) func(http.ResponseWriter, *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		token, _ := r.Cookie("auth_token")
		value, ok := tokens[token.Value]
		if ok && value.IP == ReadUserIP(r) {
			callback(w, r, value.ID)
		} else {
			SError(w, "Session timeout", http.StatusUnauthorized)
		}
	}
}
