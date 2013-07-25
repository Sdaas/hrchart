
var staticData = [
		{ 
			"label" : "May 2013",  
			"id" : "201305",
			"activity" : [
				{	
					"id" : "201305082315",
					"mmdd" : "05/08", "duration" : 40, "maxhr" : 150  
				},
				{	
					"id" : "201305121815",
					"mmdd" : "05/12", "duration" : 41, "maxhr" : 165
				},
				{	
					"id" : "201305150945",
					"mmdd" : "05/15", "duration" : 27, "maxhr" : 170 
				},
				{	
					"id" : "201305181904",
					"mmdd" : "05/18", "duration" : 31, "maxhr" : 175
				}
			]
		},
		{ 
			"label" : "July 2013",  
			"id" : "201307",
			"activity" : [
				{	
					"id" : "201307231800",
					"mmdd" : "07/23", "duration" : 35, "maxhr" : 145
				},
				{	
					"id" : "201307201900",
					"mmdd" : "07/20", "duration" : 40, "maxhr" : 165
				}
			]
		},
		{ 
			"label" : "June 2013",  
			"id" : "201306",
			"activity" : [
				{	
					"id" : "201306061000",
					"mmdd" : "06/06", "duration" : 45, "maxhr" : 166 
				},
				{	
					"id" : "201306150900",
					"mmdd" : "06/15", "duration" : 30, "maxhr" : 170
				}
			]
		}
	];

// Declare Underscore itself as a module
var underscore = angular.module('underscore', []);
underscore.factory('_', function() {
  return window._; // assumes underscore has already been loaded on the page
});

var app = angular.module('MyApp', ['underscore']);

// Enhance the meta data for each activity
var enhance  = function( activityList ){
	console.log("Enhancing activities ...");
	_.each(activityList, function(activity){ 

		var d = Date.parse(activity.timestamp);

		// Enhance the activity Summary to include yyyy, mmm, mmdd etc etc.
		activity.mmdd = d.toString("MM/dd");
		activity.yyyy = d.toString("yyyy");
		activity.mmm = d.toString("MMM");
	});
}

// Organize the activities into display Groups
var organize = function( activityList ){

	console.log("Organizing activities ...");

	var displayGroup = [];
	_.each(activityList, function(activity){ 

		var d = Date.parse(activity.timestamp);

		// Identify the display group, and get a reference to it. Create the displayGroup
		// if it does not exist
		var dgid = d.toString("yyyyMM");
		var targetDisplayGroup = _.find( displayGroup, function(x) { return x.id == dgid; });
		if( targetDisplayGroup == undefined ){
			//console.log("Adding DisplayGroup " + dgid );

			// Create a new DisplayGroup
			var dg = {};
			dg.id = dgid;
			dg.label = d.toString("MMMM yyyy");
			dg.activity = [];

			// Add this display Group to the list
			displayGroup.push(dg);
			targetDisplayGroup = dg;
		}

		// Add the current activity to this DG
		targetDisplayGroup.activity.push(activity); 
	});

	return displayGroup;
}

app.controller('MyController', function($scope, $http, _ ){

	console.log("MyController called...");

	// These are all the data structures that we will need in our current scope
	$scope.activityLoaded = false;
	$scope.displayGroup = [];
	$scope.currentActivity = {};
	$scope.series = [ { color: "#0088CC", data: [ [0,0], [100,90], [200,100]] }];  // some dummy data
	
	// get the activity list from the app server
	$http.get('/activity').success( function(activityList){

		// Organize the data in a manner suitable for display
		enhance(activityList);
		$scope.displayGroup = organize(activityList);
	});
	// TODO Add error handling
	

	// handling when the user clicks on an activity. Not that we are just defining
	// the function here, not calling it ....
	$scope.activitySelected = function(dgId, activityId) {
		console.log("dgid = " + dgId + ", Activity " + activityId + " selected");
		var dg = _.find( $scope.displayGroup, function(dg) { return dg.id == dgId; });
		if( dg == undefined ){
			console.log("error : did not find dg " + dgId);
			return;
		}
		var activity = _.find( dg.activity, function(x) { return x.id == activityId; });
		if( activity == undefined ){
			console.log("error: did not find activity " + activityId);
		}

		// mark this as a the selected or current activity	
		$scope.currentActivity = activity;


		// Check if the current activity has hr data. if not get it from the app server
		if( activity.hr == undefined ){

			// mark is as not loaded - the ui may be able to use this to display a "spinner"
			$scope.activityLoaded = false;
			console.log('getting Details for activity ' + activityId );


			$http.get("/activity/" + activityId).success( function(result){
				// TODO error handling
				$scope.currentActivity.hr = result.hr;

				// use the current hr data with this activity
				// TODO Refactor this 
				$scope.series = [ { color: "#0088CC", data: $scope.currentActivity.hr }];
				$scope.activityLoaded = true;						
			});
		}
		else {
			// use the current hr data with this activity
			// TODO Refactor this
			$scope.series = [ { color: "#0088CC", data: $scope.currentActivity.hr }];
			$scope.activityLoaded = true;
		}

	}

	$scope.activityLoaded = true;
})
