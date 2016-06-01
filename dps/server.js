var express     = require('express');
var bodyParser  = require('body-parser');
var MongoClient = require('mongodb');
var mongoose    = require('mongoose');
var path        = require('path');
var app         = express();

    http        = require('http').Server(app);

mongoose.connect('mongodb://127.0.0.1:27017/dpserver');

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

app.get('/', function(req, res){
    res.send("test");
});

var sliderRouter = require('./routes/slider');
app.use('/slider', sliderRouter);

var backendRouter = require('./routes/backend');
app.use('/backend', backendRouter);

var port = process.env.PORT || 8080;        // set our port

// app.listen(port);
http.listen(port);
console.log('App running on localhost:' + port);
