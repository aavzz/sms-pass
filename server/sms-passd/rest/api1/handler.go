/*
Package api1 implements version 1 of sms-passd API.
*/
package api1

import (
	"crypto/tls"
	"encoding/json"
	"github.com/aavzz/daemon/log"
	"github.com/aavzz/sms-pass/server/sms-passd/db"
	"github.com/spf13/viper"
	"io/ioutil"
	"math/rand"
	"net/http"
	"net/url"
	"regexp"
	"strings"
)

type isp struct {
	name       string
	logo       string
	logoHeight int
	logoWidth  int
}

type hotspot struct {
	name       string
	logo       string
	logoHeight int
	logoWidth  int
	urlA       string
	urlR       string
}

type configResp struct {
	error            int
	errorMsg         string
	passLength       int
	phoneMask        string
	phonePlaceholder string
	isp              isp
	hotspot          hotspot
}

type passResp struct {
	error    int
	errorMsg string
}

// Handler processes requests and responds with a JSON object.
func Handler(w http.ResponseWriter, r *http.Request) {

	ret := json.NewEncoder(w)
	operation := r.FormValue("operation")

	switch operation {
	case "pass":
		//Must be exportable (used for notifier response)
		type JResponse struct {
			Error    int
			ErrorMsg string
		}
		var myresp passResp
		login := r.FormValue("login")
		re := regexp.MustCompile(`^\d{10}$`)
		phones := re.FindAllString(login, 1)

		if phones != nil && phones[0] != "" {
			const letterBytes = "1234567890"
			b := make([]byte, viper.GetInt("sms-passd.pass_length"))
			for i := range b {
				b[i] = letterBytes[rand.Intn(len(letterBytes))]
			}

			err := db.StorePass(phones[0], string(b))
			if err != nil {
				log.Error(err.Error())
			} else {

				parameters := url.Values{
					"channel":    {viper.GetString("notifier.channel")},
					"recipients": {"+" + phones[0]},
					"message":    {string(b)},
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
						myresp.error = 1
						myresp.errorMsg = "Message not sent"
						if err := ret.Encode(myresp); err != nil {
							log.Error(err.Error())
						}
					} else {
						myresp.error = 0
						myresp.errorMsg = "Message sent"
						if err := ret.Encode(myresp); err != nil {
							log.Error(err.Error())
						}
					}
				} else {
					log.Error(resp.Status)
					myresp.error = 1
					myresp.errorMsg = "Message not sent: bad status code"
					if err := ret.Encode(myresp); err != nil {
						log.Error(err.Error())

					}
				}
			}
		} else {
			myresp.error = 1
			myresp.errorMsg = "Message not sent: phone not set"
			if err := ret.Encode(myresp); err != nil {
				log.Error(err.Error())
			}
		}
	case "config":
		var myresp configResp
		myresp.passLength = viper.GetInt("sms-passd.pass_length")
		myresp.phoneMask = viper.GetString("sms-passd.phone_mask")
		myresp.phonePlaceholder = viper.GetString("sms-passd.phone_placeholder")
		myresp.isp.name = viper.GetString("isp.name")
		myresp.isp.logo = viper.GetString("isp.logo")
		myresp.isp.logoHeight = viper.GetInt("isp.logo_height")
		myresp.isp.logoWidth = viper.GetInt("isp.logo_width")

		// figure out client prefix and get client configuration
		header := viper.GetString("sms-passd.real_ip_header")
		var clientIp string
		if header == "" || header == "none" {
			clientIp = r.RemoteAddr
		} else {
			clientIp = r.Header.Get(header)
		}
		re := regexp.MustCompile(`^\d+\.\d+\.\d+`)
		p := re.FindString(clientIp)
		re = regexp.MustCompile(`\.`)
		clientSection := re.ReplaceAllString(p, "_")
		myresp.hotspot.name = viper.GetString(clientSection + ".name")
		myresp.hotspot.logo = viper.GetString(clientSection + ".logo")
		myresp.hotspot.logoWidth = viper.GetInt(clientSection + ".logo_width")
		myresp.hotspot.logoHeight = viper.GetInt(clientSection + ".logo_height")
		myresp.hotspot.urlA = viper.GetString(clientSection + ".url_a")
		myresp.hotspot.urlR = viper.GetString(clientSection + ".url_r")
		
		log.Info("Header: " + header)
		
		// check if all the data bits are ready and send JSON response
		if myresp.isp.name != "" && myresp.isp.logo != "" &&
			myresp.hotspot.name != "" && myresp.hotspot.logo != "" &&
			myresp.hotspot.urlA != "" && myresp.hotspot.urlR != "" {
			myresp.error = 0
		} else {
			myresp.error = 1
			myresp.errorMsg = "Some hotspot parameters are missing in config file"
		}
		if err := ret.Encode(myresp); err != nil {
			log.Error(err.Error())
		}
	}
}
