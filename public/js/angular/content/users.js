var ccac = angular.module('ccacAdminApp', ['ui.bootstrap']);

ccac.controller('UsersController', function ($scope, $http, $modal, $log) {

	$scope.users = [];
	$scope.roles = [];
	$scope.permissions = [];

	$scope.formData = {};

	$scope.init = function() {
		$scope.getUsers();
		$scope.getRoles();
	};
	
	$scope.getUsers = function() {

		$http.get('/api/getUsers')
			.success(function(data) {
				$log.info(data);
				$scope.users= data;
			})
			.error(function(data) {
				$log.info("Error: " + data);
			});
	};

	$scope.getRoles = function() {

		$http.get('/api/getRoles')
			.success(function(data) {
				$log.info(data);
				
				$scope.roles = data.filter(function(el) {
					return el.role != undefined;
				});

				$scope.permissions = data.filter(function(el) {
					return el.permissions != undefined;
				});
			})
			.error(function(data) {
				$log.info("Error: " + data);
			});
	};
	
	$scope.editUser = function(user) {

		var editUserModalInstance = $modal.open({
			templateUrl: '/ng-template/content/users/editUserModal.html',
			controller: 'EditUserModalController',
//			windowClass: 'full-size-modal',
			resolve: {
				user: function() {
					return user;
				},
				roles: function() {
					return $scope.roles;
				},
				permissions: function() {
					return $scope.permissions;
				}
			}
		});
		
		editUserModalInstance.result.then(function(change) {
		
			if(change != 'cancel') {
				$log.info(change);

				$http.post('/api/updateUser', {user: change})
					.success(function(data) {
						$log.info(data);
						
						$scope.getUsers();
					})
					.error(function(data) {
						$log.info("Error: " + data);
					});
			} else {
				$scope.getUsers();
			}

		});
	
	}

	$scope.deleteUser = function(user) {

		var deleteUserModalInstance = $modal.open({
			templateUrl: '/ng-template/content/users/deleteUserModal.html',
			controller: 'DeleteUserModalController',
			resolve: {
				user: function() {
					return user;
				}
			}
		});
		
		deleteUserModalInstance.result.then(function(user) {
		
			$http.post('/api/deleteUser', {user: user})
				.success(function(data) {
					$log.info(data);
					
					$scope.getUsers();
				})
				.error(function(data) {
					$log.info("Error: " + data);
				});

		});
	
	}

})

ccac.controller('EditUserModalController', function($scope, $modalInstance, user, roles, permissions) {
	$scope.user = user;
	$scope.roles = roles;
	$scope.permissions = permissions;
	
	$scope.changeRole = function(role) {
		$scope.user.role = role;
	}
	
	$scope.changePermission = function(permission) {
		if ($scope.user.permissions == undefined) {
			$scope.user.permissions = [];
		}
		
		var idx = $scope.user.permissions.indexOf(permission);

		// is currently selected
		if (idx > -1) {
			$scope.user.permissions.splice(idx, 1);
		}

		// is newly selected
		else {
			$scope.user.permissions.push(permission);
		}
	};
	
	$scope.update = function() {
		$modalInstance.close($scope.user);
	};

	$scope.cancel = function() {
		$modalInstance.close('cancel');
	};
});

ccac.controller('DeleteUserModalController', function($scope, $modalInstance, user) {
	$scope.user = user;
	
	$scope.deleteUser = function() {
		$modalInstance.close($scope.user);
	};

	$scope.cancel = function() {
		$modalInstance.dismiss('cancel');
	};
});
