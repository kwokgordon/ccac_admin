var path = require('path');
var shared = require(path.join(__basedir, 'app/controllers/shared_functions'));

var Calendar = require(path.join(__basedir, 'app/models/calendar'));

/////////////////////////////////////////////////////////////////////////////
// routing - calendars api

module.exports = function(app, passport) {

	app.namespace('/api/calendars', shared.isLoggedIn, function() {
		
		// Calendars API - to get all the google calendars in the database
		app.get('/getCalendars', shared.checkPermission(["calendars"]), function(req, res) {
			
			Calendar.find({}, {}, {sort: {type:1, congregation:1, name:1}}, function(err, calendars) {
				if (err)
					res.send(err);
				
				res.json(calendars);
			});
		});

		// Calendars API - add / edit a calendar
		app.post('/updateCalendar', shared.checkPermission(["calendars"]), function(req, res) {

			var add_calendar = req.body.calendar;

			Calendar.findOne({_id: add_calendar.id}, function(err, calendar) {
				if (err)
					res.send(err);
				
				if (calendar) {
/*					
					for(var attr in add_calendar) {
						console.log(attr);
						calendar[attr] = add_calendar[attr];
					}
*/					
					calendar.type = add_calendar.type;
					calendar.congregation = add_calendar.congregation;
					calendar.tag = add_calendar.tag;
					calendar.name = add_calendar.name;
					calendar.email = add_calendar.email;
					calendar.color = add_calendar.color;
					calendar.updated_tms = Date.now();

					calendar.save();
					
					res.json(calendar);
				} else {
					Calendar.create({
						type: add_calendar.type,
						congregation: add_calendar.congregation,
						tag: add_calendar.tag,
						name: add_calendar.name,
						email: add_calendar.email,
						color: add_calendar.color
					}, function(err, calendar) {
						if (err)
							res.send(err)
							
						res.json(calendar);
					});
				}
			});
		});

		// Calendars API - delete a calendar
		app.post('/deleteCalendar', shared.checkPermission(["calendars"]), function(req, res) {
			
			var delete_calendar = req.body.calendar;

			Calendar.findOne({_id: delete_calendar.id}, function(err, calendar) {
				if (err)
					res.send(err);
				
				calendar.remove(function(err, msg) {
					if (err) 
						res.send(err);
						
					res.json(msg);
				});
			});
		
		});
	});

}

