var express = require('express');
var router = express.Router();
var fs = require('fs');
var MongoClient = require('mongodb');
var url 				= 'mongodb://127.0.0.1:27017/dpserver';
var mongoose   	= require('mongoose');
var Slides 			= require('../models/slides.js');
var path = require('path');
var Slide = require('../models/slides.js');

// var multer = require('multer');
// var upload = multer({dest:'uploads/'});

var filesPath = __dirname + "../public";

var users = [
	{
		"u": "leander",
		"p": "123"
	},
	{
		"u": "daan",
		"p": "123"
	},
	{
		"u": "rogier",
		"p": "123"
	},
	{
		"u": "robin",
		"p": "123"
	},
	{
		"u": "eric",
		"p": "123"
	}
];

router.route('/')
	.get(function(req, res, next) {
		if (req.session.username) {
			res.redirect("slides");
		} else {
			res.redirect("login");
		}
	});

router.route('/login')
	.get(function(req, res, next) {
		if (req.session.username) {
			res.redirect("slides");
		} else {
			var data = {
				req: req,
				title: "login"
			};
			res.render("login", {data:data});
		}
	});

router.route('/login')
	.post(function (req, res, next) {

		var username = req.body.username,
			password = req.body.password;
			console.log(username + " " + password);

		for (var i = 0; i != users.length; i++) {
			if (users[i].u == username && users[i].p == password) {
				req.session.username = username;
				res.redirect(req.baseUrl + '/slides');
			}
		}
		if (!req.session.username) {
			res.redirect('login');
		}

		res.redirect('slides')
	});


// slide routes!!

router.route('/slides')
	.get(function(req, res, next) {
		if (req.session.username) {
			console.log('go to /slides');

			var data = {
				req: req,
				title: "slides"
			};

			var query = Slides.find().sort({date: -1});
			query.exec(function(err, slideData){
				if (err){
									console.log(err);
							}
							// console.log(slideData);
							data.slides = slideData;
							res.render('./slides.ejs', {data: data});
			});
		} else {
			res.redirect('login');
		}
	});

router.route('/slide/delete/:id')
	.post(function(req, res, next) {
		if (req.session.username) {
			console.log('Deleted a slide and route to /slide');
			res.redirect('/slide');
		} else {
			res.redirect('login');
		}
	});


router.route('/add-slide')
	.get(function(req, res, next) {
		if (req.session.username) {

			var data = {
				req: req,
				title: "add slide"
			};
			console.log('go to /add-slide');
			res.render('./add-slide.ejs', {data: data});
		} else {
			res.redirect('login');
		}
	});

router.route('/add-slide')
	.post(function(req, res, next) {
		console.log('runnin');
		if (req.session.username) {
			var createSlide = {
				id: 0,
				newSlideFunction: function () {
					var newSlide = Slide();
					newSlide.createdOn = new Date();
					newSlide.createdBy = req.session.username;
					newSlide.duration = req.body.duration;
					newSlide.endsOn = req.body.endsOn;
					newSlide.status = false;
					newSlide.contentType = req.body.contentType;
					newSlide.content = req.body.content;
					newSlide.title = req.body.title;
					newSlide.id = this.id;

					this.redirect();
				},
				getNewId: function () {
					var query = Slides.find().sort({date: -1});
					query.exec(function(err, slideData){
						if (err){
							console.log(err);
						}

						for (var i = 0; i < slideData.length; i++) {
							if (slideData[i].id >= createSlide.id) {
								console.log(slideData[i].id + " " + createSlide.id);
								createSlide.id = slideData[i];
								createSlide.id ++;
							}
						}
						this.newSlideFunction();
					});
				},
				redirect: function () {
					res.redirect('slides');
				}
			};
			// createSlide.getNewId();


			var newSlide = {};
			newSlide.createdOn = new Date();
			newSlide.createdBy = req.session.username;
			newSlide.duration = req.body.duration;
			newSlide.endsOn = req.body.endsOn;
			newSlide.status = false;
			newSlide.contentType = req.body.contentType;
			newSlide.content = req.body.content;
			newSlide.title = req.body.title;
			newSlide.id = this.id;

			if (req.body.contentType == "text") {
				newSlide.content = "<h1>"+req.body.header+"</h1>"+"<h2>"+req.body.subHeader+"</h2>"+"<p>"+req.body.mainText+"</p>";
			} else if (req.body.contentType == "video") {

			} else if (req.body.contentType == "image") {
				console.log(req);
				var image = req.body.fileToUpload;
				// var image = upload.single("fileToUpload");
				console.log(image);
			}


			console.log(newSlide);
			res.redirect('add-slide');
		} else {
			res.redirect('login');
		}
	});

router.route('/edit-slide/:id')
	.get(function(req, res, next) {
		if (req.session.username) {
			var data = {};
			console.log('go to /edit-slide');
			res.render('./edit-slide', {data:data});
		} else {
			res.redirect('login');
		}
	});

// slideshow routes!!

router.route('/slideshows')
	.get(function(req, res, next) {
		if (req.session.username) {
			var data = {
				req: req,
				title: "slideshows"
			};
			console.log('go to /slideshows');
			res.render('./slideshows.ejs', {data: data});
		} else {
			res.redirect('login');
		}
	});

router.route('/slideshows/delete/:id')
	.post(function(req, res, next) {
		if (req.session.username) {
			console.log('Deleted a slideshow and route to /slideshows');
			res.redirect('/slideshows');
		} else {
			res.redirect('login');
		}
	});

router.route('/add-slideshow')
	.get(function(req, res, next) {
		if (req.session.username) {
			var data = {
				req: req,
				title: "add slideshow"
			};
			console.log('go to /add-slideshow');
			res.render('./add-slideshow.ejs', {data: data});
		} else {
			res.redirect('login');
		}
	});

router.route('/edit-slideshow/:id')
	.get(function(req, res, next) {
		if (req.session.username) {
			var data = {};
			console.log('go to /edit-slideshow');
			res.render('./edit-slideshow', {data:data});
		} else {
			res.redirect('login');
		}
	});

router.route('/logout')
	.get(function(req, res, next) {
		if (req.session.username) {
			req.session.destroy(function (err) {
				console.log(err);

				res.redirect('login');
			});
		} else {
			res.redirect('login');
		}
	});

//
// router.get('/logout', function (req, res, next) {
// 	 req.session.destroy(function (err) {
// 		 if (req.session.username) {
// 		 	console.log(err);
// 	 } else {
// 		 res.redirect('login');
// 	 }
// })

module.exports = router;
