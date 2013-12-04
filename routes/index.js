var config = require('./../util/config-provider');

/*
 * GET home page.
 */
exports.index = function(req, res){
	config.getUser(function(User) {

		if(User) {
		  	res.render('index', {
				user: {
					name: User.user,
					folders: ["this is one", "this is another one"],
					emails: ["email1", "email2", "email3"]
				}
			});
	  	}
	  	else {
	  		res.render('index');
	  	}
  	});
};