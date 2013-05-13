angular.module('protoApp').factory('fs', function () {
	'use strict';

	// Note: The file system has been prefixed as of Google Chrome 12:
	window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
	var fileSystem = null;

	function requestForFile(loadScreen) {
		window.webkitStorageInfo.requestQuota(
		PERSISTENT,
		10 * 1024 * 1024,

		function (grantedBytes) {
			window.requestFileSystem(PERSISTENT, grantedBytes, function (fs) {
				fileSystem = fs;
				fileSystem.root.getFile('appdata.txt', {
					create: true,
					exclusive: false
				}, function (fileEntry) {
					readAppDataFile(loadScreen);
					//Incase you want to clear the file and start afresh, comment above line and uncomment
					//below 3 lines. Undo this change once all clear.
					// fileEntry.remove(function() {
					//   console.log('File removed.');
					// }, errorHandler);
				}, errorHandler);
			}, errorHandler);
		},

		function (e) {
			console.log('Error', e);
		});
	}

	function readAppDataFile(loadScreen) {
		fileSystem.root.getFile('appdata.txt', {
			create: false
		}, function (fileEntry) {
			fileEntry.file(function (file) {
				var reader = new FileReader();
				reader.onloadend = function (e) {
					console.log('File read: "' + this.result + '"');
					loadScreen(this.result || '{}');
				};
				reader.readAsText(file);
			}, errorHandler);
		}, errorHandler);
	}

	function writeAppDataFile(data) {
		//remove file first. didn't find a way to clear/overwrite file content.
		fileSystem.root.getFile('appdata.txt', {}, function (fileEntry) {
			fileEntry.remove(function () {
				console.log('File removed.');
			}, errorHandler);
		}, errorHandler);

		//and the recreate it so that its empty.
		window.webkitStorageInfo.requestQuota(
		PERSISTENT,
		100 * 1024 * 1024,

		function (grantedBytes) {
			window.requestFileSystem(PERSISTENT, grantedBytes, function (fs) {
				fileSystem = fs;
				fileSystem.root.getFile('appdata.txt', {
					create: true,
					exclusive: false
				}, function (fileEntry) {
					fileEntry.createWriter(function (fileWriter) {

						fileWriter.onwriteend = function (e) {
							console.log('Write completed.');
						};

						fileWriter.onerror = function (e) {
							console.log('Write failed: ' + e.toString());
						};

						// Create a new Blob and write it to log.txt.
						var blob = new Blob([JSON.stringify(data)], {
							type: 'text/plain'
						});

						fileWriter.write(blob);
						console.log(blob);

					}, errorHandler);
				}, errorHandler);
			}, errorHandler);
		},

		function (e) {
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
		Downloadify.create('downloadFile', {
			filename: function () {
				return 'appdata.txt';
			},
			data: JSON.stringify(scope.screens),
			onComplete: function () {
				alert('Your File Has Been Saved!');
			},
			onCancel: function () {
				alert('You have cancelled the saving of this file.');
			},
			onError: function () {
				alert('You must put something in the File Contents or there will be nothing to save!');
			},
			swf: 'media/downloadify.swf',
			downloadImage: 'images/download.png',
			width: 100,
			height: 30,
			transparent: true,
			append: false
		});
	}

	return {
		requestForFile: requestForFile,
		writeAppDataFile: writeAppDataFile,
		download: addSavetoFileButton
	};

});
