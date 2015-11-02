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
	checkPermission: function(permissions) { 
		return function (req, res, next) {

			var access = false;
		
			for (i = 0; i < permissions.length; i++) {
				// check permission to the page
				if (req.user.role == "admin" || req.user.permissions.indexOf(permissions[i]) != -1)
					access = true;
			}
			
			if (access) 
				return next();
			else
				res.redirect('/no_permission');
		}
	}

}

