/*
sms-passd generates a password and sends it via SMS using notifier service
*/
package main

import (
	"math/rand"
	"time"
	"github.com/aavzz/sms-pass/server/sms-passd/cmd"
)

func main() {
	rand.Seed(time.Now().UnixNano())
	cmd.Execute()
}
