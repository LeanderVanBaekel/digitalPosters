// Mongoose Schema for adding a screen to MongoDB

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var screens  = new Schema({
  sid: Number, // screen id
	name: String, // screen name
	location: String, // location of the screen
  slideshow: Number, // slideshow id connected to the screen
  createdOn : Date, // date of creation of the screen
  createdBy : String // name of the creator

});

module.exports = mongoose.model('Screens', screens);
