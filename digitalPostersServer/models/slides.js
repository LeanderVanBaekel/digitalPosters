var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var slides  = new Schema({
  id: Number,
	title: String,
	contentType: String,
	content: String,
  status: Boolean, // true = active
  createdOn : Date

});

module.exports = mongoose.model('Slides', slides);
