// All files should follow this structure
//
// http://url/lang/header/sidebar

/////////////////////////////////////////////////////////////////////////////
// pre-define function

var path = require('path');
var configSecret = require(path.join(__basedir, 'config/secret.js'));
var AWS = require('aws-sdk');
var s3 = new AWS.S3();

// Argument index
var lang_arg = 1;
var header_arg = 2;
var sidebar_arg = 3;

String.prototype.cut = function() { 
//	return this.replace(new RegExp('/' + "*$"),'').substring(4); 
	return this.substring(4); 
};

String.prototype.mobilecut = function() { 
//	return this.replace(new RegExp('/' + "*$"),'').substring(4); 
	return this.substring(11); 
};

String.prototype.right = function(n) {
	if(this.length >= n) {
		return this.substring(this.length - n);
	} else {
		return this;
	}
};

function setup_arg(req, res) {
	arg = req.path.split("/");

	req.setLocale(req.params.lang);

	res.locals.lang = req.params.lang;
	res.locals.lg_lang = req.params.lg_lang;
	res.locals.sidebar = req.params.sidebar;
	res.locals.page_size = "full";

	res.locals.s3_bucket = configSecret.aws.s3.bucket;
	res.locals.s3_region = configSecret.aws.s3.region;
	res.locals.s3_access_key = configSecret.aws.s3.access_key;

}

/////////////////////////////////////////////////////////////////////////////
// routing

module.exports = function(app) {

	// Welcome page
	app.get('/', function(req, res) {
		res.render('main/index');
	});

	app.get('/upload_sunday_service', function(req, res) {				
		setup_arg(req, res);
	
		res.render('main/upload_sunday_service');
	});

	app.get('/remove_sunday_service/:congregation', function(req, res) {				
		setup_arg(req, res);

		res.locals.congregation = req.params.congregation;
		
		res.render('main/remove_sunday_service');
	});
	
}

/////////////////////////////////////////////////////////////////////////////
// Other prototype
Date.prototype.yyyymmdd = function() {
	var yyyy = this.getFullYear().toString();
	var mm = (this.getMonth()+1).toString(); // getMonth() is zero-based
	var dd  = this.getDate().toString();
	return yyyy + (mm[1]?mm:"0"+mm[0]) + (dd[1]?dd:"0"+dd[0]); // padding
};

Date.prototype.iso8601 = function() {
	var yyyy = this.getFullYear().toString();
	var mm = (this.getMonth()+1).toString(); // getMonth() is zero-based
	var dd  = this.getDate().toString();
	var hh  = this.getHours().toString();
	var nn  = this.getMinutes().toString();
	var ss  = this.getSeconds().toString();

	return yyyy + (mm[1]?mm:"0"+mm[0]) + (dd[1]?dd:"0"+dd[0]) + "T" + (dd[1]?dd:"0"+dd[0]) + (nn[1]?nn:"0"+nn[0]) + (ss[1]?ss:"0"+ss[0]) + "Z" ; // padding
};
