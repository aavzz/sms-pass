# sms-pass

## What it is

**sms-pass** is a service to generate a password and send it via SMS to the provided number. It's intended use is an external authentication portal for a hotspot. Currently only **mikrotik** hotspots are tested and known to work. Equipment from other vendors that permits external authentication should work as well.

## Features

- multiple hotspots
- example default front-end
- multiple custom front-ends are possible
- REST API

## Example setup

### What we need

**sms-passd** is written in Go, so you need to have some basic knowledge of how to build Go programs. It shold build cleanly accorging to standard Go procedures once you install all the needed Go dependencies. There are not many of them.

**sms-passd** is a web-application, hence it can be run on its own in *http* mode. But I'd recommend using it in *https* mode. For that we need a proxy (e.g **nginx**). Maybe sometimes I'll add *https* and other usefull stuff to **sms-passd**, but right now we rely on proxy. **sms-passd** relies on local or remote **notifyd** to send SMS.

We also need a service to do the actual user authentication. We'll use **free-radius** with **postgres** as a datastore;

I assume you know what an ssl sertificate is and how to handle it.

### Network setup

Do not forget to add routed to your client hotspot networks.

### Hotspot setup

Carry out the steps described in a README for yout specific hotspot (see under the **equipment** directory).

### RADIUS setup

Here is an example RADIUS configuration. It's no exactly the way that **free-radius** folks want it to be, but it's good enough for you to make you own mind.

#### /etc/raddb/radiusd.conf
```
name = radiusd

prefix = /usr
exec_prefix = ${prefix}
sysconfdir = /etc
localstatedir = /var
sbindir = ${exec_prefix}/sbin
logdir = ${localstatedir}/log/radius
raddbdir = ${sysconfdir}/raddb
radacctdir = ${logdir}/radacct
confdir = ${raddbdir}
modconfdir = ${confdir}/mods-config
certdir = ${confdir}/certs
cadir   = ${confdir}/certs
run_dir = ${localstatedir}/run/${name}
db_dir = ${raddbdir}
libdir = ${exec_prefix}/lib

pidfile = ${run_dir}/${name}.pid
checkrad = ${sbindir}/checkrad

max_request_time = 30
cleanup_delay = 5
max_requests = 1024
proxy_requests  = no

hostname_lookups = no

regular_expressions     = yes
extended_expressions    = yes

log {
        destination = syslog
        syslog_facility = daemon
        stripped_names = no
        auth = no
        auth_badpass = no
        auth_goodpass = no
}

security {
        max_attributes = 200
        reject_delay = 1
        status_server = yes
        user = radius
        group = radius
}

thread pool {
        start_servers = 5
        max_servers = 32
        min_spare_servers = 3
        max_spare_servers = 10
        max_requests_per_server = 0
}
modules {
        $INCLUDE ${confdir}/modules/always
        $INCLUDE ${confdir}/modules/expr
        $INCLUDE ${confdir}/modules/sql
        $INCLUDE ${confdir}/modules/pap
}

policy {
    $INCLUDE ${confdir}/policies/
}

$INCLUDE defsite
```

#### /etc/raddb/defsite
```
server default {
    listen {
        type = auth
        ipaddr = *
        port = 0
        limit {
              max_connections = 16
              lifetime = 0
              idle_timeout = 30
        }
    }

    listen {
        ipaddr = *
        port = 0
        type = acct
        limit {
        }
    }

    authorize {
        sql
        if (&NAS-IP-Address) {
            update request {
                Huntgroup-Name := "%{sql:SELECT nasgroupname FROM nasgroup WHERE nas_ip_address='%{NAS-IP-Address}'}"
                Group := "%{sql:SELECT groupname FROM radusergroup WHERE username='%{User-Name}'}"
            }
        }
        elsif (&NAS-IPv6-Address) {
            update request {
                Huntgroup-Name := "%{sql:SELECT nasgroupname FROM nasgroup WHERE nas_ipv6_address='%{NAS-IPv6-Address}'}"
                Group := "%{sql:SELECT groupname FROM radusergroup WHERE username='%{User-Name}'}"
            }
        }
        elsif (&NAS-Identifier) {
            update request {
                Huntgroup-Name := "%{sql:SELECT nasgroupname FROM nasgroup WHERE nas_identifier='%{NAS-Identifier}'}"
                Group := "%{sql:SELECT groupname FROM radusergroup WHERE username='%{User-Name}'}"
            }
        }
        checknasgroup
        pap
    }

    authenticate {
        Auth-Type PAP {
                pap
        }
    }
    preacct {
        update request {
            &FreeRADIUS-Acct-Session-Start-Time = "%{expr: %l - %{%{Acct-Session-Time}:-0} - %{%{Acct-Delay-Time}:-0}}"
        }
        acct_unique

    }

    accounting {
        sql
    }

    session {
        sql
    }

    post-auth {
        sql
    }
}
```

