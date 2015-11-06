var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
	
	google: {
		id: String,
		token: String,
		email: String,
		name: String,
		photo: String
	},
	role: { type: String, default: "user" },
	permissions: [String],
	created_tms: { type: Date, default: Date.now },
	updated_tms: { type: Date, default: Date.now },

});

module.exports = mongoose.model('User', userSchema);
