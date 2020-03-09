package main

import (
	"encoding/json"
	"fmt"
	"log"
	"math/rand"
	"net/http"
	"strings"
	"time"

	"golang.org/x/crypto/bcrypt"

)

type Answer struct {
	Success      bool
	ErrorMessage string
	Data         interface{}
}

func gen(length int, charset string) string {
	var seededRand *rand.Rand = rand.New(
		rand.NewSource(time.Now().UnixNano()))

	b := make([]byte, length)
	for i := range b {
		b[i] = charset[seededRand.Intn(len(charset))]
	}
	return string(b)
}

func genCode() string {
	return gen(32, "qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890_")
}

func genAuthToken() string {
	return gen(128, "qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890!@#$%^&*()-=_+,.?~<>")
}

func genPWD() string {
	return gen(12, "qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890!@#$%^&*()-=_+:;,.?~<>")
}

func cryptPWD(email string, pwd string) string {
	hash, err := bcrypt.GenerateFromPassword([]byte(email+"_"+pwd), 12)
	if err != nil {
		log.Println(err)
	}
	return string(hash)
}

func ReadUserIP(r *http.Request) string {
	IPAddress := r.Header.Get("X-Real-Ip")
	if IPAddress == "" {
		IPAddress = r.Header.Get("X-Forwarded-For")
	}
	if IPAddress == "" {
		IPAddress = r.RemoteAddr
	}

	IPParts := strings.Split(IPAddress, ":")
	return IPParts[0]
}

func SError(w http.ResponseWriter, message string, code int) {
	w.WriteHeader(code)
	result := map[string]interface{}{
		"success":      false,
		"data":         nil,
		"errorMessage": message,
	}

	out, _ := json.Marshal(result)
	fmt.Fprintf(w, string(out))
}

func SAnswer(w http.ResponseWriter, data interface{}) {
	result := map[string]interface{}{
		"success": true,
		"data":    data,
	}

	out, _ := json.Marshal(result)
	fmt.Fprint(w, string(out))
}
