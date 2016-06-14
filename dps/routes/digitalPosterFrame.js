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


router.route('/:sid')
	.get(function(req, res) {
		var data = {
			req: req,
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
					console.log(slides);
					data.slides = slides;
					res.render('./dpf.ejs', {data: data});
				});
			});
		});
	});

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
						console.log(data);
						res.json(data);
					});
				});
			});
		});




module.exports = router;
