// Mongoose Schema for adding a slides to MongoDB

var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var slides  = new Schema({
  sid: Number, // slide id
	title: String, // name of the slide for internal use
	contentType: String, // type of the content of the slide
	content: String, // Link or content of the slide
  status: Boolean, // Not used at the moment
  duration: Number, // length the slide is shown in seconds
  createdOn : Date, // date slide got created
  endsOn: Date, // Not used at the moment
  createdBy : String // Name of the creator
});

module.exports = mongoose.model('Slides', slides);
