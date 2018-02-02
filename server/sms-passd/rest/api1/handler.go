/*
Package api1 implements version 1 of sms-passd API.
*/
package api1

import (
	"encoding/json"
	"github.com/aavzz/daemon/log"
	"github.com/aavzz/notifier"
	"github.com/aavzz/sms-pass/server/sms-passd/db"
	"github.com/aavzz/sms-pass/server/sms-passd/timer"
	"github.com/spf13/viper"
	"math/rand"
	"net/http"
	"regexp"
	"fmt"
)

type Isp struct {
	Name       string
	Logo       string
	LogoHeight int
	LogoWidth  int
}

type Hotspot struct {
	Type       string
	Name       string
	Logo       string
	LogoHeight int
	LogoWidth  int
	UrlA       string
	UrlR       string
}

type ConfigResp struct {
	Error            int
	ErrorMsg         string
	PassLength       int
	PhoneMask        string
	PhonePlaceholder string
	Redirect         string
	Isp              Isp
	Hotspot          Hotspot
}

type PassResp struct {
	Error    int
	ErrorMsg string
}

// Handler processes requests and responds with a JSON object.
func Handler(w http.ResponseWriter, r *http.Request) {

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

	// redirect unknown clients
	if viper.IsSet(clientSection+".assets") == false {
		http.Redirect(w, r, viper.GetString("sms-passd.redirect"), 301)
	}
	
	ret := json.NewEncoder(w)
	operation := r.FormValue("operation")

	switch operation {
	case "pass":
		var myresp PassResp
		login := r.FormValue("login")
		re := regexp.MustCompile(`^\+\d+$`)
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
				err := notifier.NotifySMS(viper.GetString("notifier.url"), viper.GetString("notifier.channel"), phones[0], string(b))
				if err != nil {
					myresp.Error = 1
					myresp.ErrorMsg = err.Error()
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
			}
		} else {
			myresp.Error = 1
			myresp.ErrorMsg = "Message not sent: phone not set"
			if err := ret.Encode(myresp); err != nil {
				log.Error(err.Error())
			}
		}
	case "checkpass":
		var myresp PassResp
		login := r.FormValue("login")
		password := r.FormValue("pass")
		err := db.CheckPass(login, password)
		if err != nil {
			myresp.Error = 1
			myresp.ErrorMsg = "Password check failed"
			if err := ret.Encode(myresp); err != nil {
				log.Error(err.Error())
			}
		} else {
			sessions, err := db.CheckSession(login)
			if err != nil {
				myresp.Error = 2
				myresp.ErrorMsg = "Session check failed"
				if err := ret.Encode(myresp); err != nil {
					log.Error(err.Error())
				}
			} else {
				allowedSessions := viper.GetInt64(clientSection + ".sessions")

				if sessions > allowedSessions {
					// this should never happen
					if timer.NotificationAllowed == true {
						timer.NotificationAllowed = false
						err := notifier.NotifySMS(viper.GetString("notifier.url"), viper.GetString("notifier.channel"), viper.GetString("notifier.contact"), "sessions > allowedSessions for "+login)
						if err != nil {
							myresp.Error = 2
							myresp.ErrorMsg = err.Error()
							if err := ret.Encode(myresp); err != nil {
								log.Error(err.Error())
							}
						} else {
							myresp.Error = 2
							myresp.ErrorMsg = "sessions > allowedSessions for " + login
							if err := ret.Encode(myresp); err != nil {
								log.Error(err.Error())
							}

						}
					}
				} else if sessions == allowedSessions {
					myresp.Error = 2
					myresp.ErrorMsg = "Session limit reached"
					if err := ret.Encode(myresp); err != nil {
						log.Error(err.Error())
					}
				} else {
					myresp.Error = 0
					myresp.ErrorMsg = "Password check OK"
					if err := ret.Encode(myresp); err != nil {
						log.Error(err.Error())
					}
				}
			}
		}
	case "notify":
		if timer.NotificationAllowed == true {
			timer.NotificationAllowed = false
			err := notifier.NotifySMS(viper.GetString("notifier.url"), viper.GetString("notifier.channel"), viper.GetString("notifier.contact"), "Hotspot: auth failed for " + clientIp)
			if err != nil {
				log.Error(err.Error())
			}
		}
		page := `<html>
		<head><head>
		<body>
		<div>
		<p>Произошла ужасная ошибка</>
		<p>Мы уже работаем над ee устранением</p>
		<div>
		</body>
		</html>
		`
		fmt.Fprintf(w, page)
	default:
		http.Redirect(w, r, viper.GetString("sms-passd.redirect"), 301)
	}
}
