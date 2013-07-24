
var app = angular.module('MyApp', []);


app.controller('MyController', function($scope ){

	$scope.displayGroup = [
		{ 
			"label" : "May 2013",  
			"id" : "201305",
			"activity" : [
				{	"summary" : { "mmdd" : "05/08", "duration" : 40 } },
				{	"summary" : { "mmdd" : "05/12", "duration" : 41 } },
				{	"summary" : { "mmdd" : "05/15", "duration" : 27 } },
				{	"summary" : { "mmdd" : "05/18", "duration" : 31 } },
				{	"summary" : { "mmdd" : "05/27", "duration" : 45 } }
			]
		},
		{ 
			"label" : "July 2013",  
			"id" : "201307",
			"activity" : [
				{	"summary" : { "mmdd" : "07/23", "duration" : 35 } },
				{	"summary" : { "mmdd" : "07/20", "duration" : 40 } },
				{	"summary" : { "mmdd" : "07/18", "duration" : 34 } },
				{	"summary" : { "mmdd" : "07/15", "duration" : 38 } },
				{	"summary" : { "mmdd" : "07/13", "duration" : 42 } }
			]
		},
		{ 
			"label" : "June 2013",  
			"id" : "201306",
			"activity" : [
				{	"summary" : { "mmdd" : "06/06", "duration" : 45 } },
				{	"summary" : { "mmdd" : "06/15", "duration" : 30 } }
			]
		}
	]

})