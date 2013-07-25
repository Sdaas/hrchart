
// A custom directive
app.directive('chart', function(){

    return{
        restrict: 'A',  
        link: function(scope, elem, attrs) {
        	
        	var chart = null;
			var options = { 
				series: {
					lines: { show: true, fill: true,  },
					points: { show: false }
				},
				yaxis: { 
					min: 80, 
					max: 190, 
					ticksize: 20 
				},
				xaxis: {
					min: 0,
					max: 2700,
					ticks : [0,300,600,900,1200,1500,1800,2100,2400]
				}
			};

        	scope.$watch('series', function(v){      
				console.log("activityLoaded = " + scope.activityLoaded );
    			if( scope.activityLoaded == true ) {
    				console.log("creating chart");
    				$.plot(elem, v , options);
    			}
        	});
        }
    };
});