var mongoose = require('mongoose');

var pageSchema = mongoose.Schema({
	
	path: String,
	google_calendar: String,
	eng: {
		lang_path: String,
		doc_id: String
	},
	cht: {
		lang_path: String,
		doc_id: String
	},
	chs: {
		lang_path: String,
		doc_id: String
	},
	created_tms: { type: Date, default: Date.now },
	updated_tms: { type: Date, default: Date.now },
	
});

module.exports = mongoose.model('Page', pageSchema);
