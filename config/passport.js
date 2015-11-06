var path = require('path');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

// load User model
var User = require(path.join(__basedir, 'app/models/user'));
var Invitation = require(path.join(__basedir, 'app/models/invitation'));

// load the auth variables
var configAuth = require(path.join(__basedir, 'config/auth.js'));

module.exports = function(passport) {

	// used to serialize the user for the session
	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});

	// used to deserialize the user
	passport.deserializeUser(function(id, done) {
		User.findById(id, function(err, user) {
			done(err, user);
		});
	});
	
	// code for login (use('local-login', new LocalStategy))
	// code for signup (use('local-signup', new LocalStategy))
	// code for facebook (use('facebook', new FacebookStrategy))
	// code for twitter (use('twitter', new TwitterStrategy))
	
	// =========================================================================
	// GOOGLE ==================================================================
	// =========================================================================
	passport.use(new GoogleStrategy({

		clientID        : configAuth.googleAuth.clientID,
		clientSecret    : configAuth.googleAuth.clientSecret,
		callbackURL     : configAuth.googleAuth.callbackURL
	},
	function(accessToken, refreshToken, profile, done) {
		// make the code asynchronous
		// User.findOne won't fire until we have all our data back from Google
		process.nextTick(function() {

			// try to find the user based on their google id
			User.findOne({ 'google.id' : profile.id }, function(err, user) {
				if (err)
					return done(err);

				if (user) {
					user.updated_tms = new Date();
					user.save();
				
					// if a user is found, log them in
					return done(null, user);
				} else {

					Invitation.findOne({'email': profile.emails[0].value}, function(err, invite) {
						if (err)
							res.send(err);
						
						if (invite) {
							// if the user not in our database, create a new user from the invite details
							var newUser = new User();

							// set all of the relevant information
							newUser.google.id    = profile.id;
							newUser.google.token = accessToken;
							newUser.google.name  = profile.displayName;
							newUser.google.email = profile.emails[0].value; // pull the first email
							newUser.role = invite.role;
							newUser.permissions = invite.permissions;

							invite.remove();

							// save the user
							newUser.save(function(err) {
								if (err)
									throw err;
								
								return done(null, newUser);
							});
						} else {
							// if the user not in our database, create a new user
							var newUser = new User();

							// set all of the relevant information
							newUser.google.id    = profile.id;
							newUser.google.token = accessToken;
							newUser.google.name  = profile.displayName;
							newUser.google.email = profile.emails[0].value; // pull the first email

							// save the user
							newUser.save(function(err) {
								if (err)
									throw err;
								return done(null, newUser);
							});
						}
					});
				
				}
			});
		});

	}));	
};
