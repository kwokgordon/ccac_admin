/////////////////////////////////////////////////////////////////////////////
// Shared Controller Functions

module.exports = {

	// route middleware to make sure a user is logged in
	isLoggedIn: function (req, res, next) {

		// if user is authenticated in the session, carry on
		if (req.isAuthenticated())
			return next();

		// if they aren't redirect them to the home page
		res.redirect('/');
	},
	checkPermission: function (req, res, next) {

		// check permission to the page
		if (req.user.role == "admin" || req.user.permissions.indexOf(req.params.access) != -1)
			return next();
		
		res.redirect('/no_permission');
	}


}

