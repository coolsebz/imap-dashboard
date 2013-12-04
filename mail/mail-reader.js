var Imap = require('imap'),
	inspect = require('util').inspect;

var imap = new Imap({
	//account details here
});

function openInbox(cb) {
	imap.openBox("INBOX", true, cb);
}

//this method should return an array of strings
//each string represents a 'folder' name
function getFolders() {
	
}

//this method should return an array of strings
//each string represents the title of an email 
function getEmailTitles(boxName) {

}

//this method should get the mails from the server
//serves as a caching method on the server
//todo: if found problematic please use a new call for every read
function getEmails(boxName) {

}

//this method should return the text of a specific email
function getEmailBody(emailId) {

}

//this method should return the subject of a specific email
function getEmailSubject(emailId) {
	
}

//this method should return the date of a specific email
function getEmailDate(emailId) {

}

imap.once('ready', function() {
  openInbox(function(err, box) {
    if (err) throw err;
    var f = imap.seq.fetch('1:3', {
      bodies: 'HEADER.FIELDS (FROM TO SUBJECT DATE)',
      struct: true
    });
    f.on('message', function(msg, seqno) {
      console.log('Message #%d', seqno);
      var prefix = '(#' + seqno + ') ';
      msg.on('body', function(stream, info) {
        var buffer = '';
        stream.on('data', function(chunk) {
          buffer += chunk.toString('utf8');
        });
        stream.once('end', function() {
          console.log(prefix + 'Parsed header: %s', inspect(Imap.parseHeader(buffer)));
        });
      });
      msg.once('attributes', function(attrs) {
        console.log(prefix + 'Attributes: %s', inspect(attrs, false, 8));
      });
      msg.once('end', function() {
        console.log(prefix + 'Finished');
      });
    });
    f.once('error', function(err) {
      console.log('Fetch error: ' + err);
    });
    f.once('end', function() {
      console.log('Done fetching all messages!');
      imap.end();
    });
  });
});

imap.once('error', function(err) {
	console.log(err);
});

imap.once('end', function() {
	console.log('Connection ended');
});