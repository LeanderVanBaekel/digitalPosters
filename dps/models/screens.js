var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var screens  = new Schema({
  sid: Number,
	name: String,
	location: String,
  slideshow: Number,
  createdOn : Date,
  createdBy : String

});

module.exports = mongoose.model('Screens', screens);
