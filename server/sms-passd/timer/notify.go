package timer

import (
	"time"
)

var NotificationAllowed = true

func AllowNotification() {
	for {
		time.Sleep(3600 * time.Second)
		NotificationAllowed = true
	}
}
