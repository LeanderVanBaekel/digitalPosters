var express = require('express');
var router = express.Router();
var fs = require('fs');
var MongoClient = require('mongodb');
var url 				= 'mongodb://127.0.0.1:27017/dpserver';
var mongoose   	= require('mongoose');
var path = require('path');
var Slide = require('../models/slides.js');
var Slideshow = require('../models/slideshows.js');

var multer  = require('multer')
var upload = multer({ dest: 'uploads/' })


var filesPath = __dirname + "../public";

var users = [
	{
		"u": "leander",
		"p": "123"
	},
	{
		"u": "matthijs",
		"p": "123"
	}
];

router.route('/')
	.get(function(req, res, next) {
		if (req.session.username) {
			res.redirect("/dps/slides");
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
				res.redirect('slides');
			}
		}
		if (!req.session.username) {
			return res.redirect('/dps/login');
		}
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

			var query = Slide.find().sort({date: -1});
			query.exec(function(err, slideData){
				if (err){
					return console.error(err);
				}
				data.slides = slideData;

				res.render('./slides.ejs', {data: data});
			});
		} else {
			res.redirect('/dps/login');
		}
	});

router.route('/slides/remove/:sid')
	.get(function(req, res, next) {
		if (req.session.username) {
			var getSid = req.params.sid;
			console.log(getSid);
			console.log('Deleted a slide and route to /slide');
			Slide.remove({ sid: getSid }, function (err) {
				if (err){
								console.log(err);
							}
  				console.log( getSid + " removed!");
					res.redirect('/dps/slides');
				});
		} else {
			res.redirect('/dps/login');
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
			res.redirect('/dps/login');
		}
	});

router.route('/add-slide', multer({ dest: './uploads/'}).single('fileToUpload'))
	.post(function(req, res, next) {
		if (req.session.username) {
			var createSlide = {
				newSlideFunction: function (newId) {
					var newSlide = Slide();
					newSlide.createdOn = new Date();
					newSlide.createdBy = req.session.username;
					newSlide.duration = req.body.duration;
					newSlide.endsOn = req.body.endsOn;
					newSlide.status = false;
					newSlide.contentType = req.body.contentType;
					newSlide.content = req.body.content;
					newSlide.title = req.body.title;
					if (newSlide.title == "") {
						newSlide.title = newId.toString();
					}
					newSlide.sid = newId;

					if (req.body.contentType == "text") {
						newSlide.content = "<h1>"+req.body.header+"</h1>"+"<h2>"+req.body.subHeader+"</h2>"+"<p>"+req.body.mainText+"</p>";
					} else if (req.body.contentType == "video") {
						var video = req.file;
						console.log(req);
						if (video) {
							var extension = req.file.originalname.split(".");
							extension = extension[(extension.length -1)];
							fs.renameSync("./"+ video.path, "public/videos/" + newSlide.sid + "." + extension);
							newSlide.content = "/videos/" + newSlide.sid + "." + extension;
						}
					} else if (req.body.contentType == "image") {

						var image = req.file;
						console.log(req);
						if (image) {
							var extension = req.file.originalname.split(".");
							extension = extension[(extension.length -1)];
							fs.renameSync("./"+ image.path, "public/posters/" + newSlide.sid + "." + extension);
							newSlide.content = "/posters/" + newSlide.sid + "." + extension;
						}
					}

					console.log(newSlide);
					createSlide.saveData(newSlide);
				},
				getNewId: function () {
					var newId = 0;
					var query = Slide.find().sort({date: -1});
					query.exec(function(err, slideData){
						if (err){
							console.log(err);
						}

						for (var i = 0; i < slideData.length; i++) {
							if (slideData[i].sid >= newId) {
								console.log(slideData[i].sid + " " + newId);
								newId = slideData[i].sid;
								newId ++;
							}
						}
						createSlide.newSlideFunction(newId);
					});
				},
				saveData: function (data) {
					data.save(function(err) {
            if (err)
              res.send(err);

						createSlide.redirect();
	        });
				},
				redirect: function () {

					res.redirect('slides');
				}
			};
			createSlide.getNewId();

		} else {
			res.redirect('/dps/login');
		}
	});

