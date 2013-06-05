angular.module('protoApp').controller('MainCtrl', function ($scope, uuid, fs) {
	'use strict';

	$scope.set = function (data) {
		fs.write(data);
	};

	$scope.reset = function () {
		fs.write({});
	};

	$scope.loadScreen = function (data) {
		$scope.screens = JSON.parse(data);
		$scope.images = {}; //This is the only model that hold imageData. Key it using screenId
		$scope.screenList = _.keys($scope.screens);
		$scope.screenList = _.map($scope.screenList, function (s) {
			return {
				id: s,
				imageData: $scope.screens[s].imageData,
				getImageData: function (){
					console.log('reading ' + $scope.screens[s].imageName);
					$scope.images[s] = {};
					fs.read($scope.screens[s].imageName, '', $scope.images[s]);
				},
				imageName: $scope.screens[s].imageName
			};
		});
		if ($scope.screenList[0]) {
			$scope.screen = $scope.screens[$scope.screenList[0].id];
			$scope.$apply();
		}
		fs.readTemplateFile();

		//Hack to refresh images that are read asynchrously
		setTimeout(function(){
			$scope.$apply();
		}, 2000);
	}

	$scope.download = function () {
		fs.download($scope);
	} 

	$scope.spotId = null;

	var targetSelectionMode = false,
		baseScreenId = null,
		spotId = null;

	fs.requestForFile($scope.loadScreen);

	$scope.editMode = true;
	$scope.changeMode = function (){
		$scope.editMode = !$scope.editMode;
	};

	$scope.changeScreen = function (screenId) {
		$scope.screen = $scope.screens[screenId];
	};

	$scope.deleteScreen = function (screenId) {
		delete $scope.screens[screenId];
		$scope.set($scope.screens);
	};

	$scope.addSpot = function (e, screenId) {
		$scope.screens[screenId].hotspots.push({
			'top': e.offsetY - 28,
			'left': e.offsetX - 2,
			'width': 150,
			'height': 30,
			target: null
		});
		$scope.set($scope.screens);
	};
	$scope.deleteSpot = function (screenId, spotIndex) {
		$scope.screens[screenId].hotspots.splice(spotIndex, 1)
		$scope.set($scope.screens);
	};

	$scope.selectTarget = function (screen, index) {
		targetSelectionMode = true;
		baseScreenId = screen;
		$scope.spotId = index;
	};

	$scope.selectScreen = function (screenId) {
		if (targetSelectionMode) {
			$scope.screens[baseScreenId].hotspots[$scope.spotId].target = screenId;
			targetSelectionMode = false,
			baseScreenId = null,
			$scope.spotId = null;
			$scope.set($scope.screens);
		} else {
			$scope.changeScreen(screenId);
		}
	};

	function handleFileSelect(evt) {
		fs.handleFileSelect(evt, $scope);
	}

	// Setup the dnd listeners.
	var dropZone = document.getElementById('drop_zone');
	dropZone.addEventListener('dragover', fs.handleDragOver, false);
	dropZone.addEventListener('drop', handleFileSelect, false);

	function handleImportFile(evt) {
	    fs.handleImportFile(evt, $scope);
	}

	document.getElementById('files').addEventListener('change', handleImportFile, false);
});