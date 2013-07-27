
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');

var pwx = require('./pwx.js');


var app = express();

// all environments
app.set('port', process.env.PORT || 8000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());

var logformat = '[:date]: :remote-addr :req[X-Forwarded-For] :method :url HTTP/:http-version :status - :response-time ms'; 

app.use(express.logger(logformat));   // See http://www.senchalabs.org/connect/middleware-logger.html
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// Application specific configs
app.set('data folder', process.env.DATAFOLDER || 'foo');  // App server will look here for .PWX files
app.set('watch folder', process.env.WATCHFOLDER || "foo") // Original Source of the .PWX files

// Debug prints
console.log("Data Folder: " + app.get("data folder"));
console.log("Watch Folder: " + app.get("watch folder"));

// Load all the PWX files from the "data" directory
pwx.loadAllFiles( app.get('data folder'));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// Get list of all the activities ...
app.get('/activity', function(req, res){
	res.set('Content-Type', 'application/json');
	var activities = pwx.activities();
	res.json(activities);
});

// Get the details for the specified activity ...
app.get('/activity/:activityId', function(req, res){
	activityId = req.params.activityId;
	console.log("target Activity = " + activityId);
	activity = pwx.activityDetails(activityId);
	res.json(activity);
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

// This stuff is specific to the way I get .PWX files on my computer
// The idea is to monitor my dropbox folder for new .PWX files, copy the
// new files into the data directory and tell the app to update itself
pwx.watch( app.get("watch folder"), app.get("data folder"));

