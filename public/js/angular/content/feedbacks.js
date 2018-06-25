var ccac = angular.module('ccacAdminApp', ['ui.bootstrap']);

ccac.controller('FeedbacksController', function ($scope, $http, $modal, $log) {

	$scope.init = function() {
		$scope.getFeedbacks();
	};

	$scope.getFeedbacks = function() {
		$http.get('/api/feedbacks/getFeedbacks')
			.success(function(data) {
				$log.info(data);
				$scope.feedbacks = data;
			})
			.error(function(data) {
				$log.info("Error: " + data);
			});
	};

})

