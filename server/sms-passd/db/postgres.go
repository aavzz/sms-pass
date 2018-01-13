package db

import (
	"database/sql"
	_ "github.com/lib/pq"
	"github.com/aavzz/daemon/log"
	"github.com/spf13/viper"
)

var dbh *sql.DB

func InitDB() {
	var err error
	if dbh, err = sql.Open("postgres", "host=" + viper.GetString("db.host") + " user=" + viper.GetString("db.user") + " password=" + viper.GetString("db.pass") + " dbname=" + viper.GetString("db.name") + " sslmode=disable"); err != nil {
		log.Fatal(err.Error())
	}
	if err = dbh.Ping(); err != nil {
		if err := dbh.Close(); err != nil {
			log.Fatal(err.Error())
		}
		log.Fatal(err.Error())
	}
}

func StorePass(pass string) error {
	if _, err := dbh.Exec("INSERT INTO table() values($1)",pass); err != nil {
		return err
	}
	return nil
}

func Close() {
	if dbh != nil {
		if err := dbh.Close(); err != nil {
			log.Error(err.Error())
		}
	}
}