#### /etc/raddb/modules/always
```
always reject {
        rcode = reject
}
always fail {
        rcode = fail
}
always ok {
        rcode = ok
}
always handled {
        rcode = handled
}
always invalid {
        rcode = invalid
}
always userlock {
        rcode = userlock
}
always notfound {
        rcode = notfound
}
always noop {
        rcode = noop
}
always updated {
        rcode = updated
}
```

#### /etc/raddb/modules/exec
```
exec {
        wait = no
        input_pairs = request
        shell_escape = yes
        timeout = 10
}
```

#### /etc/raddb/modules/expr
```
expr {
        safe_characters = "@abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.-+_: "
}
```
#### /etc/raddb/modules/pap
```
pap {
}
```

#### /etc/raddb/modules/queries
```
safe_characters = "@abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.-_: /+"

sql_user_name = "%{User-Name}"

client_query = "SELECT id, nasname, shortname, type, secret, server FROM ${client_table}"

authorize_check_query = "SELECT id, UserName, Attribute, Value, Op FROM ${authcheck_table} WHERE Username = '%{SQL-User-Name}' ORDER BY id"
authorize_reply_query = "SELECT id, UserName, Attribute, Value, Op FROM ${authreply_table} WHERE Username = '%{SQL-User-Name}' ORDER BY id"
authorize_group_check_query = "SELECT id, GroupName, Attribute, Value, op FROM ${groupcheck_table} WHERE GroupName = '%{${group_attribute}}' ORDER BY id"
authorize_group_reply_query = "SELECT id, GroupName, Attribute, Value, op FROM ${groupreply_table} WHERE GroupName = '%{${group_attribute}}' ORDER BY id"

simul_count_query = "SELECT COUNT(*) FROM ${acct_table1} WHERE UserName='%{SQL-User-Name}' AND AcctStopTime IS NULL"
simul_verify_query = "SELECT RadAcctId, AcctSessionId, UserName, NASIPAddress, NASPortId, FramedIPAddress, CallingStationId, FramedProtocol FROM ${acct_table1} WHERE UserName='%{SQL-User-Name}' AND AcctStopTime IS NULL"

group_membership_query = "SELECT GroupName FROM ${usergroup_table} WHERE UserName='%{SQL-User-Name}' ORDER BY priority"

accounting {
        reference = "%{tolower:type.%{%{Acct-Status-Type}:-none}.query}"

        column_list = "AcctSessionId, AcctUniqueId, UserName, Realm, NASIPAddress, NASPortId, NASPortType, AcctStartTime, AcctUpdateTime, AcctStopTime, AcctSessionTime, AcctAuthentic, ConnectInfo_start, ConnectInfo_Stop,\
                AcctInputOctets, AcctOutputOctets, CalledStationId, CallingStationId, AcctTerminateCause, ServiceType, FramedProtocol, FramedIpAddress"

        type {
                start {
                        query = "INSERT INTO ${....acct_table1} (${...column_list}) VALUES('%{Acct-Session-Id}', '%{Acct-Unique-Session-Id}', '%{SQL-User-Name}', NULLIF('%{Realm}', ''),\
                                        '%{%{NAS-IPv6-Address}:-%{NAS-IP-Address}}', NULLIF('%{%{NAS-Port-ID}:-%{NAS-Port}}', ''), '%{NAS-Port-Type}', TO_TIMESTAMP(%{integer:Event-Timestamp}),\
                                        TO_TIMESTAMP(%{integer:Event-Timestamp}), NULL, 0, '%{Acct-Authentic}', '%{Connect-Info}', NULL, 0, 0, '%{Called-Station-Id}',\
                                        '%{Calling-Station-Id}', NULL, '%{Service-Type}', '%{Framed-Protocol}', NULLIF('%{Framed-IP-Address}', '')::inet)"
                }
                stop {
                        query = "UPDATE ${....acct_table1} SET AcctStopTime = TO_TIMESTAMP(%{integer:Event-Timestamp}), AcctUpdateTime = TO_TIMESTAMP(%{integer:Event-Timestamp}),\
                                        AcctSessionTime = COALESCE(%{%{Acct-Session-Time}:-NULL}, (%{integer:Event-Timestamp} - EXTRACT(EPOCH FROM(AcctStartTime)))),\
                                        AcctInputOctets = (('%{%{Acct-Input-Gigawords}:-0}'::bigint << 32) + '%{%{Acct-Input-Octets}:-0}'::bigint), AcctOutputOctets = (('%{%{Acct-Output-Gigawords}:-0}'::bigint << 32) +\
                                        '%{%{Acct-Output-Octets}:-0}'::bigint), AcctTerminateCause = '%{Acct-Terminate-Cause}', FramedIPAddress = NULLIF('%{Framed-IP-Address}', '')::inet,\
                                        ConnectInfo_stop = '%{Connect-Info}' WHERE AcctUniqueId = '%{Acct-Unique-Session-Id}' AND AcctStopTime IS NULL"
                }

                none {
                     query = "SELECT true"
                }
        }
}


post-auth {
        query = "INSERT INTO ${..postauth_table} (username, pass, reply, authdate, calledstationid, callingstationid) VALUES('%{User-Name}', '%{%{User-Password}:-Chap-Password}', '%{reply:Packet-Type}', NOW(),                      '%{Cal
led-Station-Id}', '%{Calling-Station-Id}')"
}

```

