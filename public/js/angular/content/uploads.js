var ccac = angular.module('ccacAdminApp', ['ui.bootstrap']);

ccac.controller('UploadsController', function ($scope, $http, $log) {

	$scope.formData = {};

	$scope.init = function() {
	};

	$scope.upload_calendar = function() {
	
		$http.get('/api/uploads/aws_key')
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
								
				if($scope["calendar"]) {
					if($scope["calendar"].name.split('.').pop() == "pdf") {
						var params = { 
							ACL: "public-read",
							Key: "Calendar/church-calendar.pdf",
							ContentType: $scope["calendar"].type, 
							Body: $scope["calendar"]
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
							
								$scope.formData[str] = "https://s3-us-west-2.amazonaws.com/calgarychinesealliancechurch/" + params.Key;

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
					else {
						// Need PDF file
						alert('Please convert it to PDF format');
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
