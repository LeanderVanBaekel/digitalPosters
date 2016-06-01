var express 		= require('express');
var router 			= express.Router();
var fs 					= require('fs');
var MongoClient = require('mongodb');
var url 				= 'mongodb://127.0.0.1:27017/dpserver';
var mongoose   	= require('mongoose');
var Slides 			= require('../models/slides.js');

var io 					= require('socket.io')(http);

mongoose.createConnection(url);

var slidesData = [
	{
		id : '5',
		title: "Golden dot award",
		contentType : "image",
		content : "/images/GDA flyer M&C.jpg",
		duration: 10
	},
	{
		id : '6',
		title: "ICONS poster",
		contentType : "image",
		content : "/images/ICONS poster.jpg",
		duration: 10
	},
	{
		id : '7',
		title: "videoooo",
		contentType : "video",
		content : "/videos/SRP_aftermovie_versie3.mov",
		duration: 10
	},
	{
		id : '4',
		title: "iamcore",
		contentType : "image",
		content : "<h1>Mooie titel</h1><p>stukje tekst enzo</p><img src='http://loisvanzomeren.nl/img/iamcore.png' alt='ja?'>",
		duration: 10
	}
]


var addData = function () {
	console.log("Test" );
	for (var i = 0; i < slidesData.length; i++) {

		var slides = new Slides();
		slides.id = slidesData[i].id;
		slides.title = slidesData[i].title;
		slides.contentType = slidesData[i].contentType;
		slides.content = slidesData[i].content;
		slides.status = false;
		slides.createdOn = new Date();
		console.log(slides);
		slides.save(function(err) {
			console.log("test  wasd" );
			if (err)
				console.log("Test" +  err);

			console.log("slide saved");
			// res.json({ message: 'data saved!!1!' });
		});
	}
}


var data = {
	slides: []
}

// var getData = function (slides) {
// 	if (slides) {
// 		console.log('runnin');
//
// 		for (var i = 0; i < slides.length; i++) {
//
// 			var query = Slides.find({id: slides[i]});
// 			query.exec(function(err, slideData){
// 				if (err){
// 					console.log(err);
// 				}
// 				data.slides[i] = slideData;
// 				console.log(slideData);
// 				emit(slideData);
// 			});
// 		}
//
// 	} else {
//
// 		var query = Slides.find().sort({date: -1});
// 		query.exec(function(err, slideData){
// 			if (err){
// 				console.log(err);
// 			}
// 			data.slides = slideData;
// 			// console.log(slideData);
// 		});
// 	}
// };



router.route('/')
	.get(function(req, res) {

		var query = Slides.find().sort({date: -1});
		query.exec(function(err, slideData){
			if (err){
				console.log(err);
			}
			data.slides = slideData;
			res.render('./slider.ejs', {data: data});
	});
	// res.render('./slider.ejs', {data: data});
});


// io.on('connection', function(socket){
//
//  emit = function(slide) {
// 		io.emit('slideData', slide);
// 	}
//
// 	getData("0");
//
//   // socket.on('chat message', function(msg){
//   //   io.emit('chat message', msg);
//   // });
// });



module.exports = router;
