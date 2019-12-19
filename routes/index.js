var express = require('express');
var router = express.Router();
var mysql = require('mysql');

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '12345678',
    database : 'test_vuejs'
});

/* GET home page. */
router.get('/home', function(req, res, next) {
  res.render('index', { message: '' });
});

router.get('/', function(req, res, next) {
  res.render('login', { message: '' });
});

router.get('/login', function(req, res) {
	res.render('login', {message: ""});
});

router.post('/login', function(req, res) {
	var username = req.body.username;
	var password = req.body.password;
	if (username && password) {
		connection.query('SELECT * FROM users WHERE name = ? AND password = ?', [username, password], function(error, results, fields) {
			if (results.length > 0) {

				let type = results[0].type;

				req.session.username = username;
				req.session.type = type;

				switch(type) {
					case 0:
						res.redirect('/test');
						break;
					case 1:
						res.redirect('/presentation');
						break;
					case 2:
						res.redirect('/master');
						break;
					default:
						res.redirect('/home');
						break;
				}
			} else {
				res.send('Incorrect Username and/or Password!');
			}			
			res.end();
		});
	} else {
		res.send('Please enter Username and Password!');
		res.redirect('/login');
	}
});

router.get('/master', function(req,res) {
	if (req.session.type == 2) {
		res.render('master', {username: req.session.username, type: req.session.type});
	} else {
		res.redirect('/login');
	}
});

router.get('/presentation', function(req,res) {
	if (req.session.type == 1) {
		res.render('presentation', {username: req.session.username, type: req.session.type});
	} else {
		res.redirect('/login');
	}
});

router.get('/test', function(req,res) {
	if (req.session.type == 0) {
		res.render('test', {username: req.session.username, type: req.session.type});
	} else {
		res.redirect('/login');
	}
});

module.exports = router;
