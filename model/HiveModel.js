var MPServiceModel = require('./MPServiceModel.js');
var HiveModel = new MPServiceModel();

HiveModel.setName("Hive");
HiveModel.setImageLink("/images/icon_hive.png");
HiveModel.setPage("hive");
HiveModel.setVersion([
	{ 
		"version" : "0.10.170413",
		"option"  : "Stable",
		"link" : "https://dl.dropboxusercontent.com/s/jb51mu4c3ojcwzk/manifest.plist", 
		"platform" : "ios",
	},
]);

module.exports = HiveModel;