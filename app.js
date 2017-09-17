var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var conn = mongoose.connect('mongodb://localhost');
var schema = new mongoose.Schema({
    name: 'String',
    pwd: 'String'
});
var usersModle = mongoose.model('users', schema);

var index = require('./routes/index');
var users = require('./routes/users');
var login = require('./routes/login');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public

//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
console.log('beforeBody')
app.use(bodyParser.json());
console.log('afterBody')
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());

app.use(function (req, res, next) {
    if (req.cookies.user == undefined && req.url != '/login') {
        console.log('unau');
        var err = new Error('unautharised');
        err.status = 401;
        next(err);
    }
    next();
});

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);

app.use('/users', users);

app.use('/login', login);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    if (err.status == 401) {
        //res.sendFile('views/login.html', {root:'./public'});
    } else {
        res.render('error');
    }
});

module.exports = app;
