# sms-pass

## What it is

**sms-pass** is a service to generate a password and send it via SMS to the provided number. It's intended use is authentication portal for a hotspot. Currently only **mikrotik** hotspots are tested and known to work. Equipment from other vendors that permits external authentication should work as well.

## Features

- multiple hotspots
- example default front-end
- multiple custom front-ends are possible
- REST API

## Example setup

### What we need

**sms-passd** is written in Go, so you need to have some basic knowledge how to build Go programs. It shold build cleanly accorging to standard Go procedures once you install all the needed Go dependencies. There are not many of them.

**sms-passd** is a web-application, hence it can be run on its own in *http* mode. But I'd recommend using it in *https* mode. For that we need a proxy (e.g **nginx**). Maybe sometimes I'll add *https* and other usefull stuff to **sms-passd**, but right now we rely on proxy. **sms-passd** relies on local or remote **notifyd** to send SMS.

I assume you know what an ssl sertificate is and how to handle it.

### hotspot setup

Carry out the steps described in a README for yout specific hotspot (see under the **equipment** directory).

### nginx setup

We'll try to keep things as simple as possible. So here's the **nginx** configuration file *nginx.conf*:
```
events {
    worker_connections  1024;
}

error_log syslog:server=unix:/var/run/log;

http {

    map $ssl_client_s_dn $ssl_client_s_dn_cn {
        default "should_not_happen";
        ~/CN=(?<CN>[^/]+) $CN;
    }

    server {
        listen <--YOUR_IP_HERE-->:80;
        server_name <--SERVER_NAME_HERE-->;
        return 301 https://<--SERVER_NAME_HERE-->$request_uri;
    }

    server {

        access_log syslog:server=unix:/var/run/log;
        listen <--YOUR_IP_HERE-->:443 ssl;
        ssl_certificate     /etc/nginx/<--CERTIFICATE_FILE-->;
        ssl_certificate_key /etc/nginx/<--KEY_FILE-->;
        ssl_protocols       TLSv1 TLSv1.1 TLSv1.2;
        ssl_ciphers         HIGH:!aNULL:!MD5;

        server_name         <--SERVER_NAME_HERE-->;

        location / {
            proxy_pass http://localhost:8084/;
            proxy_set_header   X-Real-IP $remote_addr;
            proxy_set_header   Host $http_host;
            proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
        }
    }
}
```
**nginx** speaks https to the outside world an communicates with **sms-passd** via http on a special port.
It also sets the **X-Forwarded-For** header, just so **sms-passd** knows the real address of the calling client.


### sms-passd setup
**sms-passd** uses */etc/sms-passd.conf* as default configuration file. The configuration file is in the TOML format:
```
[notifier]
url="NOTIFYD REST URL HERE"
channel="CHANNEL NAME HERE"
contact="WHOM TO NOTIFY IN CASE SOMETHING GOES WRONG"
#WHAT IS THE MINIMAL PERIOD BETWEN PROBLEM NOTIFICATIONS
reset_interval=3600

[sms-passd]
pass_length=4
assets="PATH TO STATIC FILES"
real_ip_header="X-Real-IP"
redirect="URL WHERE ALL THE STRANGERS WILL BE REDIRECTED"

[db]
host="localhost"
name="radius"
user="radius"
pass="PASSWORD"

#example hotspot users
[10_15_55]
#assets setting from the sms-passd section is prepended to the setting below 
assets="frontend/10_15_55"
#must be equal to what is set on the equipment
sessions=2

#one more section with hotspot users
[192_168_26]
assets="frontend/default"
sessions=1
```


## Invocation

### sms-passd
**sms-passd** is invoked as follows:
```
Usage:
  sms-passd [flags]

Flags:
  -a, --address string   address and port to bind to (default "127.0.0.1:8086")
  -c, --config string    configuration file (default "/etc/sms-passd.conf")
  -d, --daemonize        run as a daemon (default "false")
  -p, --pidfile string   PID file (default "/var/run/sms-passd.pid")
```
On **SIGHUP** **sms-passd** re-reads its configuration file. Only use **SIGHUP** to re-read hotspot information, all the othe settings (db, etc.) must be refreshed by stopping and starting **sms-passd**.


## REST API
Requests are expected to be POSTed to a specific API URL (**/api1** currently). Responses are sent in JSON. The folowing parameters are recognized:

### api1
Request:

| Parameter      | Description |
| -------------- | ----------- |
| operation      | One of `pass`, `checkpass`, or `notify`. **pass** generates and sends password for a given login, **checkpass** ensures that the user will be authenticated by hotspot, **notify** notifies the **contact** from the configuration file about problems with the hotspot and radius.|
| login          | Used in operation `pass` or `checkpass`. Phone number in international format to send password to or to check the validity of the password for.|
| password     | Used in operation `checkpass`. Password to check the validity of the login-password pair as well as its session limit. |


Response (JSON):

| Parameter | Description |
| --------- | ----------- |
| Error     | Error code (integer), `0` means no error |
| ErrorMsg  | Error explanation message (string) |

## Custom frontends

Custom frontends must be an SPA (single-page application). The main page must be named **spa.html**. All the notmal interaction with the user (password generation, credentials check, informing user about wrong password or session-limit) happens in the main page. Auxilliary error page which is displayed in case of hotspot problems (credentials passed the checks in the main SPA, but were rejected by the hotspot). Auxilliary error page must be named **error.html**.

See provided default front-end for an example.
