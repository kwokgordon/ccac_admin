var express = require('express');
var port = process.env.PORT || 3100;
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var namespace = require('express-namespace');
var mongoose = require('mongoose');
var ejs = require('ejs');

var app = express();

global.__basedir = __dirname;
var configSecret = require(path.join(__basedir, 'config/secret.js'));
var db = require(path.join(__basedir, 'config/db.js'));

// DB config
mongoose.connect(db.db.mongo);

// view engine setup
app.engine('html', ejs.renderFile);
app.set('view engine', 'html');
app.set('views', path.join(__basedir, 'app/views'));

app.use(favicon(path.join(__basedir, 'public/img/favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__basedir, 'public')));

////////////////////////////////////////////////////////////////////
// Routes

require(path.join(__basedir, 'app/controllers/api'))(app);
require(path.join(__basedir, 'app/controllers/routes'))(app);

////////////////////////////////////////////////////////////////////

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('main/error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('main/error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
