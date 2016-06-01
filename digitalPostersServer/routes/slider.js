var express = require('express');
var router = express.Router();
var fs = require('fs');
var io = require('socket.io')(http);
// var http = require('http').Server(app);
// var app     = express();

var MongoClient = require('mongodb');
var url = 'mongodb://127.0.0.1:27017/dpserver';
var mongoose   = require('mongoose');
var Slides = require('../models/slides.js');

mongoose.createConnection(url);

var slidesData = [
	{
		id : '1',
		title: "title",
		contentType : "image",
		content : "/images/poster1.png"
	},
	{
		id : '2',
		title: "title",
		contentType : "image",
		content : "/images/poster2.jpg"
	},
	{
		id : '3',
		title: "title",
		contentType : "text",
		content : "Stukje tekst!"
	},
	{
		id : '4',
		title: "iamcore",
		contentType : "image",
		content : "http://loisvanzomeren.nl/img/iamcore.png"
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



var reload = function () {
	io.emit('chat message', msg);
}

router.route('/')
	.get(function(req, res) {
		console.log("ja?");
		// addData();

		var query = Slides.find().sort({date: -1}).limit(1);

		query.exec(function(err, data){

			if (err){
								console.log(err);
						}

						console.log(data);
		});

		var data = {
			req: req,
			test: "test",
			slides: [
				{
					id : '1',
					title: "title",
					contentType : "image",
					content : "/images/poster1.png"
				},
				{
					id : '2',
					title: "title",
					contentType : "image",
					content : "/images/poster2.jpg"
				},
				{
					id : '3',
					title: "title",
					contentType : "text",
					content : "Stukje tekst!"
				},
				{
					id : '4',
					title: "iamcore",
					contentType : "image",
					content : "http://loisvanzomeren.nl/img/iamcore.png"
				}
			]
		};

		res.render('./slider.ejs', {data: data});
	});

	io.on('connection', function(socket){
	  console.log('a user connected');
	  socket.on('disconnect', function(){
	    console.log('user disconnected');
	  });
	});



module.exports = router;
