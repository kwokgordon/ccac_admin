var mongoose = require('mongoose');

var invitationSchema = mongoose.Schema({
	
	email: String,
	role: { type: String, default: "user" },
	permissions: [String],
	created_tms: { type: Date, default: Date.now },
	updated_tms: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Invitation', invitationSchema);
