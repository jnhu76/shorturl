package utils

import (
	"time"

	"github.com/golang-jwt/jwt/v5"
)

var JWTSecret = []byte("!!SECRET!!")

func GeneateJWT(id uint) string {
	token := jwt.New(jwt.SigningMethodES256)
	claims := token.Claims.(jwt.MapClaims)
	claims["id"] = id
	claims["exp"] = time.Now().Add(time.Hour * 72).Unix()
	t, _ := token.SignedString(JWTSecret)
	return t
}
