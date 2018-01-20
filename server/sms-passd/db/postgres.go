/*
Package db implements database interaction (postgresql)
*/
package db

import (
	"database/sql"
	"github.com/aavzz/daemon/log"
	_ "github.com/lib/pq"
	"github.com/spf13/viper"
)

var dbh *sql.DB

// InitDB tries to establish a database connection
func InitDB() {
	var err error
	if dbh, err = sql.Open("postgres", "host="+viper.GetString("db.host")+" user="+viper.GetString("db.user")+" password="+viper.GetString("db.pass")+" dbname="+viper.GetString("db.name")+" sslmode=disable"); err != nil {
		log.Fatal(err.Error())
	}
	if err = dbh.Ping(); err != nil {
		if err := dbh.Close(); err != nil {
			log.Fatal(err.Error())
		}
		log.Fatal(err.Error())
	}
}

// StorePass stores passwords in database
func StorePass(login, pass string) error {
	t, err := dbh.Begin()
	if err != nil {
		return err
	}

	if _, err := dbh.Exec("DELETE FROM radcheck WHERE username=$1", login); err != nil {
		if err := t.Rollback(); err != nil {
			return err
		}
		return err
	}

	if _, err := dbh.Exec("DELETE FROM radusergroup WHERE username=$1", login); err != nil {
		if err := t.Rollback(); err != nil {
			return err
		}
		return err
	}

	if _, err := dbh.Exec("INSERT INTO radcheck(username, attribute, op, value) VALUES($1, 'Cleartext-Password', ':=', $2)", login, pass); err != nil {
		if err := t.Rollback(); err != nil {
			return err
		}
		return err
	}

	if _, err := dbh.Exec("INSERT INTO radusergroup(username, groupname) values($1, 'hotspotuser')", login); err != nil {
		if err := t.Rollback(); err != nil {
			return err
		}
		return err
	}

	if err := t.Commit(); err != nil {
		return err
	}

	return nil
}

func CheckPass(login, password string) error{
	rows, err := dbh.Query("select username from radcheck where username=$1 AND attribute='Cleartext-Password' AND op=':=' AND value=$2", login, password)
	if err != nil || rows == nil {
		return err
	}
	return nil
}

// Close closes database connection
func Close() {
	if dbh != nil {
		if err := dbh.Close(); err != nil {
			log.Error(err.Error())
		}
	}
}
