package rest

import (
	"context"
	"github.com/aavzz/daemon/log"
	"github.com/aavzz/daemon/pid"
	"github.com/aavzz/daemon/signal"
	"github.com/aavzz/sms-pass/backend/sms-passd/rest/api1"
	"github.com/gorilla/mux"
	"github.com/spf13/viper"
	"net/http"
	"time"
)

// InitHttpp sets up router and starts http server
func InitHttp() {
	r := mux.NewRouter()
	r.HandleFunc("/", spa).Methods("GET")
	r.HandleFunc("/api1", api1.Handler).Methods("POST")
	r.HandleFunc("/api1", redirect).Methods("GET")
	r.PathPrefix("/assets/").Handler(http.StripPrefix("/assets/", http.FileServer(http.Dir(viper.GetString("sms-passd.assets")))))

	s := &http.Server{
		Addr:     viper.GetString("address"),
		Handler:  r,
		ErrorLog: log.Logger("sms-passd"),
	}

	if viper.GetBool("daemonize") == true {
		signal.Quit(func() {
			ctx, _ := context.WithTimeout(context.Background(), 5*time.Second)
			log.Info("SIGQUIT received, exitting gracefully")
			s.Shutdown(ctx)
			pid.Remove()
		})
	}

	if err := s.ListenAndServe(); err != nil {
		pid.Remove()
		log.Fatal(err.Error())
	}
}
