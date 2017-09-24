/**
	A wrapper for mobile native storage (cordova plugin)
	made for keeping auth credentials after app update
*/
const NSTOR = new function() {

	this.set = function(key, val, onSuccess, onError) {
		if (window.NativeStorage) {
			window.NativeStorage.setItem(key, val, onSuccess || _onSuccess, onError || _onError);
		}
	}

	this.get = function(key, onSuccess, onError) {
		if (window.NativeStorage) {
			window.NativeStorage.getItem(key, onSuccess || _onSuccess, onError || _onError);
		}
	}

	this.remove = function(key, onSuccess, onError) {
		if (window.NativeStorage) {
			window.NativeStorage.remove(key, onSuccess || _onSuccess, onError || _onError);
		}
	}

	/** Auth shorthands */
	var authKey = 'authCredentials';

	this.setAuth = function(cred, onSuccess, onError) {
		if (cred) {
			this.set(authKey, cred);
		}
	}
	this.removeAuth = function() {
		this.remove(authKey);
	}

	this.getAuth = function(onSuccess, onError) {
		this.get(authKey, onSuccess, onError);
	}

	/** Default callbacks */
	function _onSuccess(obj) {
		console.log('NativeStorage: success', obj)
	}

	function _onError(error) {
		// Error codes:
		// NATIVE_WRITE_FAILED = 1
		// ITEM_NOT_FOUND = 2
		// NULL_REFERENCE = 3
		// UNDEFINED_TYPE = 4
		// JSON_ERROR = 5
		// WRONG_PARAMETER = 6
		if (error.code !== 2) {
			navigator.notification.alert('NativeStorage: error ' + error.code);
		}
		console.log(error);
	}
};
module.exports = NSTOR;
// window.NSTOR = NSTOR;