#### /etc/raddb/modules/sql
```
sql {
        driver = "rlm_sql_postgresql"

        dialect = "postgresql"

        radius_db = "dbname=radius host=localhost user=radius password=YOUR_PASSWORD_HERE"
        query_timeout = 5

        acct_table1 = "radacct"
        acct_table2 = "radacct"
        postauth_table = "radpostauth"
        authcheck_table = "radcheck"
        groupcheck_table = "radgroupcheck"
        authreply_table = "radreply"
        groupreply_table = "radgroupreply"
        usergroup_table = "radusergroup"
        client_table = "nas"

        read_clients = yes
        read_groups = yes
        read_profiles = yes
        delete_stale_sessions = yes

        pool {
                start = ${thread[pool].start_servers}
                min = ${thread[pool].min_spare_servers}
                max = ${thread[pool].max_servers}
                spare = ${thread[pool].max_spare_servers}
                uses = 0
                retry_delay = 30
                lifetime = 0
                idle_timeout = 60
        }

        group_attribute = "SQL-Group"

        $INCLUDE queries
}
```

#### /etc/raddb/policies/accounting
```
class_value_prefix = 'ai:'

acct_unique {
        update request {
               &Tmp-String-9 := "${policy.class_value_prefix}"
        }

        if (("%{hex:&Class}" =~ /^%{hex:&Tmp-String-9}/) &&             ("%{string:&Class}" =~ /^${policy.class_value_prefix}([0-9a-f]{32})/i)) {
                update request {
                        &Acct-Unique-Session-Id := "%{md5:%{1},%{Acct-Session-ID}}"
                }
        }
        else {
                update request {
                        &Acct-Unique-Session-Id := "%{md5:%{User-Name},%{Acct-Session-ID},%{%{NAS-IPv6-Address}:-%{NAS-IP-Address}},%{NAS-Identifier},%{NAS-Port-ID},%{NAS-Port}}"
                 }
        }
}
```

#### /etc/raddb/policies/checknasgroup
```
checknasgroup {
        if ("%{sql:select 'yes' from nasuseraccess where nasgroupname='%{Huntgroup-Name}' and usergroupname='%{Group}'}" != 'yes') {
                reject
        }
}
```

### postgres setup

#### server

Server setup for local installation is trivial. It should work out-of-the-box.

