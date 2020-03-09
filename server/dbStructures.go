package main

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"

)

type DBRegRequest struct {
	Email string
	Code  string
	Date  time.Time
}

type DBPlayer struct {
	ID          primitive.ObjectID `bson:"_id" json:"id,omitempty"`
	Nickname    string
	Race        string
	Email       string
	Password    string
	NameChanged bool
	LastEnter   time.Time
}

type DBMotherShip struct {
	ID    primitive.ObjectID `bson:"_id" json:"id,omitempty"`
	Name  string
	Owner primitive.ObjectID
	Type  string
}

type DBFrigate struct {
	ID    primitive.ObjectID `bson:"_id" json:"id,omitempty"`
	Name  string
	Owner primitive.ObjectID
	Type  string
}

type DBAuth struct {
	ID       primitive.ObjectID `bson:"_id" json:"id,omitempty"`
	PlayerID primitive.ObjectID
	Token    string
	IP       string
}
