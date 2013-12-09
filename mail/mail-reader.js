var Imap = require('imap');
var inspect = require('util').inspect;
var imap;

var ready = false;
var folders;
var emails = [];

function setupClient(User, callback) {

    if(typeof imap === 'undefined') {
        imap = new Imap({
            user: User.user,
            password: User.password,
            host: User.host,
            port: User.port,
            tls: User.tls,
            tlsOptions: User.tlsOptions
        });

        //setting up events
        imap.once('ready', function() {
            ready = true;
            callback();
        });

        imap.once('error', function(err) {
            console.log(err);
            ready = false;
        });

        imap.once('end', function() {
            console.log('Connection ended');
            ready = false;
        });

        imap.connect();
    }
    else {
        callback();
    }
}

//this method should return an array of strings
//each string represents a 'folder' name
function getFolders(callback) {
    if(ready && typeof folders === 'undefined') {
        folders = [];
        imap.getBoxes("", function(err, data) {
            if(err) {
                console.log(err);
            }
            else {
                for(var box in data) {
                    folders.push(box.toString());
                }
                callback(folders);
            } 
        });
    }
    else {
        callback(folders);
    }
}

//this method should return an array of strings
//each string represents the title of an email 
function getEmailTitles(boxName) {

}

//this method should get the mails from the server
//serves as a caching method on the server
//todo: if found problematic please use a new call for every read
function getEmails(folderName, callback) {
    openFolder(folderName, function(folder) {
        var emails = imap.seq.fetch('1:3', {
            bodies: ['HEADER.FIELDS (FROM TO SUBJECT DATE)', 'TEXT'],
            struct: true
        }); 

        if(typeof emails === 'undefined')
            emails = [];

        emails.on('message', function(message, id_sequence) {
            //console.log(" --> Message #" + id_sequence);
            var prefix = '     ';



            message.on('body', function(stream, info) {
                if (info.which === 'TEXT')
                //console.log(prefix + 'Body [%s] found, %d total bytes', inspect(info.which), info.size);
                var buffer = '', count = 0;
                stream.on('data', function(chunk) {
                    count += chunk.length;
                    buffer += chunk.toString('utf8');
                //if (info.which === 'TEXT')
                    //console.log(prefix + 'Body [%s] (%d/%d)', inspect(info.which), count, info.size);
            });

              stream.once('end', function() {
                if (info.which !== 'TEXT')
                  console.log(prefix + 'Parsed header: %s', inspect(Imap.parseHeader(buffer)));
                else {
                  console.log(prefix + 'BODY TEXT: %s', buffer);
                  //console.log(prefix + 'Body [%s] Finished', inspect(info.which));
                }
              });
            });
            message.once('attributes', function(attrs) {
              console.log(prefix + 'Attributes: %s', inspect(attrs, false, 8));
            });
            message.once('end', function() {
              //console.log(prefix + 'Finished');
            });
          });
        }); 
    // });
}

//this method should return the text of a specific email
function getEmailBody(emailId) {
    //at this point all details about the email have been fetched
    return emails[emailId].body;
}

//this method should return the subject of a specific email
function getEmailSubject(emailId) {
    return emails[emailId].subject;
}

//this method should return the date of a specific email
function getEmailDate(emailId) {
    return emails[emailId].date;
}

//private functions
function openFolder(folderName, callback) {
    if(imap) {
        //calling the imap extension method
        imap.openBox(folderName, true, function(err, folder) {
            if(err) console.log(err);
            else {
                callback(folder);
            }
        });
    }
}

//only showing some of the methods
//encapsulation ftw!
exports.setup = setupClient;
exports.getFolders = getFolders;
exports.getEmailBody = getEmailBody;
exports.getEmailDate = getEmailDate;
exports.getEmailSubject = getEmailSubject;
exports.getEmails = getEmails;