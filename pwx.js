//
// Loads all the heart rate data from .PWX files
//
var fs = require('fs');
var und  = require('underscore');
var xml2js = require('xml2js');
var sleep = require('sleep');     // Only to Simulate delay :)
var watch = require('nodewatch'); // To monitor files in my dropbox
var fsx = require('fs-extra');			  // To copy files from my dropbox to the data folder
var path = require('path');

require('datejs');

// The global array in which to story all activities
var activity = [];

// create 10 second bins, and find the max hr in each bin
var createBinsAndAggregate = function( samples ) {

	var aggregated = [];
	for( var i=0; i< samples.length ; i++ ){

		// bin calculation. We are going to create 10 second bins
		var dt = parseFloat(samples[i].timeoffset);
		var bin = parseInt(dt/10,10);
		var x = aggregated[bin];
		if( x == undefined ) {
			// add a new bin
			x = [];
		}
		
		// add this hr data to an existing bin
		x.push( parseFloat(samples[i].hr) );
		aggregated[bin] = x;
	}

 	 // find the max in each bin 	
     var hr = [];
	for( var i=0; i<aggregated.length; i++) {
		var max = und.max( aggregated[i]);
		hr.push( [ i*10, max ]);
	}
	//console.log( hr.length + " samples");
	return hr;
}

var createActivityFromJson = function( json ){

	var workout = json.pwx.workout[0];
	var activity = {};

	// The summary data for the activity
	activity.id = Date.parse(workout.time[0]).toString("yyyyMMddhhmmss");   // Activity Id
	activity.timestamp = Date.parse(workout.time[0]).toString("dd MMM yyyy, hh:mm:ss")
    duration = parseInt(workout.summarydata[0].duration,10)/60;   // Number in Minutes
	activity.duration = duration.toFixed(0); // 
    activity.maxhr = parseFloat(workout.summarydata[0].hr[0].$.max);
    activity.hr = createBinsAndAggregate( workout.sample );
	console.log("Finished processing activity " + activity.id);

	return activity;
}

var processPWXFile = function( pathToFile ){
	//console.log("Processing " + pathToFile);
	fs.readFile(pathToFile, function(err, data){
		if( err ){
			console.log("Error reading " + pathToFile );
			console.log(err);
			return;
		}
		
		// convert this XML to JSON
		xml2js.parseString( data.toString(), function(err,json){
			if( err ){
				console.log("Error reading " + pathToFile );
				console.log(err);
				return;
			}

			// process the JSON to get an activity, and add it to the global list
			var a = createActivityFromJson(json);
			activity.push(a);
		});
	})
}

var loadAllFiles = function( path ){

	// get list of all files (including directories) in current path
	files = fs.readdirSync(path);
	//TODO Check if a file is a directory or symlink before processing it

	// filter out all .pwx files
	pwxFiles =  und.filter(files, function(str) { return str.match(/.*\.pwx$/i); });

	// process each file
	und.each(pwxFiles, function(f){
		processPWXFile( path + "/" + f);
	});

}

// returns the summary of all activities
var activities = function(){
	console.log("activities() called ...")
	// send the summary of the activity.

	var retval = [];
	und.each(activity, function(record){

		var x = {};
		x.id = record.id;
		x.timestamp = record.timestamp;
		x.duration = record.duration;
		x.maxhr = record.maxhr;
		// Do Not copy the hr[] array

		retval.push(x);
	})

	return retval;
}



var activityDetails = function(activityId){
  console.log("ActivityDetails called. Target = " + activityId);

  //sleep.sleep(1); // Sleep for so many milliseconds. Simulate a slow network :)

  retval = und.find(activity, function(record){ return record.id == activityId});
  return retval;
}

// Watch this folder ( recursiely ) for PWX files. When a new PWX file appears, 
// copy it to the data folder and refresh the app
var watchFolder = function( pathToWatch, destination){
	watch.add(pathToWatch, true).onChange(function(file,prev,curr,action){
		if( action == "new") {
			// if this is a PWX file, copy it to the .data folder and load it up.
			if( file.match(/.*\.pwx$/i)){
			console.log("*** New file created : " + file );
			// wait for 5 seconds and copy the file ...
				setTimeout(function(){
					
					base = path.basename(file);
					dest = destination + "/" + base;
					console.log("Copying "  + file + " to " + dest );
					fsx.copy(file, dest, function (err) {
	  					if (err) {
	    					throw err;
	  					}
	  					console.log("done");
	  					processPWXFile(dest);
					});

				}, 5000)
			}
			
		}
 	});
}

//
// External Interfaces
//
exports.loadAllFiles = loadAllFiles;
exports.activities = activities;
exports.activityDetails = activityDetails;
exports.watch = watchFolder;
