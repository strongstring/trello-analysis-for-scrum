var MPServiceModel = require('./MPServiceModel.js');
var InstallationModel = new MPServiceModel();

InstallationModel.setName("Wisenet Installation");
InstallationModel.setImageLink("/images/icon_installation.png");
InstallationModel.setPage("installation");
InstallationModel.setVersion([
	{ 
		"version" : "0.30.161230", 
		"link" : "https://dl.dropboxusercontent.com/s/skxjrekzac5u0iq/manifest.plist", 
		"platform" : "ios",
	},
	{ 
		"version" : "0.30.161230", 
		"link" : "https://dl.dropboxusercontent.com/s/qemaoibcwjnl6u1/Wisenet_Installation.v0.30.161230.apk",
		"platform" : "android",
	},
	{ 
		"version" : "0.40.170105", 
		"link" : "https://dl.dropboxusercontent.com/s/jkjf1yj7ic8ch3x/manifest.plist", 
		"platform" : "ios",
	},
	{ 
		"version" : "0.40.170105", 
		"link" : "https://dl.dropboxusercontent.com/s/dqayr9qqpdvomei/Wisenet_Installation.v0.40.170105.apk",
		"platform" : "android",
	},
	{ 
		"version" : "1.00.170120", 
		"link" : "https://dl.dropboxusercontent.com/s/nj5i18im3j2ma3s/manifest.plist", 
		"platform" : "ios",
		"option" : "Stable",
	},
	{ 
		"version" : "1.00.170120", 
		"link" : "https://dl.dropboxusercontent.com/s/fntlxg2tdq5g590/Wisenet_Installation.v1.00.170120.apk",
		"platform" : "android",
		"option" : "Stable",
	},
]);

module.exports = InstallationModel;