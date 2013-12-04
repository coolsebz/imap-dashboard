var fs = require('fs');

function getUser(callback) {
	//return user details from details.json
	readConfig(callback);
}

function readConfig(callback) {
	fs.readFile('../details.json', 'utf8', function(err, data) {
		if(err) {
			return console.log(err);
		}
		callback(parseConfig(data));
	});
}

function parseConfig(data) {
	return JSON.parse(data);
}

exports.getUser = getUser;