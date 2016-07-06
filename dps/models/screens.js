// Mongoose Schema for adding a screen to MongoDB

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var screens  = new Schema({
  sid: Number, // screen id
	name: String, // screen name
	location: String, // location of the screen
  slides: [], // slideshow id connected to the screen
  createdOn : Date, // date of creation of the screen
  createdBy : String, // name of the creator
  image: String
});

module.exports = mongoose.model('Screens', screens);
