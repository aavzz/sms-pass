/*
Package timer guards against too frequent notifications
*/

package timer

import (
	"github.com/spf13/viper"
	"time"
)

// NotificationAllowed indicates if we can send notifications
var NotificationAllowed = true

// AllowNotification resets NotificationAllowed to `true` every hour
func AllowNotification() {
	for {
		time.Sleep(viper.GetInt("notifier.reset_interval") * time.Second)
		NotificationAllowed = true
	}
}
