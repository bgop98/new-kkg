var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var conn = mongoose.connect('mongodb://localhost');
var schema = new mongoose.Schema({
    name: 'String',
    pwd: 'String'
});
var usersModle = conn.model('users');

/* GET home page. */
router.post('/', function (req, res, next) {
    console.log('login');
    usersModle.find({
        'user': req.body.username,
        'pwd': req.body.pwd
    }, function (err, user) {
        if (err) {
            console.log(err);
            res.status(401);
            res.send("");
        };
        console.log(user);
        if (user.length == 1) {
            res.cookie('user', user[0]);
            res.status(200);
            res.send("");
            //res.redirect('/views/home.html')
        } else {
            res.status(401);
            res.send("");
        }
    });
});

module.exports = router;