router.route('/edit-slide/:id')
	.get(function(req, res, next) {
		if (req.session.username) {
			var data = {};
			console.log('go to /edit-slide');
			res.render('./edit-slide', {data:data});
		} else {
			res.redirect('/dps/login');
		}
	});

// slideshow routes!!

router.route('/slideshows')
	.get(function(req, res, next) {
		if (req.session.username) {
			console.log('go to /slideshows');

			var data = {
				req: req,
				title: "slideshows"
			};

			var query = Slideshow.find().sort({date: -1});
			query.exec(function(err, slideData){
				if (err){
								console.log(err);
							}
							data.slideshows = slideData;
							res.render('./slideshows.ejs', {data: data});
			});
		} else {
			res.redirect('/dps/login');
		}
	});

router.route('/slideshows/remove/:sid')
	.get(function(req, res, next) {
		if (req.session.username) {
			var getSid = req.params.sid;
			console.log(getSid);
			console.log('Deleted a slideshow and route to /slideshows');
			Slideshow.remove({ sid: getSid }, function (err) {
				if (err) {
					console.log(err);
				}
				console.log(getSid + " removed!");
				res.redirect('/dps/slideshows');
			});
		} else {
			res.redirect('/dps/login');
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
			res.redirect('/dps/login');
		}
	});

router.route('/add-slideshow')
	.post(function(req, res, next) {
		if (req.session.username) {
			var createSlideshow = {
				newSlideshowFunction: function (newId) {
					var newSlideshow = Slideshow();
					newSlideshow.createdOn = new Date();
					newSlideshow.createdBy = req.session.username;
					newSlideshow.name = req.body.name;
					if (newSlideshow.name == "") {
						newSlideshow.name = newId.toString();
					}
					newSlideshow.sid = newId;
					newSlideshow.slides.push(1);

					console.log(newSlideshow);
					createSlideshow.saveData(newSlideshow);
				},
				getNewId: function () {
					var newId = 0;
					var query = Slideshow.find().sort({date: -1});
					query.exec(function(err, slideshowData){
						if (err){
							console.log(err);
						}
						console.log(slideshowData);
						if (slideshowData) {
							for (var i = 0; i < slideshowData.length; i++) {
								if (slideshowData[i].sid >= newId) {
									console.log(slideshowData[i].sid + " " + newId);
									newId = slideshowData[i].sid;
									newId ++;
								}
							}
						} else {
							newId = 1;
						}
						console.log(newId);
						createSlideshow.newSlideshowFunction(newId);
					});
				},
				saveData: function (data) {
					data.save(function(err) {
            if (err)
              res.send(err);

						createSlideshow.redirect();
	        });
				},
				redirect: function () {

					res.redirect('slideshows');
				}
			};
			createSlideshow.getNewId();

		} else {
			res.redirect('/dps/login');
		}
	});

router.route('/slideshows/edit/:sid')
	.get(function(req, res, next) {
		console.log('go to /edit-slideshow');
		if (req.session.username) {
			var data = {
				sid: req.params.sid
			};

			Slideshow.findOne({sid: data.sid}, function(err, slideshow) {
				data.slideshow = slideshow;
				res.render('./edit-slideshow', {data:data});
			});

		} else {
			res.redirect('/dps/login');
		}
	});

router.route('/slideshows/edit/:sid')
	.post(function(req, res, next) {
		console.log("post edit slideshow");

		var data = {
			sid: req.params.sid,
		};

		data.slides = req.body.slides.split(',');

		console.log(data.slides);

		Slideshow.update({sid:data.sid}, {$set: {slides: data.slides}}, function(err){
			return res.redirect('/dps/slideshows');
		});
	});

router.route('/logout')
	.get(function(req, res, next) {
		if (req.session.username) {
			req.session.destroy(function (err) {
				console.log(err);

				res.redirect('/dps/login');
			});
		} else {
			res.redirect('/dps/login');
		}
	});

//
// router.get('/logout', function (req, res, next) {
// 	 req.session.destroy(function (err) {
// 		 if (req.session.username) {
// 		 	console.log(err);
// 	 } else {
// 		 res.redirect('/dps/login');
// 	 }
// })

module.exports = router;
