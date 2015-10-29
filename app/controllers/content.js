var path = require('path');
var shared = require(path.join(__basedir, 'app/controllers/shared_functions'));

/////////////////////////////////////////////////////////////////////////////
// routing - after login

module.exports = function(app, passport) {

	// first page after login successful
    app.get('/profile', shared.isLoggedIn, function(req, res) {
        res.render('content/profile', {
            user : req.user // get the user out of session and pass to template
        });
    });

    app.get('/profile/:access', shared.isLoggedIn, shared.checkPermission, function(req, res) {
        res.render('content/' + req.params.access, {
            user : req.user // get the user out of session and pass to template
        });
    });
	
    app.get('/no_permission', shared.isLoggedIn, function(req, res) {
        res.render('content/no_permission', {
            user : req.user // get the user out of session and pass to template
        });
    });
	
}

