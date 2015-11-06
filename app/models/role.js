var mongoose = require('mongoose');

var roleSchema = mongoose.Schema({
	
	role: String,
	permissions: String,
	created_tms: { type: Date, default: Date.now },
	updated_tms: { type: Date, default: Date.now },
	
});

module.exports = mongoose.model('Role', roleSchema);
