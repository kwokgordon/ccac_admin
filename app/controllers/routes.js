var path = require('path');
var shared = require(path.join(__basedir, 'app/controllers/shared_functions'));

/////////////////////////////////////////////////////////////////////////////
// routing

module.exports = function(app, passport) {

	// Welcome page
	app.get('/', function(req, res) {
		res.render('main/index');
	});

    // route for logging out
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });	


    // =====================================
    // GOOGLE ROUTES =======================
    // =====================================
    app.get('/auth/google', 
		passport.authenticate('google', { scope: ['profile','email'] })
	);

    // the callback after google has authenticated the user
	app.get('/auth/google/callback', 
		passport.authenticate('google', { scope: ['profile','email'], failureRedirect: '/' }), 
		function(req, res) {
			// Successful authentication
			res.redirect('/profile');
		}
	);
}

