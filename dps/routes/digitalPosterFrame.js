var express 		= require('express');
var router 			= express.Router();
var fs 					= require('fs');
var MongoClient = require('mongodb');
var url 				= 'mongodb://127.0.0.1:27017/dpserver';
var mongoose   	= require('mongoose');
var Slide 			= require('../models/slides.js');
var Screen			= require('../models/screens.js');
var Slideshow		= require('../models/slideshows.js');

mongoose.createConnection(url);

// Route to screen id
router.route('/:sid')
	.get(function(req, res) {
		var data = {
			req: req,
			slides: [],
			screenId: req.params.sid
		}
		// search for screen data
		var query = Screen.findOne({sid:data.screenId});
		query.exec(function(err, screen){
			if (err){ return console.error(err); }
			data.screen = screen;

			// search for slideshow data of the screen
			var query = Slideshow.findOne({sid: data.screen.slideshow});
			query.exec(function(err, slideshow){
				if (err){ return console.error(err);}

				data.slideshow = slideshow;

				// search for al the slides in the slideshow
				Slide.find({ sid : { $in : data.slideshow.slides}}, function (err, slides) {
					if (err) {return console.error(err);}
					data.slides = slides;
					res.render('./dpf.ejs', {data: data});
				});
			});
		});
	});

// Route to send json formated data to the screens
router.route('/api/:sid')
	.get(function(req, res) {
		var data = {
			slides: [],
			screenId: req.params.sid
		}
		var query = Screen.findOne({sid:data.screenId});
		query.exec(function(err, screen){
			if (err){ return console.error(err); }

			data.screen = screen;

			var query = Slideshow.findOne({sid: data.screen.slideshow});
			query.exec(function(err, slideshow){
				if (err){ return console.error(err);}

				data.slideshow = slideshow;

				Slide.find({ sid : { $in : data.slideshow.slides}}, function (err, slides) {
					if (err) {return console.error(err);}
					data.slides = slides;
					res.json(data);
				});
			});
		});
	});




module.exports = router;
