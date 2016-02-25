var todoApp = angular.module('imageLibApp',['imageController', 'angularMoment']);

var imageController = angular.module('imageController',[]);

imageController.controller('ImageCtrl',['$scope','$http', '$location',
	function ($scope, $http, $location) {

		$scope.displayMode = 'Libraries';

		var pathArray = window.location.href.split('/');
		$scope.url = pathArray[0] + '//' + pathArray[2];

		$scope.listTodos = function () {
			$http.get($scope.url + '/api/user').success(function(data){
				$scope.user = data;
			});
		}
		$scope.listTodos();

		$scope.displayModeChange = function (view) {
			$scope.displayMode = view;
		};

		$scope.newLibrary = function () {
			$scope.newLibraryTitle = $('#newLibraryTitle').val();
			var newlib = { title: $scope.newLibraryTitle };
			$http.post('/api/user/library', newlib).success(function (data, status) {
				$scope.user = data;
				$scope.newLibraryTitle = undefined;
				$('#newLibraryTitle').val("");
			}).error(function (data, status) {
				$scope.error = true;
				$scope.feedback = "Cannot create library";
				$('#feedbackLabel').fadeIn(1000).fadeOut(3000);
			});
		}

		$scope.showLibrary = function (item) {
			if (item) {
				$scope.selectedLibrary = $scope.user.libraries.indexOf(item);
				$scope.library = $scope.user.libraries[$scope.selectedLibrary];
				$scope.image = $scope.library.images[0];
			}
			$scope.displayMode = 'Library';
		}

		$scope.filesChanged = function (elm) {
			$scope.files = elm.files;
			$scope.$apply();
		}

		$scope.upload = function () {
			var fd = new FormData();
			angular.forEach($scope.files, function (file, key) {
				fd.append('file', file);
				fd.append('titles', file.title);
				fd.append('descriptions', file.description);
			})
			$http.post('/api/images/' + $scope.library._id, fd, {
				transformRequest: angular.identity,
				headers: {'Content-type': undefined}
			}).success(function (data, status) {
				$scope.user = data;
				$('span.file-input').addClass("file-input-new");
				$('#file-input').val('');
				$scope.showLibrary($scope.user.libraries[$scope.selectedLibrary]);
			})
		}

		$scope.deleteImage = function (image) {
			$http.delete($scope.url + '/api/image/' + $scope.library._id + '/' + image._id).success(function (status) {
				$scope.library.images.splice($scope.library.images.indexOf(image), 1);
				$scope.image = $scope.library.images[0];
			}).error(function (status) {
				$scope.saveError=false;
				$scope.saveFeedback = "label-warning";
				$scope.feedback = "Unable to delete the todo item.";
				$('#feedbackLabel').fadeIn(1000).fadeOut(3000);
			})
		}

		$scope.deleteLibrary = function (library) {
			$http.delete($scope.url + '/api/user/library/' + library._id).success(function (data, status) {
				$scope.user = data;
			}).error(function (status) {
				$scope.saveError=false;
				$scope.saveFeedback = "label-warning";
				$scope.feedback = "Unable to delete the todo item.";
				$('#feedbackLabel').fadeIn(1000).fadeOut(3000);
			})
		}

		$scope.selectedImage = function (image) {
			var imageIndex = $scope.library.images.indexOf(image);
			$scope.image = $scope.library.images[imageIndex];
			$scope.displayMode = 'Library';
		}
}]);