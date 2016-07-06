var express     = require('express');
var bodyParser  = require('body-parser');
var MongoClient = require('mongodb');
var mongoose    = require('mongoose');
var path        = require('path');
var app         = express();
    http        = require('http').Server(app);
var multer  = require('multer');
var session = require('express-session');
var FileStore = require('session-file-store')(session);

mongoose.connect('mongodb://127.0.0.1:27017/dpserverV2');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("we're connected!");
});


// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(function(req, res, next) {
    //make sure that people can get and post data by allowing cross origin
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});
app.use(express.static(__dirname + '/public'));


app.use(session({
  secret: 'heeel moeilijk wachtwoord', // CHANGE THIS!!!
  //store: new FileStore(),
  saveUninitialized: true,
  resave: false
}));

app.use(bodyParser.urlencoded({extended: true}));

app.use(multer({dest:'./uploads/'}).single('fileToUpload'));

// get url id to add screen data and slideshow

app.get('/', function(req, res, next){
  if (req.session.username) {
    res.redirect("/dps");
  } else {
		res.redirect("/dps/login");
	}
});

// var sliderRouter = require('./routes/slider');
// app.use('/slider', sliderRouter);

var dpfRouter = require('./routes/digitalPosterFrame');
app.use('/dpf', dpfRouter);

var dpsRouter = require('./newRoutes/digitalPrintShop');
app.use('/dps', dpsRouter);

// var screensRouter = require('./newRoutes/dpsScreens');
// app.use('/dps/screens', screensRouter);
//
// var dpsSlideshowsRouter = require('./newRoutes/dpsSlideshows');
// app.use('/dps/slideshows', dpsSlideshowsRouter);

var port = process.env.PORT || 8080;        // set our port

// app.listen(port);
http.listen(port);
console.log('App running on localhost:' + port);
