/**
 *
 */
angular.module('protoApp').factory('uuid', function () {
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
	'use strict';

    /**
     *
     * @returns {*}
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

	return {
		get: randomUUID
	}
});
