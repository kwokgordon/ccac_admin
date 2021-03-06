var ccac = angular.module('ccacAdminApp', ['ui.bootstrap']);

ccac.controller('UsersController', function ($scope, $http, $modal, $log) {

	$scope.users = [];
	$scope.roles = [];
	$scope.permissions = [];
	
	$scope.invitations = [];
	
	$scope.messages = {};

	$scope.formData = {};

	$scope.tabs = [
		{ title:'Users', id: 'users' },
		{ title:'Invitations', id: 'invitations' },
	];
	
	$scope.init = function() {
		$scope.getRoles();
		$scope.getUsers();
		$scope.getInvitations();
	};
	
	$scope.getUsers = function() {

		$http.get('/api/users/getUsers')
			.success(function(data) {
				$log.info(data);
				$scope.users = data.users;
			})
			.error(function(data) {
				$log.info("Error: " + data);
			});
	};

	$scope.getRoles = function() {

		$http.get('/api/users/getRoles')
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

	$scope.getInvitations = function() {

		$http.get('/api/users/getInvitations')
			.success(function(data) {
				$log.info(data);
				$scope.invitations = data.invitations;
			})
			.error(function(data) {
				$log.info("Error: " + data);
			});
	};
	
	$scope.addUser = function() {

		var addUserModalInstance = $modal.open({
			templateUrl: '/ng-template/content/users/addUserModal.html',
			controller: 'AddUserModalController',
			resolve: {
				roles: function() {
					return $scope.roles;
				},
				permissions: function() {
					return $scope.permissions;
				}
			}
		});
		
		addUserModalInstance.result.then(function(user) {
			$scope.getUsers();
			$scope.getInvitations();
		
			var to = user.email;
			var subject = "Invitation to CCAC Admin";
			var html_code = "<b>Hello</b>";

/*
			$http.post('/email/sendEmail', {
					to: to,
					subject: subject,
					html: html_code
				})
					.success(function(data) {
						$log.info(data);
						$scope.messages = data.messages;
						
						$scope.getUsers();
						$scope.getInvitations();
					})
					.error(function(data) {
						$log.info("Error: " + data);
					});
*/	

		});
	
	};
	
	$scope.editUser = function(user) {

		var editUserModalInstance = $modal.open({
			templateUrl: '/ng-template/content/users/editUserModal.html',
			controller: 'EditUserModalController',
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

				$http.post('/api/users/updateUser', {user: change})
					.success(function(data) {
						$log.info(data);
						$scope.messages = data.messages;
						
						$scope.getUsers();
					})
					.error(function(data) {
						$log.info("Error: " + data);
					});
			} else {
				$scope.getUsers();
			}

		});
	
	};

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
		
			$http.post('/api/users/deleteUser', {user: user})
				.success(function(data) {
					$log.info(data);
					$scope.messages = data.messages;
					
					$scope.getUsers();
				})
				.error(function(data) {
					$log.info("Error: " + data);
				});
		});
	};

	$scope.deleteInvitation = function(invitation) {

		var deleteInvitationModalInstance = $modal.open({
			templateUrl: '/ng-template/content/users/deleteInvitationModal.html',
			controller: 'DeleteInvitationModalController',
			resolve: {
				invitation: function() {
					return invitation;
				}
			}
		});
		
		deleteInvitationModalInstance.result.then(function(invitation) {
		
			$http.post('/api/users/deleteInvitation', {invitation: invitation})
				.success(function(data) {
					$log.info(data);
					$scope.messages = data.messages;
					
					$scope.getInvitations();
				})
				.error(function(data) {
					$log.info("Error: " + data);
				});
		});
	};
	
})

ccac.controller('AddUserModalController', function($scope, $http, $log, $modalInstance, roles, permissions) {
	$scope.roles = roles;
	$scope.permissions = permissions;

	$scope.messages = {};

	$scope.user = {};
	
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
	
	$scope.add= function() {
		$http.post('/api/users/addInvitation', {user: $scope.user})
			.success(function(data) {
				$log.info(data);
				$scope.messages = data.messages;
				
				if (data.sendEmail) {
					$modalInstance.close($scope.user);
				}
			})
			.error(function(data) {
				$log.info("Error: " + data);
			});
	};

	$scope.cancel = function() {
		$modalInstance.dismiss('cancel');
	};
});

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

ccac.controller('DeleteInvitationModalController', function($scope, $modalInstance, invitation) {
	$scope.invitation = invitation;
	
	$scope.deleteInvitation = function() {
		$modalInstance.close($scope.invitation);
	};

	$scope.cancel = function() {
		$modalInstance.dismiss('cancel');
	};
});
