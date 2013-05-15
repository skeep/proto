angular.module('protoApp').controller('MainCtrl', function ($scope, uuid, fs) {
	'use strict';

	$scope.set = function (data) {
		fs.writeAppDataFile(data);
	};

	$scope.reset = function () {
		fs.writeAppDataFile({});
	};

	$scope.loadScreen = function (data) {
		$scope.screens = JSON.parse(data);
		$scope.screenList = _.keys($scope.screens);
		$scope.screenList = _.map($scope.screenList, function (s) {
			return {
				id: s,
				imageData: $scope.screens[s].imageData,
				imageName: $scope.screens[s].imageName
			};
		});
		if ($scope.screenList[0]) {
			$scope.screen = $scope.screens[$scope.screenList[0].id];
			$scope.$apply();
		}
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
		evt.stopPropagation();
		evt.preventDefault();

		var files = evt.dataTransfer.files; // FileList object.

		// files is a FileList of File objects. List some properties.
		var output = [];

		// Loop through the FileList and render image files as thumbnails.
		for (var i = 0, f; f = files[i]; i++) {

			// Only process image files.
			if (!f.type.match('image.*')) {
				continue;
			}

			var reader = new FileReader();

			// Closure to capture the file information.
			reader.onload = (function (theFile) {
				return function (e) {
					// Render thumbnail.
					var id = uuid.get();

					$scope.screens[id] = {
						id: id,
						imageName: escape(theFile.name),
						imageData:e.target.result,
						hotspots: []
					};
					$scope.set($scope.screens);
				};
			})(f);

			// Read in the image file as a data URL.
			reader.readAsDataURL(f);
		}
	}

	function handleDragOver(evt) {
		evt.stopPropagation();
		evt.preventDefault();
		evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
	}

	// Setup the dnd listeners.
	var dropZone = document.getElementById('drop_zone');
	dropZone.addEventListener('dragover', handleDragOver, false);
	dropZone.addEventListener('drop', handleFileSelect, false);

	var reader;
	var progress = document.querySelector('.percent');
	var progress_bar = document.getElementById('progress_bar');

	function updateProgress(evt) {
	    // evt is an ProgressEvent.
	    if (evt.lengthComputable) {
	      	var percentLoaded = Math.round((evt.loaded / evt.total) * 100);
	      	// Increase the progress bar length.
	      	if (percentLoaded < 100) {
	        	progress.style.width = percentLoaded + '%';
	        	progress.textContent = percentLoaded + '%';
	      	}
	    }
	}

	function handleImportFile(evt) {
	    // Reset progress indicator on new file selection.
	    progress.style.width = '0%';
	    progress.textContent = '0%';

	    reader = new FileReader();
	    reader.onerror = fs.errorHandler;
	    reader.onprogress = updateProgress;
	    reader.onabort = function(e) {
	      	alert('File read cancelled');
	    };
	    reader.onloadstart = function(e) {
	    	progress_bar.style.visibility = '';
	      	progress_bar.className = 'loading';
	    };
	    reader.onload = function(e) {
		    // Ensure that the progress bar displays 100% at the end.
		    progress.style.width = '100%';
		    progress.textContent = '100%';
		    //setTimeout("document.getElementById('progress_bar').className='';", 2000);
		    console.log(e.target.result);
		    $scope.loadScreen(e.target.result);
		    fs.writeAppDataFile(JSON.parse(e.target.result));
		    progress_bar.style.visibility = 'hidden';
	    }

	    // Read in the import file as a binary string.
	    reader.readAsBinaryString(evt.target.files[0]);
	}

	document.getElementById('files').addEventListener('change', handleImportFile, false);
});