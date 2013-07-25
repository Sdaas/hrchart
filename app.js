
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
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// The folder where all the .PWX files are kept
app.set('pwx file path','data');

// Load all the PWX files from the "data" directory
pwx.loadAllFiles( app.get('pwx file path'));


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
pwx.watch("/Users/sdaas/temp", "./data");

