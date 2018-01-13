package db

import (
	"database/sql"
	_ "github.com/lib/pq"
	"github.com/aavzz/daemon/log"
)

var dbh *sql.DB

func InitDB() {
	var err error
	if dbh, err := sql.Open("postgres", "host=/var/run/postgresql user=foo password=asd dbname=bar sslmode=disable"); err != nil {
		log.Fatal(err.Error())
	}
	if err := dbh.Ping(); err != nil {
		if err := dbh.Close(); err != nil {
			log.Fatal(err.Error())
		}
		log.Fatal(err.Error())
	}
}

func StorePass(pass string) error {
	if _, err := dbh.Exec("INSERT INTO table() values($1)",pass); err != nil {
		log.Error(err.Error())
	}
}

func Close() {
	if dbh != nil {
		if err := dbh.Close(); err != nil {
			log.Error(err.Error())
		}
	}
}
