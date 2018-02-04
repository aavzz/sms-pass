/*
Package cmd implements sms-passd commands and flags
*/
package cmd

import (
	"github.com/aavzz/daemon"
	"github.com/aavzz/daemon/log"
	"github.com/aavzz/daemon/pid"
	"github.com/aavzz/daemon/signal"
	"github.com/aavzz/sms-pass/backend/sms-passd/db"
	"github.com/aavzz/sms-pass/backend/sms-passd/rest"
	"github.com/aavzz/sms-pass/backend/sms-passd/timer"
	"github.com/spf13/cobra"
	"github.com/spf13/viper"
	"os"
)

var smspassd = &cobra.Command{
	Use:   "sms-passd",
	Short: "sms-passd generates passwords and sends them via SMS",
	Long:  `Generates passwords and sends them via SMS using the notifier service`,
	Run:   smspassdCommand,
}

func smspassdCommand(cmd *cobra.Command, args []string) {

	if viper.GetBool("daemonize") == true {
		log.InitSyslog("sms-passd")
		daemon.Daemonize()
	}

	//After daemonize() this part runs in child only

	viper.SetConfigType("toml")
	viper.SetConfigFile(viper.GetString("config"))
	if err := viper.ReadInConfig(); err != nil {
		log.Fatal(err.Error())
	}

	db.InitDB()
	if viper.GetBool("daemonize") == true {
		pid.Write(viper.GetString("pidfile"))
		signal.Ignore()
		signal.Hup(func() {
			log.Info("SIGHUP received, re-reading configuration file")
			if err := viper.ReadInConfig(); err != nil {
				pid.Remove()
				log.Fatal(err.Error())
			}
		})
		signal.Term(func() {
			log.Info("SIGTERM received, exitting")
			pid.Remove()
			os.Exit(0)
		})
	}
	go timer.AllowNotification()
	rest.InitHttp()
}

// Execute starts sms-passd execution
func Execute() {
	smspassd.Flags().StringP("config", "c", "/etc/sms-passd.conf", "configuration file")
	smspassd.Flags().StringP("pidfile", "p", "/var/run/sms-passd.pid", "PID file")
	smspassd.Flags().StringP("address", "a", "127.0.0.1:8086", "address and port to bind to")
	smspassd.Flags().BoolP("daemonize", "d", false, "run as a daemon (default \"false\")")
	viper.BindPFlag("config", smspassd.Flags().Lookup("config"))
	viper.BindPFlag("pidfile", smspassd.Flags().Lookup("pidfile"))
	viper.BindPFlag("address", smspassd.Flags().Lookup("address"))
	viper.BindPFlag("daemonize", smspassd.Flags().Lookup("daemonize"))

	if err := smspassd.Execute(); err != nil {
		log.Fatal(err.Error())
	}
}
