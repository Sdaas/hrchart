
var app = angular.module('MyApp', []);


app.controller('MyController', function($scope ){

	$scope.displayGroup = [
		{ "label" : "May 2013",  "id" : "201305"},
		{ "label" : "July 2013",  "id" : "201307"},
		{ "label" : "June 2013",  "id" : "201306"}
	]
	
})