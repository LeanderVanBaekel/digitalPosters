var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var slides  = new Schema({
  sid: Number,
	title: String,
	contentType: String,
	content: String,
  status: Boolean, // true = active
  duration: Number,
  createdOn : Date,
  endsOn: Date,
  createdBy : String

});

module.exports = mongoose.model('Slides', slides);
