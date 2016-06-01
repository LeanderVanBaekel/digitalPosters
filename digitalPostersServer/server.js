// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express     = require('express');        // call express
var app         = express();                 // define our app using express
var bodyParser  = require('body-parser');
var MongoClient = require('mongodb');
var mongoose = require('mongoose');
var path        = require('path');
http        = require('http').Server(app);
io          = require('socket.io')(http);


//make a connection with the database
MongoClient.MongoClient, format = require('util').format;
MongoClient.connect('mongodb://127.0.0.1:27017/dpserver', function (err, db) {
    if (err) {
        throw err;
    } else {
        console.log("successfully connected to the database");
    }
    db.close();
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

var port = process.env.PORT || 8080;        // set our port



// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

app.get('/', function(req, res){
    res.render('./index.ejs');
});

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});


// more routes for our API will happen here

var sliderRouter = require('./routes/slider');
app.use('/slider', sliderRouter);

var backendRouter = require('./routes/backend');
app.use('/backend', backendRouter);


// START THE SERVER
// =============================================================================
http.listen(port);

console.log('App running on localhost:' + port);
