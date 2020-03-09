package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"math/rand"
	"net/http"
	"strings"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"

)

type RegistrationRequest struct {
	Email string
}

func getUserByNickname(nickName string) *DBPlayer {
	var result DBPlayer
	err := dbStructure.Players.FindOne(context.TODO(), bson.D{{"nickname", nickName}}).Decode(&result)
	if err != nil {
		return nil
	}
	return &result
}

func getUserByEmail(email string) *DBPlayer {
	var result DBPlayer
	err := dbStructure.Players.FindOne(context.TODO(), bson.D{{"email", email}}).Decode(&result)
	if err != nil {
		return nil
	}
	return &result
}

func getUserByEmailPassword(email string, pwd string) *DBPlayer {
	cryptPwd := cryptPWD(email, pwd)

	var result DBPlayer
	err := dbStructure.Players.FindOne(context.TODO(), bson.D{{"email", email}, {"password", cryptPwd}}).Decode(&result)
	if err != nil {
		return nil
	}

	return &result
}

func getUserByID(ID primitive.ObjectID) *DBPlayer {
	var result DBPlayer
	err := dbStructure.Players.FindOne(context.TODO(), bson.D{{"_id", ID}}).Decode(&result)
	if err != nil {
		println(err.Error())
		return nil
	}
	return &result
}

func createNewUser(Email string) *primitive.ObjectID {
	var seededRand *rand.Rand = rand.New(
		rand.NewSource(time.Now().UnixNano()))

	var i int
	var name string
	for i = 0; i < 1000; i++ {
		name = "captain" + string(seededRand.Intn(100000000))
		if getUserByNickname(name) == nil {
			break
		}
	}
	if i == 1000 {
		return nil
	}

	password := genPWD()
	player := DBPlayer{primitive.NilObjectID, name, "human", Email, cryptPWD(Email, password), false, time.Now()}
	result, _ := dbStructure.Players.InsertOne(context.TODO(), player)
	userID := result.InsertedID.(primitive.ObjectID)

	motherShip := DBMotherShip{primitive.NilObjectID, "Florida Sunrise", userID, "hermes"}
	frigate1 := DBFrigate{primitive.NilObjectID, "Thunderbird", userID, "brigand"}
	frigate2 := DBFrigate{primitive.NilObjectID, "Martlet", userID, "brigand"}

	dbStructure.MotherShips.InsertOne(context.TODO(), motherShip)
	dbStructure.Fregates.InsertOne(context.TODO(), frigate1)
	dbStructure.Fregates.InsertOne(context.TODO(), frigate2)

	return &userID
}

func playerRegistrationRequest(w http.ResponseWriter, r *http.Request) {
	var parsedReq RegistrationRequest
	err := json.NewDecoder(r.Body).Decode(&parsedReq)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	fmt.Fprintf(w, parsedReq.Email)
	code := genCode()
	dbEntity := DBRegRequest{parsedReq.Email, code, time.Now()}
	_, err = dbStructure.RegRequests.InsertOne(context.TODO(), dbEntity)
	if err != nil {
		log.Fatal(err)
	}
}

func playerConfirmationRequest(w http.ResponseWriter, r *http.Request) {
	query := r.URL.Query()

	code := strings.Join(query["code"], "")
	if len(code) > 0 {
		var result DBRegRequest

		err := dbStructure.RegRequests.FindOneAndDelete(context.TODO(), bson.D{{"code", code}}).Decode(&result)
		if err != nil {
			http.Error(w, "Code is deprecated or already activated", http.StatusBadRequest)
			return
		}

		user := getUserByEmail(result.Email)
		if user != nil {
			http.Error(w, "Code is deprecated or already activated", http.StatusBadRequest)
			return
		}

		newUser := createNewUser(result.Email)

		processAuthSession(w, *newUser, ReadUserIP(r))
		http.Redirect(w, r, "/", 301)
	} else {
		http.Error(w, "Code is not transmitted", http.StatusBadRequest)
	}
}

func playerGetInfo(w http.ResponseWriter, r *http.Request, ID primitive.ObjectID) {
	user := getUserByID(ID)
	if user != nil {
		var motherShip DBMotherShip
		err := dbStructure.MotherShips.FindOne(context.TODO(), bson.D{{"owner", ID}}).Decode(&motherShip)
		if err != nil {
			SError(w, "Mothership is not found", http.StatusConflict)
			return
		}

		cur, err := dbStructure.Fregates.Find(context.TODO(), bson.D{{"owner", ID}})
		if err != nil {
			SError(w, "Fregates not found", http.StatusNoContent)
			return
		}

		var frigates []map[string]interface{}

		for cur.Next(context.TODO()) {
			var elem DBFrigate
			err = cur.Decode(&elem)
			if err != nil {
				SError(w, "Fregate getting error", http.StatusNoContent)
				return
			}

			frig := map[string]interface{}{
				"name": elem.Name,
				"type": elem.Type,
			}

			frigates = append(frigates, frig)
		}

		result := map[string]interface{}{
			"nickname": user.Nickname,
			"motherShip": map[string]interface{}{
				"name": motherShip.Name,
				"type": motherShip.Type,
			},
			"fregates": frigates,
		}

		SAnswer(w, result)
		return
	}

	SError(w, "User does not exist", http.StatusUnauthorized)
}
