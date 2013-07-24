
// Declare Underscore itself as a module
var underscore = angular.module('underscore', []);
underscore.factory('_', function() {
  return window._; // assumes underscore has already been loaded on the page
});

var app = angular.module('MyApp', ['underscore']);


app.controller('MyController', function($scope, $http, _ ){

	$scope.displayGroup = [
		{ 
			"label" : "May 2013",  
			"id" : "201305",
			"activity" : [
				{	
					"id" : "201305082315",
					"summary" : { "mmdd" : "05/08", "duration" : 40, "maxhr" : 150 } 
				},
				{	
					"id" : "201305121815",
					"summary" : { "mmdd" : "05/12", "duration" : 41, "maxhr" : 165 } 
				},
				{	
					"id" : "201305150945",
					"summary" : { "mmdd" : "05/15", "duration" : 27, "maxhr" : 170 } 
				},
				{	
					"id" : "201305181904",
					"summary" : { "mmdd" : "05/18", "duration" : 31, "maxhr" : 175 } 
				}
			]
		},
		{ 
			"label" : "July 2013",  
			"id" : "201307",
			"activity" : [
				{	
					"id" : "201307231800",
					"summary" : { "mmdd" : "07/23", "duration" : 35, "maxhr" : 145 } 
				},
				{	
					"id" : "201307201900",
					"summary" : { "mmdd" : "07/20", "duration" : 40, "maxhr" : 165 } 
				}
			]
		},
		{ 
			"label" : "June 2013",  
			"id" : "201306",
			"activity" : [
				{	
					"id" : "201306061000",
					"summary" : { "mmdd" : "06/06", "duration" : 45, "maxhr" : 166 } 
				},
				{	
					"id" : "201306150900",
					"summary" : { "mmdd" : "06/15", "duration" : 30, "maxhr" : 170 } 
				}
			]
		}
	]

	// handling when the user clicks on an activity 
	$scope.activitySelected = function(dgId, activityId) {
		console.log("dgid = " + dgId + ", Activity " + activityId + " selected");
		var dg = _.find( $scope.displayGroup, function(dg) { return dg.id == dgId; });
		if( dg != undefined ) console.log("found dg");
		
		var activity = _.find( dg.activity, function(x) { return x.id == activityId; });
		if( activity != undefined ) console.log("found activity");

		// mark this as a the selected or current activity	
		$scope.currentActivity = activity;
	}
})