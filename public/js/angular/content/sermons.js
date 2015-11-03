var ccac = angular.module('ccacAdminApp', ['ui.bootstrap']);

ccac.controller('SermonsController', function ($scope, $http, $modal, $log) {

	$scope.formData = {};
	$scope.oneAtATime = true;
	$scope.sermons = [];

	$scope.tabs = [
		{ title:'English', lang:'eng', id: 'english' },
		{ title:'Cantonese', lang:'cht', id: 'cantonese' },
		{ title:'Mandarin', lang:'chs', id: 'mandarin' }
	];
	
	$scope.init = function() {
		$scope.getSermons('English');
	};
	
	$scope.getSermons = function(congregation) {
		$log.info($scope);
		$scope.congregation = congregation;

		$http.post('/api/getSermons', {congregation: $scope.congregation})
			.success(function(data) {
				$log.info(data);
				
				$scope.sermons = data;
			})
			.error(function(data) {
				$log.info("Error: " + data);
			});
	};

	$scope.addSermon = function() {

		var addSermonModalInstance = $modal.open({
			templateUrl: '/ng-template/content/sermons/sermonModal.html',
			controller: 'AddSermonModalController'
		});

		addSermonModalInstance.result.then(function(sermon) {
			$scope.getSermons($scope.congregation);
		});		
	}

})

ccac.controller('AddSermonModalController', function($scope, $http, $log, $modalInstance) {

	$scope.accordion = {};
	$scope.accordion.sermon = false;
	$scope.accordion.bulletin = false;
	$scope.accordion.life_group = false;
	$scope.accordion.ppt = false;
	$scope.accordion.insert = false;

	$scope.formData = {};
	$scope.service = {};
		
	$scope.congregations = ['English', 'Cantonese', 'Mandarin'];
	$scope.congregation = $scope.congregations[0];	
	$scope.dt = null;

	$scope.progress_value = 0;	

	$scope.open_calendar = function($event) {
		$event.preventDefault();
		$event.stopPropagation();

		$scope.opened = true;
	};

	$scope.dateOptions = {
		formatYear: 'yy',
		startingDay: 0
	};
		
	$scope.upload = function(str) {
	
		if(!$scope.dt) {
			// No Date Selected
			alert('No Date Selected');
			return;
		}

		$http.get('/api/aws_key')
			.success(function(data) {
				// Configure The S3 Object 
				AWS.config.update({ 
					accessKeyId: data.aws.accessKeyId, 
					secretAccessKey: data.aws.secretAccessKey,
					httpOptions: {
						timeout: 600000
					}
				});
				AWS.config.region = data.aws.s3.region;
				var bucket = new AWS.S3({ params: { Bucket: data.aws.s3.bucket } });
								
				if($scope[str]) {
					// Title
					if(str == "title") {
						$scope.formData = {
							congregation: $scope.congregation,
							sermon_date: $scope.dt.yyyymmdd(),
							title: $scope[str] 
						};
											
						$http.post('/api/updateSermon', $scope.formData)
							.success(function(data) {
								$log.info(data);
								// Success!
								alert('Upload Done');
								return;	
							})
							.error(function(data) {
								$log.info('Error: ' + data);
								// Error!
								alert('Upload Error');
								return;	
							});		
					}
					else {
						var params = { 
							ACL: "public-read",
							Key: str.createKey($scope.congregation, $scope.dt.yyyymmdd(), $scope[str].name.split('.').pop()),
							ContentType: $scope[str].type, 
							Body: $scope[str] 
						};

						// Upload to bucket
						bucket.putObject(params, function(err, data) {
							if(err) {
								// There Was An Error With Your S3 Config
								console.log(err, err.stack);
								alert(err.message);
								
								$log.info(AWS.config);
								$log.info(bucket);
								
								return false;
							}
							else {
							
								$scope.formData = {
									congregation: $scope.congregation,
									sermon_date: $scope.dt.yyyymmdd()
								};
										
								$scope.formData[str] = "https://s3-us-west-2.amazonaws.com/calgarychinesealliancechurch/" + params.Key;

								$http.post('/api/updateSermon', $scope.formData)
									.success(function(data) {
										$log.info(data);
									})
									.error(function(data) {
										$log.info('Error: ' + data);
									});		

								// Success!
								alert('Upload Done');
							}
						})
						.on('httpUploadProgress',function(progress) {
							// Log Progress Information
//							$log.info(progress);
							$scope.progress_value = Math.round(progress.loaded / progress.total * 100);
							$scope.$apply();

						});
					}
				}
				else {
					// No File Selected
					alert('No File Selected');
				}
			})
			.error(function(data) {
				$log.info('Error: ' + data);
				// Can't get AWS key
				alert('Failed getting AWS key');
			});	
	}	

	$scope.upload_all = function() {
		if(!$scope.dt) {
			// No Date Selected
			alert('No Date Selected');
			return;
		}

//		var temp_array = ["title","sermon","bulletin","life_group","ppt","insert"];
		var temp_array = ["title","sermon","bulletin","life_group","ppt"];

		for(var i = 0; i < temp_array.length; i++) {
			var str = temp_array[i];
			
			if($scope[str]) {
				$scope.upload(str);
			}
		}
	}
	
	$scope.done = function() {
		$modalInstance.close('done');
	};
})
.directive('file', function() {
	return {
		restrict: 'AE',
		scope: {
			file: '@',
			filetype: '@'
		},
		link: function(scope, el, attrs){
			el.bind('change', function(event){
				var files = event.target.files;
				var file = files[0];

				scope.file = file;
				scope.$parent.file = file;
				scope.$parent.filetype = scope.filetype;
				scope.$parent[scope.filetype] = scope.file;
				scope.$apply();				
			});
		}
	};
});


/////////////////////////////////////////////////////////////////////////////
// Other prototype
Date.prototype.yyyymmdd = function() {
	var yyyy = this.getFullYear().toString();
	var mm = (this.getMonth()+1).toString(); // getMonth() is zero-based
	var dd  = this.getDate().toString();
	return yyyy + (mm[1]?mm:"0"+mm[0]) + (dd[1]?dd:"0"+dd[0]); // padding
};

String.prototype.createKey = function(congregation, date_string, ext) {
	return "SundayService/" + congregation + "/" + date_string + "/" + date_string + "_" + congregation + "_" + this + "." + ext;	
};
