var express = require('express');
var router = express.Router();
var fs = require('fs');
var MongoClient = require('mongodb');
var url 				= 'mongodb://127.0.0.1:27017/dpserverV2';
var mongoose   	= require('mongoose');
var path = require('path');
var Slides = require('../models/slides.js');
var Screens = require('../models/screens.js');
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
			var data = {
				title: "screens"
			}

      Screens.find({}, function(err, screenData) {
        if (!screenData[0]) {
          console.log("hoi");
          var screen = Screens();
          screen.sid = 0;
          screen.name = "TTH 01";
          screen.location = "1 verdieping oost";
          screen.slides = [0];
          screen.createdOn = new Date();
          screen.createdBy = "Leander";
          screen.image = "images/screen1.jpg";
          screen.save(function (err) {
            if(err) {console.error(err);};
          });
          var screen2 = Screens();
          screen2.sid = 1;
          screen2.name = "TTH 02";
          screen2.location = "1 verdieping west";
          screen2.slides = [0];
          screen2.createdOn = new Date();
          screen2.createdBy = "Leander";
          screen2.image = "images/screen2.jpg";
          screen2.save(function (err) {
            if(err) {console.error(err);};

            Screens.find({}, function(err, screenData) {
              data.screens = screenData;
              res.render("screens.ejs", {data: data});
            });
          });
        } else {
          data.screens = screenData;
          res.render("screens.ejs", {data: data});
        };
      });
		} else {
			res.redirect("/dps/login");
    }
	});

router.route('/edit/:sid')
  .get(function (req, res, next) {
    if (!req.session.username) { return res.redirect("/dps/login"); };

    var data = {
      req: req,
      screen: req.params.sid
    };

    Screens.findOne({sid: data.screen}, function(err, screen) {
      data.screen = screen;
        Slides.find({}, function (err, slides) {
          if (err){return console.error(err);}
          data.slides = slides;

          if (data.screen.slides) {
            Slides.find({sid: {$in:data.screen.slides}}, function (err,usedSlides) {
              if (err){return console.error(err);}
              data.usedSlides = usedSlides;
              res.render('./edit-screen', {data:data});
            });
          } else {
            res.render('./edit-screen', {data:data});
          }
        });

    });

    // res.render("edit-screen.ejs", {data: data});
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
					var newSlide = Slides();
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
					var query = Slides.find().sort({date: -1});
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

					res.redirect('/dps');
				}
			};
			createSlide.getNewId();

		} else {
			res.redirect('/dps/login');
		}
	});

router.route('/edit/:id/remove/:sid')
	.get(function(req, res, next) {
    if(!req.session.username) {
      return res.redirect('/dps/login');
    }

    var data = {
      screenId: req.params.id,
  		sid: req.params.sid
    };

		Screens.findOne({ sid: data.screenId }, function (err, screen) {
			if (err){ console.log(err); }

      data.screen = screen;

      var index = data.screen.slides.indexOf(data.sid);
      if (index > -1) {
        data.screen.slides.splice(index, 1);
      }

      Screens.update({sid: data.screenId}, {$set: {slides: data.screen.slides}}, function(err) {
        res.redirect('/dps/edit/' + data.screenId);
      });
		});
	});

router.route('/edit/:id/add/:sid')
	.get(function(req, res, next) {
    if(!req.session.username) {
      return res.redirect('/dps/login');
    }

    var data = {
      screenId: req.params.id,
  		sid: req.params.sid
    };

		Screens.findOne({ sid: data.screenId }, function (err, screen) {
			if (err){ console.log(err); }

      data.screen = screen;

      var index = data.screen.slides.indexOf(data.sid);
      if (index > -1) {
        console.log("Test");
        res.redirect('/dps/edit/' + data.screenId);
      } else {
        data.screen.slides.push(data.sid);
        Screens.update({sid: data.screenId}, {$set: {slides: data.screen.slides}}, function(err) {
          res.redirect('/dps/edit/' + data.screenId);
        });
      }
		});
	});

router.route('/edit/:id/delete/:sid')
	.get(function(req, res, next) {
    if(!req.session.username) {
      return res.redirect('/dps/login');
    }

    var screen = req.params.id;
		var getSid = req.params.sid;
		console.log(getSid);
		console.log('Deleted a slide and route to /slide');
		Slides.remove({ sid: getSid }, function (err) {
			if (err){
							console.log(err);
						}
			console.log( getSid + " removed!");
			res.redirect('/dps/edit/' + screen);
		});
	});




router.route('/login')
	.get(function(req, res, next) {
		if (req.session.username) {
			res.redirect("/dps/");
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
				res.redirect('/dps/');
			}
		}
		if (!req.session.username) {
			return res.redirect('/dps/login');
		}
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


module.exports = router;
