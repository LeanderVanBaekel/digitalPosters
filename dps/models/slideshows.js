var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var slideShows  = new Schema({
  sid: Number,
	name: String,
	slides: [],
  screens: [],
  createdOn : Date,
  createdBy : String

});

module.exports = mongoose.model('SlideShows', slideShows);
