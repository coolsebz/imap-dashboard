var fs = require('fs');

function getUser(callback) {
	//return user details from details.json
	readConfig(callback);
}

function readConfig(callback) {
	fs.readFile(__dirname + '/../details.json', 'utf8', function(err, data) {
		if(err) {
			console.log(err);
			callback(undefined)
		}
		else {
			callback(parseConfig(data));	
		}
	});
}

function parseConfig(data) {
	return JSON.parse(data);
}

exports.getUser = getUser;