/*
Package api1 implements version 1 of sms-passd API.
*/
package api1

import (
	"encoding/json"
	"github.com/aavzz/daemon/log"
	"net/http"
	"fmt"
	"math/rand"
	"github.com/spf13/viper"
)

const loginHTML = `
<!DOCTYPE HTML>
<html>
  <head>
    <meta charset="utf-8">
    <title>Hotspot login</title>
  </head>
  <body>
    <div id='root'></div>
  </body>
</html>
`

// Handler calls the right function to send message via specified channel.
func Handler(w http.ResponseWriter, r *http.Request) {

	//Must be exportable
	type JResponse struct {
		Error    int
		ErrorMsg string
	}

	var resp JResponse
	ret := json.NewEncoder(w)

	login := r.FormValue("login")
	password := r.FormValue("password")

	if login == "" && password == "" {
		//send login webpage to client.
		fmt.Fprintf(w, loginHTML)
		return
	}

	if login != "" && password == "" {

		const letterBytes = "1234567890"
		b := make([]byte, viper.GetInt("local.pass_length"))
		for i := range b {
			b[i] = letterBytes[rand.Intn(len(letterBytes))]
		}
		//return string(b)

		//generate a password, store it in database and send it via sms
		//viper.GetString("notifier.url")
		return
	}

	if login != "" && password != "" {
		//check supplied password and redirect
		return
	}

	// should never get here
	resp.Error = 1
	resp.ErrorMsg = "Password is set, login missing"
        if err := ret.Encode(resp); err != nil {
		log.Error(err.Error())
	}
}
