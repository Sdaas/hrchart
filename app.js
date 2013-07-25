
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

// Load all the PWX files from the "data" directory
pwx.loadAllFiles('data');

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// Get list of all the activities
app.get('/activity', function(req, res){

	res.set('Content-Type', 'application/json');
	var activities = pwx.activities();
	res.json(activities);
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
