var path = require('path');
var configSecret = require(path.join(__basedir, 'config/secret.js'));
var AWS = require('aws-sdk');
var s3 = new AWS.S3();

/////////////////////////////////////////////////////////////////////////////
// routing

module.exports = function(app, passport) {

	// Welcome page
	app.get('/', function(req, res) {
		res.render('main/index');
	});

    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('main/profile', {
            user : req.user // get the user out of session and pass to template
        });
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
		passport.authenticate('google', { scope: 'https://www.googleapis.com/auth/plus.login' })
	);

    // the callback after google has authenticated the user
	app.get('/auth/google/callback', 
		passport.authenticate('google', { failureRedirect: '/' }), 
		function(req, res) {
			// Successful authentication
			res.redirect('/');
		}
	);
}

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/');
}