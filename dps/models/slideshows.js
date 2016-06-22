// Mongoose Schema for adding a slideshow to MongoDB

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var slideShows  = new Schema({
  sid: Number,         // slideshow id
	name: String,        // Name of the slideshow for internal use
	slides: [],          // slides id array
  screens: [],         // Not used at the moment
  createdOn : Date,    // Date slideshow got created on
  createdBy : String   // Name of the creator

});

module.exports = mongoose.model('SlideShows', slideShows);
