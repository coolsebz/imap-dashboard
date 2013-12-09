var Imap = require('imap');
var inspect = require('util').inspect;
var imap;

var ready = false;
var folders;
var emailsInFolder = [];

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

    //just making sure we don't get the emails added to the already present email list
    emailsInFolder = [];

    openFolder(folderName, function(folder) {
        var emails = imap.seq.fetch('1:50', {
            bodies: ['HEADER.FIELDS (FROM TO SUBJECT DATE)', 'TEXT'],
            struct: true
        }); 


        emails.on('message', function(message, id_sequence) {
            
            //this is the email template
            var readEmail = {
                id: 0,
                from: "",
                to: "",
                date: "",
                subject: "",
                body: "",
                hasHeaderReady: false,
                hasBodyReady: false,
            };

            message.on('body', function(stream, info) {
                if (info.which === 'TEXT')
                
                var buffer = '', count = 0;
                stream.on('data', function(chunk) {
                    count += chunk.length;
                    buffer += chunk.toString('utf8');
                });
                stream.once('end', function() {
                    if (info.which !== 'TEXT') {
                        var parsedHeader = Imap.parseHeader(buffer);

                        readEmail.id = id_sequence;
                        //this should solve the weird headers
                        readEmail.from = getNotEmpty(parsedHeader, "from", "undefinedfrom", "unidentified");
                        readEmail.to = getNotEmpty(parsedHeader, "to", "undefinedto", "unidentified");
                        readEmail.date = getNotEmpty(parsedHeader, "date", "undefineddate", "unidentified");
                        readEmail.subject = getNotEmpty(parsedHeader, "subject", "undefinedsubject", "");
                        readEmail.hasHeaderReady = true;
                    }

                    else {
                      readEmail.body = buffer;
                      readEmail.hasBodyReady = true;
                    }

                    if(readEmail.hasBodyReady === true && readEmail.hasHeaderReady === true) {
                        emailsInFolder.push(readEmail);
                    }
                });
            });

            message.once('attributes', function(attrs) {
                //console.log('Attributes: %s', inspect(attrs, false, 8));
            });
            message.once('end', function() {
                //console.log('Finished');
                
            });
        });
        
        emails.on('end', function() {
            console.log("DONE");
            callback(emailsInFolder);
        });
    });
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

function getNotEmpty(object, fieldName, alternateFieldName, defaultValue) {
    var valueToReturn;
    if(typeof object[fieldName] === 'undefined') {
        if(typeof object[alternateFieldName] !== 'undefined') {
            valueToReturn = object[alternateFieldName][0];
        }
        else {
            valueToReturn = defaultValue;
        }
    }
    else {
        valueToReturn = object[fieldName][0];
    }           
    return valueToReturn;
}

//only showing some of the methods
//encapsulation ftw!
exports.setup = setupClient;
exports.getFolders = getFolders;
exports.getEmailBody = getEmailBody;
exports.getEmailDate = getEmailDate;
exports.getEmailSubject = getEmailSubject;
exports.getEmails = getEmails;