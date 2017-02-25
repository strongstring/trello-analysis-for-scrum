var WisenetModel = require('./WisenetModel.js');
var InstallationModel = require('./InstallationModel.js');
var SmartCamPlusModel = require('./SmartCamPlusModel.js');

function VersionManager() {
	this.services = [];
	this.services[0] = WisenetModel;
	this.services[1] = InstallationModel;
	this.services[2] = SmartCamPlusModel;
}

VersionManager.prototype = {
	getServiceList : function() {

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
}

module.exports = VersionManager;