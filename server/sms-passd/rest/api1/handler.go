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


// SPA serves initial page
func SPA(w http.ResponseWriter, r *http.Request) {
	const loginHTML = `<!DOCTYPE HTML>
<html>
<head>
    <meta charset="utf-8">
    <title>Hotspot login</title>
    <link rel="stylesheet" type="text/css" href="/assets/w2ui/dist/w2ui.min.css" />
    <script src="/assets/w2ui/libs/jquery/jquery-2.1.0.min.js"></script>
    <script src="/assets/jQuery-Mask-Plugin/dist/jquery.mask.min.js"></script>
    <script src="/assets/w2ui/dist/w2ui.min.js"></script>
    <script src="/assets/app.js"></script>
</head>
<body>
    <div id="root" style="width: 445px; height: 700px; display: block; margin-left: auto; margin-right: auto;"></div>
</body>
</html>`

	fmt.Fprintf(w, loginHTML)
}
	
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
	case "info":
		type Isp struct {
			Name string
			Logo string
		}
		
		type Hotspot struct {
			Name string
			Logo string
			Url_a string
			Url_r string
		}
		
		type Resp struct {
			Error int
			ErrorMsg string
			Isp Isp
			Hotspot Hotspot
		}
		var myresp Resp
		myresp.Isp.Name = viper.GetString("isp.name")
		myresp.Isp.Logo = viper.GetString("isp.logo")
		
		clientIp := r.RemoteAddr 
		
		myresp.Hotspot.Name = viper.GetString("isp.hotspot")
		
		re := regexp.MustCompile(`^\d+\.\d+\.\d+`)
		p := re.FindString(clientIp)
		re = regexp.MustCompile(`\.`)
		clientSection := re.ReplaceAllString(p, "_")
		
		myresp.Hotspot.Name = viper.GetString(clientSection + ".name")
		myresp.Hotspot.Logo = viper.GetString(clientSection + ".logo")
		myresp.Hotspot.Url_a = viper.GetString(clientSection + ".url_a")
		myresp.Hotspot.Url_r = viper.GetString(clientSection + ".url_r")

		if (myresp.Isp.Name != "" && myresp.Isp.Logo != "" &&
		    myresp.Hotspot.Name != "" && myresp.Hotspot.Logo != "" &&
		    myresp.Hotspot.Url_a != "" && myresp.Hotspot.Url_r != "") {
			myresp.Error = 0
		} else {
			myresp.Error = 1
			myresp.ErrorMsg = "Some parameters are missing"
		}
		
		if err := ret.Encode(myresp); err != nil {
			log.Error(err.Error())
		}
	}
}
