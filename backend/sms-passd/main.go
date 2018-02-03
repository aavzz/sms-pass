/*
sms-passd generates a password and sends it via SMS using notifier service
*/
package main

import (
	"github.com/aavzz/sms-pass/backend/sms-passd/cmd"
	"math/rand"
	"time"
)

func main() {
	rand.Seed(time.Now().UnixNano())
	cmd.Execute()
}
