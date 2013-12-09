imap-dashboard
==============

A simple IMAP app, that brings your mails onto a dashboard. Please provide your credentials in a configuration file

## Details file
This file contains details about your imap client. It should be placed at the root level in the project's folder (eg.: imap-dashboard/details.json). 
This is an example file:

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
