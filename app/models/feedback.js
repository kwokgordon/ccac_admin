var mongoose = require('mongoose');

var feedbackSchema = mongoose.Schema({

	name: String,
	title: String,
	message: String,
	created_tms: { type: Date, default: Date.now },

});

module.exports = mongoose.model('Feedback', feedbackSchema);
