imap-dashboard
==============

A simple IMAP app, that brings your mails onto a dashboard. Please provide your credentials in a configuration file

## Details file
This file contains details about your imap client. This is an example:

```javascript
{
	"user": "username@userdomain.com",
	"password": "userpass",
	"host": "imapserverhost",
	//this is the gmail port
	"port": 993,
	//tls options
	"tls": true,
	"tlsOptions": { "rejectUnauthorized": false }
}
```