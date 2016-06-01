var express = require('express');
var router = express.Router();
var fs = require('fs');


router.route('/')
	.get(function(req, res) {
		var data = {
			req: req,
			test: "test"
		};

		res.render('./backend', {data: data});
	});

	router.route('/Slides')
		.get(function(req, res) {
			var data = {
				req: req,
				test: "test"
			};

			res.render('./slides', {data: data});
		});




module.exports = router;
