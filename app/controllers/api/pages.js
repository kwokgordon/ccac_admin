var path = require('path');
var shared = require(path.join(__basedir, 'app/controllers/shared_functions'));

var Page = require(path.join(__basedir, 'app/models/page'));

/////////////////////////////////////////////////////////////////////////////
// routing - pages api

module.exports = function(app, passport) {

	app.namespace('/api/pages', shared.isLoggedIn, function() {
		
		// Pages API - to get all the google doc pages in the database
		app.get('/getPages', shared.checkPermission(["pages_admin","pages_edit"]), function(req, res) {
			
			Page.find({}, {}, {sort: {path:1}}, function(err, pages) {
				if (err)
					res.send(err);
				
				res.json(pages);
			});
		});

		// Pages API - add / edit a page
		app.post('/updatePage', shared.checkPermission(["pages_admin"]), function(req, res) {
			
			var add_page = req.body.page;
			var path = "";

			if (add_page.old_path == undefined) {
				path = add_page.path;
			} else {
				path = add_page.old_path;
			}
			
			Page.findOne({path: path}, function(err, page) {
				if (err)
					res.send(err);
				
				if (page) {
					page.path = add_page.path;
					page.google_calendar = add_page.google_calendar;
					page.eng.lang_path = add_page.eng.lang_path;
					page.eng.doc_id = add_page.eng.doc_id;
					page.cht.lang_path = add_page.cht.lang_path;
					page.cht.doc_id = add_page.cht.doc_id;
					page.chs.lang_path = add_page.chs.lang_path;
					page.chs.doc_id = add_page.chs.doc_id;
					page.updated_tms = Date.now();
					
					page.save();
					
					res.json(page);
				} else {
					Page.create({
						path: add_page.path,
						google_calendar: add_page.google_calendar,
						eng: {
							lang_path: add_page.eng.lang_path,
							doc_id: add_page.eng.doc_id
						},
						cht: {
							lang_path: add_page.cht.lang_path,
							doc_id: add_page.cht.doc_id
						},
						chs: {
							lang_path: add_page.chs.lang_path,
							doc_id: add_page.chs.doc_id
						}
					}, function(err, page) {
						if (err)
							res.send(err)
							
						res.json(page);
					});
				}
			});
			
		});

		// Pages API - delete a page
		app.post('/deletePage', shared.checkPermission(["pages_admin"]), function(req, res) {
			
			var delete_page = req.body.page;

			Page.findOne({path: delete_page.path}, function(err, page) {
				if (err)
					res.send(err);
				
				page.remove(function(err, msg) {
					if (err) 
						res.send(err);
						
					res.json(msg);
				});
			});
			
		});
		
	});

}