#### DB schema
```
CREATE TABLE radacct (
        RadAcctId               bigserial PRIMARY KEY,
        AcctSessionId           text NOT NULL,
        AcctUniqueId            text NOT NULL UNIQUE,
        UserName                text,
        GroupName               text,
        Realm                   text,
        NASIPAddress            inet NOT NULL,
        NASPortId               text,
        NASPortType             text,
        AcctStartTime           timestamp with time zone,
        AcctUpdateTime          timestamp with time zone,
        AcctStopTime            timestamp with time zone,
        AcctInterval            bigint,
        AcctSessionTime         bigint,
        AcctAuthentic           text,
        ConnectInfo_start       text,
        ConnectInfo_stop        text,
        AcctInputOctets         bigint,
        AcctOutputOctets        bigint,
        CalledStationId         text,
        CallingStationId        text,
        AcctTerminateCause      text,
        ServiceType             text,
        FramedProtocol          text,
        FramedIPAddress         inet
);
-- This index may be useful..
-- CREATE UNIQUE INDEX radacct_whoson on radacct (AcctStartTime, nasipaddress);

-- For use by update-, stop- and simul_* queries
CREATE INDEX radacct_active_session_idx ON radacct (AcctUniqueId) WHERE AcctStopTime IS NULL;

-- Add if you you regularly have to replay packets
-- CREATE INDEX radacct_session_idx ON radacct (AcctUniqueId);

-- For backwards compatibility
-- CREATE INDEX radacct_active_user_idx ON radacct (AcctSessionId, UserName, NASIPAddress) WHERE AcctStopTime IS NULL;

-- For use by onoff-
CREATE INDEX radacct_bulk_close ON radacct (NASIPAddress, AcctStartTime) WHERE AcctStopTime IS NULL;

-- and for common statistic queries:
CREATE INDEX radacct_start_user_idx ON radacct (AcctStartTime, UserName);

-- and, optionally
-- CREATE INDEX radacct_stop_user_idx ON radacct (acctStopTime, UserName);

/*
 * create index radacct_UserName on radacct (UserName);
 * create index radacct_AcctSessionId on radacct (AcctSessionId);
 * create index radacct_AcctUniqueId on radacct (AcctUniqueId);
 * create index radacct_FramedIPAddress on radacct (FramedIPAddress);
 * create index radacct_NASIPAddress on radacct (NASIPAddress);
 * create index radacct_AcctStartTime on radacct (AcctStartTime);
 * create index radacct_AcctStopTime on radacct (AcctStopTime);
*/


CREATE TABLE radcheck (
        id                      serial PRIMARY KEY,
        UserName                text NOT NULL DEFAULT '',
        Attribute               text NOT NULL DEFAULT '',
        op                      VARCHAR(2) NOT NULL DEFAULT '==',
        Value                   text NOT NULL DEFAULT '',
        tstamp               timestamp with time zone NOT NULL default now()
);
create index radcheck_UserName on radcheck (UserName,Attribute);
-- create index radcheck_UserName_lower on radcheck (lower(UserName),Attribute);

CREATE TABLE radgroupcheck (
        id                      serial PRIMARY KEY,
        GroupName               text NOT NULL DEFAULT '',
        Attribute               text NOT NULL DEFAULT '',
        op                      VARCHAR(2) NOT NULL DEFAULT '==',
        Value                   text NOT NULL DEFAULT ''
);
create index radgroupcheck_GroupName on radgroupcheck (GroupName,Attribute);

CREATE TABLE radgroupreply (
        id                      serial PRIMARY KEY,
        GroupName               text NOT NULL DEFAULT '',
        Attribute               text NOT NULL DEFAULT '',
        op                      VARCHAR(2) NOT NULL DEFAULT '=',
        Value                   text NOT NULL DEFAULT ''
);
create index radgroupreply_GroupName on radgroupreply (GroupName,Attribute);

CREATE TABLE radreply (
        id                      serial PRIMARY KEY,
        UserName                text NOT NULL DEFAULT '',
        Attribute               text NOT NULL DEFAULT '',
        op                      VARCHAR(2) NOT NULL DEFAULT '=',
        Value                   text NOT NULL DEFAULT ''
);
create index radreply_UserName on radreply (UserName,Attribute);
-- create index radreply_UserName_lower on radreply (lower(UserName),Attribute);

CREATE TABLE radusergroup (
        id                      serial PRIMARY KEY,
        UserName                text NOT NULL DEFAULT '',
        GroupName               text NOT NULL DEFAULT '',
        priority                integer NOT NULL DEFAULT 0,
        tstamp                  timestamp with time zone NOT NULL default now()
);
create index radusergroup_UserName on radusergroup (UserName);
-- create index radusergroup_UserName_lower on radusergroup (lower(UserName));

CREATE TABLE radpostauth (
        id                      bigserial PRIMARY KEY,
        username                text NOT NULL,
        pass                    text,
        reply                   text,
        CalledStationId         text,
        CallingStationId        text,
        authdate                timestamp with time zone NOT NULL default now()
);

CREATE TABLE nas (
        id                      serial PRIMARY KEY,
        nasname                 text NOT NULL,
        shortname               text NOT NULL,
        type                    text NOT NULL DEFAULT 'other',
        ports                   integer,
        secret                  text NOT NULL,
        server                  text,
        community               text,
        description             text
);
create index nas_nasname on nas (nasname);


CREATE TABLE nasgroup (
        id                      serial PRIMARY KEY,
        nasgroupname            text NOT NULL,
        nas_ipv6_address        inet,
        nas_ip_address          inet,
        nas_identifier          text
);
create index nasgroup_nasgroup on nasgroup (nasgroupname);

CREATE TABLE nasuseraccess (
        id                      serial PRIMARY KEY,
        nasgroupname             text NOT NULL,
        usergroupname            text NOT NULL,
        unique (nasgroupname, usergroupname)
);

create index nasuseraccess_nasgroupname on nasuseraccess (nasgroupname);
create index nasuseraccess_usergroupname on nasuseraccess (usergroupname);
```

#### Adding users and hotspots to RADIUS
```
insert into nas(nasname, shortname, type, secret) values('nas_external_ip_address','nas_shortname','other','nas_secret');
insert into nasgroup(nasgroupname, nas_ip_address) values('hotspot','nas_external_ip_address');
```
Restart **radiusd** after changing NAS configuration.
```
insert into nasuseraccess(nasgroupname, usergroupname) values('hotspot', 'hotspotuser');
```


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
