var WisenetModel = require('./WisenetModel.js');
var InstallationModel = require('./InstallationModel.js');
var SmartCamPlusModel = require('./SmartCamPlusModel.js');
var HiveModel = require('./HiveModel.js');

function VersionManager() {
	this.services = [];
	this.services[0] = WisenetModel;
	this.services[1] = InstallationModel;
	this.services[2] = SmartCamPlusModel;
	this.services[3] = HiveModel;
}

VersionManager.prototype = {
	getServiceIndex : function(serviceName) {

		var length = this.services.length;
		var findIndex = -1;

		for(var i = 0; i < length; i++) {
			if(this.services[i].getPage() === serviceName) {
				findIndex = i;
				break;
			}
		}

		return findIndex;
	},
	getAllServiceList : function() {
		var length = this.services.length;
		var list = [];

		for (var i = 0; i < length; i++) {
			info = {};
			var service = this.services[i];

			info.name = service.getName();
			info.link = service.getLatestVersion();
			info.imageUrl = service.getImageLink();
			info.page = service.getPage();

			list[i] = info;
		}

		return list;
	},
	getLinkist : function(serviceName) {
		var sid = this.getServiceIndex(serviceName);
		var result = [];
		if(sid !== -1) {
			result = this.services[sid].getVersion();
		}

		return result;
	},
	getLatestVersion : function(serviceName) {
		var sid = this.getServiceIndex(serviceName);
		var result = {};
		if(sid !== -1) {
			result.name = this.services[sid].getName();
			result.link = this.services[sid].getLatestVersion();
			result.imageUrl = this.services[sid].getImageLink();
		}

		return result;
	},
}

module.exports = VersionManager;