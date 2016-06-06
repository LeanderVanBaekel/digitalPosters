var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var slideShows  = new Schema({
  id: Number,
	title: String,
	slides: [],
  screens: [], // true = active
  createdOn : Date,
  createdBy : String

});

module.exports = mongoose.model('SlideShows', slideShows);
