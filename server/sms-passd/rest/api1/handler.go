/*
Package api1 implements version 1 of sms-passd API.
*/
package api1

import (
	"encoding/json"
	"github.com/aavzz/daemon/log"
	"github.com/aavzz/sms-pass/server/sms-passd/db"
	"net/http"
	"net/url"
	"fmt"
	"math/rand"
	"github.com/spf13/viper"
	"regexp"
	"strings"
	"crypto/tls"
	"io/ioutil"
)

const loginHTML = `<!DOCTYPE HTML>
<html>
  <head>
    <meta charset="utf-8">
    <title>Hotspot login</title>
  </head>
  <body>
    <div id='root'>NNN</div>
  </body>
</html>`

// Handler calls the right function to send message via specified channel.
func Handler(w http.ResponseWriter, r *http.Request) {

	//Must be exportable
	type JResponse struct {
		Error    int
		ErrorMsg string
	}

	var myresp JResponse
	ret := json.NewEncoder(w)

	operation := r.FormValue("operation")

	switch operation {
	case "pass":
		login := r.FormValue("login")
		re := regexp.MustCompile(`^\d{10}$`)
		phones := re.FindAllString(login, 1)

		if phones != nil && phones[0] != "" {
			const letterBytes = "1234567890"
			b := make([]byte, viper.GetInt("local.pass_length"))
			for i := range b {
				b[i] = letterBytes[rand.Intn(len(letterBytes))]
			}

			err := db.StorePass(phones[0], string(b))
			if err != nil {
				log.Error(err.Error())
			} else {

				parameters := url.Values{
					"channel": {"beeline"},
					"recipients": {"+7" + phones[0]},
					"message":     {string(b)},
				}

				url := viper.GetString("notifier.url")
				req, err := http.NewRequest("POST", url, strings.NewReader(parameters.Encode()))
				if err != nil {
					log.Error(err.Error())
				}
				req.Header.Set("Content-Type", "application/x-www-form-urlencoded")

				tr := &http.Transport{
					TLSClientConfig: &tls.Config{InsecureSkipVerify: true},
				}
				c := &http.Client{Transport: tr}

				resp, err := c.Do(req)
				if err != nil {
					log.Error(err.Error())
				}
				if resp != nil {
					defer resp.Body.Close()
				}

				if resp.StatusCode == 200 {
					body, err := ioutil.ReadAll(resp.Body)
					if err != nil {
						log.Error(err.Error())
					}

					var v JResponse
					if err := json.Unmarshal(body, &v); err != nil {
						log.Error(err.Error())
					}

					if v.Error != 0 {
						log.Error(v.ErrorMsg)
						myresp.Error = 1
						myresp.ErrorMsg = "Message not sent"
						if err := ret.Encode(myresp); err != nil {
							log.Error(err.Error())
						}
					} else {
						myresp.Error = 0
						myresp.ErrorMsg = "Message sent"
						if err := ret.Encode(myresp); err != nil {
							log.Error(err.Error())
						}
					}
				} else {
					log.Error(resp.Status)	
					myresp.Error = 1
					myresp.ErrorMsg = "Message not sent: bad status code"
					if err := ret.Encode(myresp); err != nil {
						log.Error(err.Error())
				
					}
				}
			}
		} else {
			myresp.Error = 1
			myresp.ErrorMsg = "Message not sent: phone not set"
			if err := ret.Encode(myresp); err != nil {
				log.Error(err.Error())
			}
		}
	default:
		//send login webpage to client.
		fmt.Fprintf(w, loginHTML)
	}
}
