var config = require('./../util/config-provider');
var mail = require('./../mail/mail-reader');

/*
 * GET home page.
 */
exports.index = function(req, res) {

	config.getUser(function(User) {

		if(User) {

			var displayedData = {};

			displayedData.name = User.user;

			mail.setup(User, function() {
				//at this moment we know that we are connected, so we get the folders
				mail.getFolders(function (folders) {
					displayedData.folders = folders;
					//safe for rendering
					render(res, {
						user: {
							name: displayedData.name,
							folders: displayedData.folders,
							emails: ["email1", "email2", "email3"]
						}
					});
				});
			});
	  	}
	  	else {
	  		render(res);
	  	}
  	});
};


function render(res, data) {
	res.render('index', data)
}