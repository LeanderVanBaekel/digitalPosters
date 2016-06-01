var express = require('express');
var router = express.Router();
var fs = require('fs');
var MongoClient = require('mongodb');
var url 				= 'mongodb://127.0.0.1:27017/dpserver';
var mongoose   	= require('mongoose');
var Slides 			= require('../models/slides.js');

router.route('/')
	.get(function(req, res) {
		var data = {
			req: req,
			test: "test"
		};

		res.render('./backend', {data: data});
	});

	router.route('/slides')
		.get(function(req, res) {
			var data = {
				req: req,
				test: "test"
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

		});




module.exports = router;
