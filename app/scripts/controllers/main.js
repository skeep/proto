angular.module('protoApp').controller('MainCtrl', function ($scope) {
	'use strict';

	$scope.set = function (data) {
		writeTempFile(data);
	};

	$scope.reset = function () {
		writeTempFile();
	};

	$scope.loadScreen = function(data) {
		$scope.screens = JSON.parse(data);
		$scope.screenList = _.keys($scope.screens);
		$scope.screenList = _.map($scope.screenList, function (s) {
			return {
				id: s,
				imageData: $scope.screens[s].imageData,
				imageName : $scope.screens[s].imageName
			};
		});
		if ($scope.screenList[0]) {
			$scope.screen = $scope.screens[$scope.screenList[0].id];
			$scope.$apply();
		}
		addSavetoFileButton($scope);
	}

	$scope.spotId = null;

	var targetSelectionMode = false,
		baseScreenId = null,
		spotId = null;

	requestForTempFile($scope.loadScreen);

	$scope.editMode = true;
	$scope.changeMode = function(){
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
			'top': e.offsetY-28,
			'left': e.offsetX-2,
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
		// for (var i = 0, f; f = files[i]; i++) {
		// 	output.push('<li><strong>', escape(f.name), '</strong> (', f.type || 'n/a', ') - ',
		// 	f.size, ' bytes, last modified: ',
		// 	f.lastModifiedDate ? f.lastModifiedDate.toLocaleDateString() : 'n/a',
		// 		'</li>');
		// }
		// document.getElementById('list').innerHTML = '<ul>' + output.join('') + '</ul>';

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
					var id = randomUUID();

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
		$scope.$apply();
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

	// function errorHandler(evt) {
	//     switch(evt.target.error.code) {
	//       case evt.target.error.NOT_FOUND_ERR:
	//         alert('File Not Found!');
	//         break;
	//       case evt.target.error.NOT_READABLE_ERR:
	//         alert('File is not readable');
	//         break;
	//       case evt.target.error.ABORT_ERR:
	//         break; // noop
	//       default:
	//         alert('An error occurred reading this file.');
	//     };
	// }

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

	function handleInputFile(evt) {
	    // Reset progress indicator on new file selection.
	    progress.style.width = '0%';
	    progress.textContent = '0%';

	    reader = new FileReader();
	    reader.onerror = errorHandler;
	    reader.onprogress = updateProgress;
	    reader.onabort = function(e) {
	      	alert('File read cancelled');
	    };
	    reader.onloadstart = function(e) {
	      	document.getElementById('progress_bar').className = 'loading';
	    };
	    reader.onload = function(e) {
		    // Ensure that the progress bar displays 100% at the end.
		    progress.style.width = '100%';
		    progress.textContent = '100%';
		    //setTimeout("document.getElementById('progress_bar').className='';", 2000);
		    $scope.loadScreen(e.target.result);
		    writeTempFile(JSON.parse(e.target.result));
		    $(progress).parent().hide();
	    }

	    // Read in the input file as a binary string.
	    reader.readAsBinaryString(evt.target.files[0]);
	}

	document.getElementById('files').addEventListener('change', handleInputFile, false);

	/**
	 * Create and return a "version 4" RFC-4122 UUID string.
	 *
	 * randomUUID.js
	 * This software is made available under the terms of the Open Software License
	 * v3.0 (available here: http://www.opensource.org/licenses/osl-3.0.php )
	 * The latest version of this file can be found at: http://www.broofa.com/Tools/randomUUID.js
	 * For more information, or to comment on this, please go to: http://www.broofa.com/blog/?p=151
	 *
	 * @author Robert Kieffer
	 * @copyright 2008
	 * @license This software is made available under the terms of the Open Software License v3.0 (available here: http://www.opensource.org/licenses/osl-3.0.php)
	 * @version 1.0
	 * @access private
	 * @api private
	 * @return {String} a "version 4" RFC-4122 UUID string
	 */

	function randomUUID() {
		var s = [],
			itoh = '0123456789ABCDEF';
		// Make array of random hex digits. The UUID only has 32 digits in it, but we
		// allocate an extra items to make room for the '-'s we'll be inserting.
		var i, j;
		for (i = 0; i < 36; i++) s[i] = Math.floor(Math.random() * 0x10);
		// Conform to RFC-4122, section 4.4
		s[14] = 4; // Set 4 high bits of time_high field to version
		s[19] = (s[19] & 0x3) | 0x8; // Specify 2 high bits of clock sequence
		// Convert to hex chars
		for (j = 0; j < 36; j++) {
			s[j] = itoh[s[j]];
		}
		// Insert '-'s
		s[8] = s[13] = s[18] = s[23] = '-';
		return s.join('');
	}

});

// Note: The file system has been prefixed as of Google Chrome 12:
window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;
var fileSystem = null;

function requestForTempFile(loadScreen) {
	window.webkitStorageInfo.requestQuota(
		PERSISTENT, 
		10*1024*1024, 
		function(grantedBytes) {
	  	window.requestFileSystem(PERSISTENT, grantedBytes, function(fs) {
	  		fileSystem = fs;
	  		fileSystem.root.getFile('TempFile', {create: true, exclusive: false}, function(fileEntry) {
			    readTempFile(loadScreen);
			    //Incase you want to clear the file and start afresh, comment above line and uncomment
			    //below 3 lines. Undo this change once all clear.
			    // fileEntry.remove(function() {
			    //   console.log('File removed.');
			    // }, errorHandler);
			  }, errorHandler);
	  	}, errorHandler);
		}, 
		function(e) {
	  console.log('Error', e);
	});
}

function readTempFile(loadScreen) {
	fileSystem.root.getFile('TempFile', {create: false}, function(fileEntry) {
    fileEntry.file(function(file) {
       var reader = new FileReader();
       reader.onloadend = function(e) {
       		console.log('Temp File content: "' + this.result + '"');
        	loadScreen(this.result || '{}');
       };
       reader.readAsText(file);
    }, errorHandler);
  }, errorHandler);
}

function writeTempFile(data) {
	//remove file first. didn't find a way to clear/overwrite file content.
	fileSystem.root.getFile('TempFile', {}, function(fileEntry) {
    fileEntry.remove(function() {
      console.log('File removed.');
    }, errorHandler);
  }, errorHandler);

	//and the recreate it so that its empty.
	window.webkitStorageInfo.requestQuota(
		PERSISTENT, 
		100*1024*1024, 
		function(grantedBytes) {
	  	window.requestFileSystem(PERSISTENT, grantedBytes, function(fs) {
	  		fileSystem = fs;
	  		fileSystem.root.getFile('TempFile', {create: true, exclusive: false}, function(fileEntry) {
			    fileEntry.createWriter(function(fileWriter) {

			      fileWriter.onwriteend = function(e) {
			        console.log('Write completed.');
			      };

			      fileWriter.onerror = function(e) {
			        console.log('Write failed: ' + e.toString());
			      };

			      // Create a new Blob and write it to log.txt.
			      var blob = new Blob([JSON.stringify(data)], {type: 'text/plain'});

			      fileWriter.write(blob);
			      console.log(blob);

			    }, errorHandler);
			  }, errorHandler);
	  	}, errorHandler);
		}, 
		function(e) {
	  console.log('Error', e);
	});
}

function errorHandler(e) {
  var msg = '';

  switch (e.code) {
    case FileError.QUOTA_EXCEEDED_ERR:
      msg = 'QUOTA_EXCEEDED_ERR';
      break;
    case FileError.NOT_FOUND_ERR:
      msg = 'NOT_FOUND_ERR';
      break;
    case FileError.SECURITY_ERR:
      msg = 'SECURITY_ERR';
      break;
    case FileError.INVALID_MODIFICATION_ERR:
      msg = 'INVALID_MODIFICATION_ERR';
      break;
    case FileError.INVALID_STATE_ERR:
      msg = 'INVALID_STATE_ERR';
      break;
    default:
      msg = 'Unknown Error';
      break;
  };

  console.log('Error: ' + msg);
}

function addSavetoFileButton(scope) {
	Downloadify.create('downloadFile',{
		filename: function(){
			return 'appdata.txt';
		},
		data: JSON.stringify(scope.screens),
		onComplete: function(){ alert('Your File Has Been Saved!'); },
		onCancel: function(){ alert('You have cancelled the saving of this file.'); },
		onError: function(){ alert('You must put something in the File Contents or there will be nothing to save!'); },
		swf: 'media/downloadify.swf',
		downloadImage: 'images/download.png',
		width: 100,
		height: 30,
		transparent: true,
		append: false
	});
}