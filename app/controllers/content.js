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

    app.get('/profile/users', shared.isLoggedIn, shared.checkPermission(["users"]), function(req, res) {
        res.render('content/users', {
            user : req.user // get the user out of session and pass to template
        });
    });

    app.get('/profile/pages', shared.isLoggedIn, shared.checkPermission(["pages_admin","pages_edit"]), function(req, res) {
        res.render('content/pages', {
            user : req.user // get the user out of session and pass to template
        });
    });

    app.get('/profile/sermons', shared.isLoggedIn, shared.checkPermission(["sermons"]), function(req, res) {
        res.render('content/sermons', {
            user : req.user // get the user out of session and pass to template
        });
    });

    app.get('/profile/uploads', shared.isLoggedIn, shared.checkPermission(["uploads"]), function(req, res) {
        res.render('content/uploads', {
            user : req.user // get the user out of session and pass to template
        });
    });
	
    app.get('/no_permission', shared.isLoggedIn, function(req, res) {
        res.render('content/no_permission', {
            user : req.user // get the user out of session and pass to template
        });
    });

}

