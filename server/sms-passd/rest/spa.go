package rest

import (
	"fmt"
	"net/http"
	"github.com/spf13/viper"
	"io/ioutil"
	"regexp"
)

func spa(w http.ResponseWriter, r *http.Request) {
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

	startPage, err := ioutil.ReadFile(viper.GetString(clientSection+".assets") + "/spa.html")
	if err != nil {
		http.Redirect(w, r, viper.GetString("sms-passd.redirect"), 301)
	}

	fmt.Fprintf(w, string(startPage))
}
