angular.module('calendarDemoApp', [])

.factory('dataFactory', [function(){
	var dataFactory = {};

	//generates current date info to put into view at start
	dataFactory.currentDate = new Date();
	dataFactory.currentYear = dataFactory.currentDate.getFullYear();
	dataFactory.currentMonth = dataFactory.currentDate.getMonth();

	//generating range of years for view + and - 20 into future from current date
	var yearStart = dataFactory.currentYear - 20;
	var yearEnd = dataFactory.currentYear + 20;
	dataFactory.getYears = function range(start, stop, step){
  	var a=[start], b=start;
  	while(b<stop){b+=step;a.push(b)}
  	return a;
	};
	dataFactory.years = dataFactory.getYears(yearStart, yearEnd, 1);
	//dataFactory.months = [{number:00,name: 'January'},{number:01,name: 'February'},{number:02,name: 'March'},{number:03,name: 'April'},{number:04,name: 'May'},{number:05,name: 'June'},{number:06,name: 'July'},{number:07,name: 'August'},{number:08,name: 'September'},{number:09,name: 'October'},{number:10,name: 'November'},{number:11,name: 'December'}]
	dataFactory.months = [0,1,2,3,4,5,6,7,8,9,10,11];


	//these variables are put through the function - they should be attached in the nav directive
	dataFactory.year = null;
	dataFactory.month = null;

	//calculates RANGES with javascript file
	dataFactory.newDate = new Date(dataFactory.year, dataFactory.month);
	dataFactory.range = CalendarRange.getMonthlyRange(dataFactory.newDate);

	//sets new year and month
	dataFactory.updateDate = function(year,month){
		dataFactory.year = year;
		dataFactory.month = month;
		dataFactory.newDate = new Date(dataFactory.year, dataFactory.month)
		console.log('factory updates year to:' + dataFactory.year)
		console.log('factory updates month to:' + dataFactory.month)
	}

	dataFactory.getRange = function(){
/*		dataFactory.newDate = new Date(dataFactory.year, dataFactory.month);
		dataFactory.range = CalendarRange.getMonthlyRange(dataFactory.newDate);*/
		dataFactory.range = CalendarRange.getMonthlyRange(dataFactory.newDate);
		console.log('is the range changing?')
		console.log(dataFactory.range);
	}

	//determines which days are to be colored differently
	dataFactory.askIncluded = function (days){
		for (day in days) {
			if (days[day].month === dataFactory.newDate.getMonth()) {
  			days[day].included = 'included';
  		} else {
  			days[day].included = 'excluded';
  		}
  	}
  };

	return dataFactory;

}])



.directive('dateNav', ['dataFactory', function(dataFactory){
	return {
		restrict: 'E',
		templateUrl: 'date-nav.html',
		scope: true,
		link: function(scope, element, attrs) {
			
			//set variables
			scope.months = dataFactory.months;
			scope.years = dataFactory.years;
			scope.month = dataFactory.currentMonth;
			scope.year = dataFactory.currentYear;
			dataFactory.year = scope.year;
			dataFactory.month = scope.month;
			dataFactory.getRange();

			scope.updateYear = function(){
				dataFactory.updateDate(scope.year, scope.month);
				dataFactory.year = scope.year;
			}

			scope.updateMonth = function(){
				dataFactory.updateDate(scope.year, scope.month);
				dataFactory.month = scope.month;
				console.log("scope month" + scope.month)
				console.log("datafactory month" + dataFactory.month)
			}
				
		}
	}
}])

.directive('calendar', ['dataFactory', function(dataFactory){
	return {
			restrict: 'E',
			templateUrl: 'calendar-one.html',
			scope: true,
			link: function(scope, element, attrs) {
				scope.days = dataFactory.range.days;
				dataFactory.askIncluded(scope.days);
				console.log(dataFactory.month)

				scope.$watch(function(){return dataFactory.year}, function() {
					console.log("WATCHING YEAR")
      		dataFactory.getRange();
      		scope.days = dataFactory.range.days;
      		dataFactory.askIncluded(scope.days);
        });

        scope.$watch(function(){return dataFactory.month}, function() {
					console.log("WATCHING MONTH")
      		dataFactory.getRange();
      		scope.days = dataFactory.range.days;
      		dataFactory.askIncluded(scope.days);
        });


				}


			}
}])




/*
.controller('myController', ['dataFactory', function(dataFactory){
	var mc = this;
	// SET THE DATA IN THE !!!!DIRECTIVE TO THE START DATE OF TODAY
	mc.days = dataFactory.range.days;
	dataFactory.askIncluded(mc.days);

}]);
*/
