
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', {
		user: {
			name: "debugTest",
			folders: ["this is one", "this is another one"],
			emails: ["email1", "email2", "email3"]
		} 
	});
};