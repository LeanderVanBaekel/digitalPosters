var express 		= require('express');
var router 			= express.Router();
var fs 					= require('fs');
var MongoClient = require('mongodb');
var url 				= 'mongodb://127.0.0.1:27017/dpserver';
var mongoose   	= require('mongoose');
var path 				= require('path');
var Slide 			= require('../models/slides.js');
var Slideshow 	= require('../models/slideshows.js');
var Screen 			= require('../models/screens.js');
var multer  		= require('multer')
var upload 			= multer({ dest: 'uploads/' })

var filesPath = __dirname + "../public";

// screens overview
router.route('/')
	.get(function(req,res,next) {
		if (req.session.username) {
			var data = {
				req: req,
				title: "screens"
			};

			// get all the screen data
			var query = Screen.find().sort({sid:-1});
			query.exec(function(err, screenData) {
				if (err) {return console.error(err);}
				if (screenData) {
					data.screens = screenData;
				}
				res.render('./screens.ejs', {data: data});
			});
		} else {
			return res.redirect('/dps/login');
		}
	});

// route to edit a screen
router.route('/edit/:sid')
	.get(function(req, res, next) {
		if (!req.session.username) { return res.redirect('/dps/login');}

		var data = {
			// req: req,
			title: "edit"
		}

		var sid = req.params.sid;

		var query = Screen.findOne({sid: sid}, function(err, screenData) {
			if (err){return console.error(err);}

			data.screenData = screenData;
			data.title = data.title + " " + screenData.name;
			Slideshow.findOne({sid: sid}, function(err, slideshow) {
				data.slideshow = slideshow;
				Slide.find({}, function (err, slides) {
					if (err){return console.error(err);}
					data.allSlides = slides;

					Slide.find({sid: {$in:data.slideshow.slides}}, function (err,usedSlides) {
						if (err){return console.error(err);}
						data.usedSlides = usedSlides;
						res.render('./edit-slideshow', {data:data});
					});

				});
			});
				// return res.render('./edit-screen.ejs', {data: data});
		});
	});

router.route('/edit/use/:data')
	.get(function(req, res, next) {
		if (!req.session.username) { return res.redirect('/dps/login');}
		var data = {};
		var tempData = req.params.data.split("-");
		data.screenSid = tempData[0];
		data.newSlideshowSid = tempData[1];

		Screen.update({sid:data.screenSid}, {$set: {slideshow:data.newSlideshowSid}}, function(err){
			return res.redirect('/dps/screens');
		});
	});

router.route('/add-screen')
	.get(function(req, res, next) {
		if (!req.session.username) { return res.redirect('/dps/login');}
		var data = {
			title: "add screen"
		};
		res.render('./add-screen.ejs', {data: data});
	});

router.route('/add-screen')
	.post(function(req, res, next) {
		if (!req.session.username) { return res.redirect('/dps/login');}
		var createScreen = {
			newScreenFunction: function (newId) {
				var newScreen = Screen();
				newScreen.createdOn = new Date();
				newScreen.createdBy = req.session.username;
				newScreen.name = req.body.name;
				if (newScreen.name == "") {
					newScreen.name = newId.toString();
				}
				newScreen.sid = newId;
				newScreen.slideshow = 0;

				console.log(newScreen);
				createScreen.saveData(newScreen);
			},
			getNewId: function () {
				var newId = 0;
				var query = Screen.find().sort({date: -1});
				query.exec(function(err, screenData){
					if (err){
						console.log(err);
					}
					console.log(screenData);
					if (screenData) {
						for (var i = 0; i < screenData.length; i++) {
							if (screenData[i].sid >= newId) {
								console.log(screenData[i].sid + " " + newId);
								newId = screenData[i].sid;
								newId ++;
							}
						}
					} else {
						newId = 1;
					}
					console.log(newId);
					createScreen.newScreenFunction(newId);
				});
			},
			saveData: function (data) {
				data.save(function(err) {
					if (err)
						res.send(err);

					createScreen.redirect();
				});
			},
			redirect: function () {

				res.redirect('/dps/screens');
			}
		};
		createScreen.getNewId();
	});

module.exports = router;
