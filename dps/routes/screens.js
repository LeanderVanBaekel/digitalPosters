var express = require('express');
var router = express.Router();
var fs = require('fs');
var MongoClient = require('mongodb');
var url 				= 'mongodb://127.0.0.1:27017/dpserver';
var mongoose   	= require('mongoose');
var path = require('path');
var Slide = require('../models/slides.js');
var Slideshow = require('../models/slideshows.js');
var Screen = require('../models/screens.js');

var multer  = require('multer')
var upload = multer({ dest: 'uploads/' })


var filesPath = __dirname + "../public";

router.route('/')
	.get(function(req,res,next) {
		if (req.session.username) {
			var data = {
				req: req,
				title: "screens"
			};
			var query = Screen.find().sort({sid:-1});
			query.exec(function(err, screenData) {
				if (err) {return console.error(err);}
				if (screenData) {
					data.screens = screenData;
					if (!data.screens[1]) {
						var screen = Screen();

						screen.sid = 1;
						screen.slideshow = 5;
						screen.location = "TTH1";
						screen.name = "scherm 1";
						screen.createdBy = "leander";
						screen.createdOn = new date();

						screen.save(function(err) {
            	if (err)
              	res.send(err);
	        	});
					}
				}


				// else {
				// 	console.log('runnin');
				// 	var newScreen = Screen();
				// 	newScreen.createdOn = new Date();
				// 	newScreen.createdBy = req.session.username;
				// 	newScreen.name = "scherm 1";
				// 	newScreen.location = "TTH1";
				// 	newScreen.slideshow = 1;
				// 	newScreen.sid = 1;
				//
				// 	newScreen.save(function(err) {
        //     if (err)
        //       res.send(err);
	      //   });
				// }
				res.render('./screens.ejs', {data: data});
			});
		} else {
			return res.redirect('/dps/login');
		}
	});


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

			var query = Slideshow.find({}, function (err, slideshowData) {
				if (err){return console.error(err);}

				data.slideshows = slideshowData;

				console.log(data.slideshows);

				for (var i = 0; i < data.slideshows.length; i++) {
					console.log(data.slideshows[i].sid +" "+ data.screenData.slideshow);
					if (data.slideshows[i].sid == data.screenData.slideshow ) {
						data.currentSlideshow = data.slideshows[i];
						slideshowData.splice(i, 1);
					}
				}
				console.log(data);
				return res.render('./edit-screen.ejs', {data: data});
			});
		});
	});

router.route('/edit/use/:data')
	.get(function(req, res, next) {
		var data = {};
		var tempData = req.params.data.split("-");
		data.screenSid = tempData[0];
		data.newSlideshowSid = tempData[1];

		Screen.update({sid:data.screenSid}, {$set: {slideshow:data.newSlideshowSid}}, function(err){
			return res.redirect('/dps/screens');
		});
	});


module.exports = router;
