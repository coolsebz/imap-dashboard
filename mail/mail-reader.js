var Imap = require('imap');
var inspect = require('util').inspect;
var imap;

var ready = false;
var folders = [];

function setupClient(User, callback) {
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

//this method should return an array of strings
//each string represents a 'folder' name
function getFolders(callback) {
    if(ready) {
        imap.getBoxes("", function(err, data) {
            if(err) {
                console.log(err);
            }
            else {
                for(var box in data) {
                    folders.push(box.toString());
                    callback(folders);
                }
            } 
        });
    }
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



//only showing some of the methods
//encapsulation ftw!
exports.setup = setupClient;
exports.getFolders = getFolders;
exports.getEmailBody = getEmailBody;
exports.getEmailDate = getEmailDate;
exports.getEmailSubject = getEmailSubject;