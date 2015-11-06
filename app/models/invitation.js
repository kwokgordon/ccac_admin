var mongoose = require('mongoose');

var invitationSchema = mongoose.Schema({
	
	email: String,
	role: String,
	permissions: [String]
});

module.exports = mongoose.model('Invitation', invitationSchema);
