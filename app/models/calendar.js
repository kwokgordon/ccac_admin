var mongoose = require('mongoose');

var calendarSchema = mongoose.Schema({
	
	type: String,
	congregation: String,
	tag: String,
	name: String,
	email: String,
	color: String,
	created_tms: { type: Date, default: Date.now },
	updated_tms: { type: Date, default: Date.now },
	
});

module.exports = mongoose.model('Calendar', calendarSchema);
