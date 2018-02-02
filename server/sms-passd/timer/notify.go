/*
Package timer guards against too frequent notifications
*/

package timer

import (
	"time"
)

// NotificationAllowed indicates if we can send notifications
var NotificationAllowed = true

// AllowNotification resets NotificationAllowed to `true` every hour
func AllowNotification() {
	for {
		time.Sleep(3600 * time.Second)
		NotificationAllowed = true
	}
}
