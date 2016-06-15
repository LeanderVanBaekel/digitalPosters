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

// slideshow routes!!

router.route('/')
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

router.route('/remove/:sid')
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

router.route('/edit/:sid')
	.get(function(req, res, next) {
		console.log('go to /edit-slideshow');
		if (req.session.username) {
			var data = {
				sid: req.params.sid
			};

			Slideshow.findOne({sid: data.sid}, function(err, slideshow) {
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

		} else {
			res.redirect('/dps/login');
		}
	});

router.route('/edit/:sid')
	.post(function(req, res, next) {
		console.log("post edit slideshow");

		var data = {
			sid: req.params.sid,
		};

		console.log(req.body);

		data.slides = req.body.slides.split(',');

		console.log(data.slides);

		var addedSlides = req.body.add;
		var removedSlides = req.body.remove;

		if (addedSlides) {
		 data.slides = data.slides.concat(addedSlides);
		}

		// duplicates=false;
		// for (j=0;j<data.slides.length;j++)
		//   for (k=j+1;k<data.slides.length;k++)
		//     if (k!=j && data.slides[k] == data.slides[j])
		//       duplicates=true;

		data.slides = data.slides.filter(function(elem, pos) {
	    return data.slides.indexOf(elem) == pos;
	  });



		if (removedSlides) {
			if (typeof removedSlides === 'string' || removedSlides instanceof String) {
				var check = data.slides.indexOf(removedSlides);
				console.log(check);
				if (check > -1) {
					data.slides.splice(check, 1);
					console.log(data.slides);
				}
			} else {
				removedSlides.forEach(function (slide) {
					var check = data.slides.indexOf(slide);
					console.log(check);
					if (check > -1) {
					  data.slides.splice(check, 1);
						console.log(data.slides);
					}
			 });
			}
		}


		console.log(data.slides);

		Slideshow.update({sid:data.sid}, {$set: {slides: data.slides}}, function(err){
			return res.redirect('/dps/slideshows');
		});
	});

module.exports = router;
