var ccac = angular.module('ccacAdminApp', ['ui.bootstrap']);

ccac.controller('CalendarsController', function ($scope, $http, $modal, $log) {

	$scope.calendars= [];

	$scope.formData = {};

	$scope.init = function() {
		$scope.getCalendars();
	};
	
	$scope.getCalendars = function() {

		$http.get('/api/calendars/getCalendars')
			.success(function(data) {
				$log.info(data);
				$scope.calendars= data;
			})
			.error(function(data) {
				$log.info("Error: " + data);
			});
	};

})

