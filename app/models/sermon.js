var mongoose = require('mongoose');

var sermonSchema = mongoose.Schema({

	congregation: String,
	sermon_date: String,
	title: String,
	sermon: String,
	bulletin: String,
	life_group: String,
	ppt: String,
	created_tms: { type: Date, default: Date.now },
	updated_tms: { type: Date, default: Date.now },

});

module.exports = mongoose.model('Sermon', sermonSchema);
