imap-dashboard
==============

A simple IMAP app, that brings your mails onto a dashboard. Please provide your credentials in a configuration file

## Details file
This file contains details about your imap client. It should be placed at the root level in the project's folder (eg.: imap-dashboard/details.json). 

:warning: If you have 2 step verification on your gmail account, please create a new Application password which is used for this email reader. It will not work with your usual account password.

This is an example file:

```javascript
{
	"user": "username@userdomain.com",
	"password": "userpass",
	//this is the gmail imap host
	"host": "imap.gmail.com",
	//this is the gmail port
	"port": 993,
	//tls options
	"tls": true,
	"tlsOptions": { "rejectUnauthorized": false }
}
```
