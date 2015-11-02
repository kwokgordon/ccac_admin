var ccac = angular.module('ccacAdminApp', ['ui.bootstrap']);

ccac.controller('PagesController', function ($scope, $http, $modal, $log) {

	$scope.pages= [];

	$scope.pages_admin = false;
	$scope.pages_edit = false;
	
	$scope.formData = {};

	$scope.init = function() {
		$scope.getPages();
		
		if ($scope.role == "admin") {
			$scope.pages_admin = true;
			$scope.pages_edit = true;
		}
		
		if ($scope.permissions.indexOf("pages_admin") != -1)
			$scope.pages_admin = true;
			
		if ($scope.permissions.indexOf("pages_edit") != -1)
			$scope.pages_edit = true;

	};
	
	$scope.getPages = function() {

		$http.get('/api/getPages')
			.success(function(data) {
				$log.info(data);
				$scope.pages= data;
			})
			.error(function(data) {
				$log.info("Error: " + data);
			});
	};

	$scope.addPage = function() {

		var addPageModalInstance = $modal.open({
			templateUrl: '/ng-template/content/pages/pageModal.html',
			controller: 'AddPageModalController',
			resolve: {
				modal: function() {
					return "add";
				}
			}
		});
		
		addPageModalInstance.result.then(function(page) {
		
			if (page.path != "" && page.path != undefined) {
				$http.post('/api/updatePage', {page: page})
					.success(function(data) {
						$log.info(data);
						
						$scope.getPages();
					})
					.error(function(data) {
						$log.info("Error: " + data);
					});
			}
		});
	}

	$scope.editPage = function(page) {

		var editPageModalInstance = $modal.open({
			templateUrl: '/ng-template/content/pages/pageModal.html',
			controller: 'EditPageModalController',
			resolve: {
				page: function() {
					return page;
				},
				modal: function() {
					return "edit";
				}
			}
		});
		
		editPageModalInstance.result.then(function(page) {
		
			if (page.path != "" && page.path != undefined) {
				$http.post('/api/updatePage', {page: page})
					.success(function(data) {
						$log.info(data);
						
						$scope.getPages();
					})
					.error(function(data) {
						$log.info("Error: " + data);
					});
			}
		});
	}

	$scope.deletePage = function(page) {

		var deletePageModalInstance = $modal.open({
			templateUrl: '/ng-template/content/pages/deletePageModal.html',
			controller: 'DeletePageModalController',
			resolve: {
				page: function() {
					return page;
				}
			}
		});
		
		deletePageModalInstance.result.then(function(page) {
	
			$http.post('/api/deletePage', {page: page})
				.success(function(data) {
					$log.info(data);
					
					$scope.getPages();
				})
				.error(function(data) {
					$log.info("Error: " + data);
				});
		});
	}

})

ccac.controller('AddPageModalController', function($scope, $modalInstance, modal) {

	$scope.modal = modal;
	$scope.page = {};
	$scope.page.eng = {};
	$scope.page.cht = {};
	$scope.page.chs = {};
	
	$scope.page.path = "/";
	$scope.page.eng.lang_path = "/eng/";
	$scope.page.cht.lang_path = "/cht/";
	$scope.page.chs.lang_path = "/chs/";
	
	$scope.update_lang_path = function() {
		$scope.page.eng.lang_path = "/eng" + $scope.page.path;
		$scope.page.cht.lang_path = "/cht" + $scope.page.path;
		$scope.page.chs.lang_path = "/chs" + $scope.page.path;
	};
	
	$scope.add = function() {
		$modalInstance.close($scope.page);
	};

	$scope.cancel = function() {
		$modalInstance.dismiss('cancel');
	};
});

ccac.controller('EditPageModalController', function($scope, $modalInstance, page, modal) {

	$scope.modal = modal;
	$scope.page = page;
	$scope.page.old_path = page.path;
		
	$scope.update_lang_path = function() {
		$scope.page.eng.lang_path = "/eng" + $scope.page.path;
		$scope.page.cht.lang_path = "/cht" + $scope.page.path;
		$scope.page.chs.lang_path = "/chs" + $scope.page.path;
	};
	
	$scope.edit = function() {
		$modalInstance.close($scope.page);
	};

	$scope.cancel = function() {
		$modalInstance.dismiss('cancel');
	};
});

ccac.controller('DeletePageModalController', function($scope, $modalInstance, page) {

	$scope.page = page;
			
	$scope.deletePage = function() {
		$modalInstance.close($scope.page);
	};

	$scope.cancel = function() {
		$modalInstance.dismiss('cancel');
	};
});
