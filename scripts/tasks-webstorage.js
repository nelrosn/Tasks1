storageEngine = function() {

	function errorLogger(errorCode, errorMessage) {
		console.log(errorCode +':'+ errorMessage);
	}

	function getStorageObject(type) {
	var item = localStorage.getItem(type);
	var parsedItem = JSON.parse(item);
	return parsedItem;
}

	var initialized = false;
	var initializedObjectStores = {};

	return {
		init : function(successCallback, errorCallback) {
			if (window.localStorage) {
				initialized = true;
				successCallback(null);
			} 
			else {
				errorCallback('storage_api_not_supported', 'The web storage api is not supported');
			}
		},
		initObjectStore : function(type, successCallback, errorCallback) {
			if (!initialized) {
				errorCallback('storage_api_not_initialized', 'The storage engine has not been initialized');
			} 
			else if (!localStorage.getItem(type)) {
				localStorage.setItem(type, JSON.stringify({}));
			}
			initializedObjectStores[type] = true;
			successCallback(null);
		},
		save: function(type, obj, successCallback, errorCallback) {
				if (!initialized) {
					errorCallback('storage_api_not_initialized', 'The storage engine has not been initialized');
				} else if (!initializedObjectStores[type]) {
					errorCallback('store_not_initialized', 'The object store '+type+' has not been initialized');
				}   
				if (!obj.id) {
					obj.id = $.now();
				}
				var storageItem = getStorageObject(type);
				storageItem[obj.id] = obj;
				localStorage.setItem(type, JSON.stringify(storageItem));
				successCallback(obj);
		},

		findAll : function(type, successCallback, errorCallback) {
					if (!initialized) {
						errorCallback('storage_api_not_initialized', 'The storage engine has not been initialized');
					} else if (!initializedObjectStores[type]) {
						errorCallback('store_not_initialized', 'The object store '+type+' has not been initialized');
					}
					var result = [];
					var storageItem = getStorageObject(type);
					$.each(storageItem, function(i, v) {
						result.push(v);
					});
					successCallback(result);
					},
		delete : function(type, id, successCallback, errorCallback) {},
		delete : function(type, id, successCallback, errorCallback) { 
					if (!initialized) {
						errorCallback('storage_api_not_initialized', 'The storage engine has not been initialized');
					} else if (!initializedObjectStores[type]) {
						errorCallback('store_not_initialized', 'The object store '+type+' has not been initialized');
					}
					var storageItem = getStorageObject(type); 
					if (storageItem[id]) {
						delete storageItem[id];
						localStorage.setItem(type, JSON.stringify(storageItem)); 
						successCallback(id);
					} else {
						errorCallback("object_not_found","The object requested could not be found");
					}
		},
		findByProperty : function(type, propertyName, propertyValue, successCallback, errorCallback) {
					if (!initialized) {
						errorCallback('storage_api_not_initialized', 'The storage engine has not been initialized');
					} else if (!initializedObjectStores[type]) {
						errorCallback('store_not_initialized', 'The object store '+type+' has not been initialized');
					}
					var result = [];
					var storageItem = getStorageObject(type); 
					$.each(storageItem, function(i, v) {
					if (v[propertyName] === propertyValue) {
						result.push(v);
					}
					}); 
					successCallback(result);
		},
		findById : function (type, id, successCallback, errorCallback)	{
					if (!initialized) {
						errorCallback('storage_api_not_initialized', 'The storage engine has not been initialized');
					} else if (!initializedObjectStores[type]) {
						errorCallback('store_not_initialized', 'The object store '+type+' has not been initialized');
					}	
					var storageItem = getStorageObject(type); 
					var result = storageItem[id];
					successCallback(result);
					}
		}
}();