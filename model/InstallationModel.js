var MPServiceModel = require('./MPServiceModel.js');
var InstallationModel = new MPServiceModel();

InstallationModel.setName("Wisenet Installation");
InstallationModel.setImageLink("/images/icon_installation.png");
InstallationModel.setPage("installation");
InstallationModel.setVersion([
	{ 
		"version" : "1.1.170508", 
		"link" : "https://dl.dropboxusercontent.com/s/k4yicjjrdctj8bh/manifest.plist", 
		"platform" : "ios",
		"option" : "Stable",
	},
	{ 
		"version" : "1.1.170508", 
		"link" : "https://dl.dropboxusercontent.com/s/7nwmzuqd9xt8qu1/Wisenet%20Installation_1.1_170508.apk",
		"platform" : "android",
		"option" : "Stable",
	},
	{ 
		"version" : "1.10.170421", 
		"link" : "https://dl.dropboxusercontent.com/s/vvr5ycssjb0yhvl/manifest.plist", 
		"platform" : "ios",
	},
	{ 
		"version" : "1.10.170421", 
		"link" : "https://dl.dropboxusercontent.com/s/34hypqvw6mbpp9d/Installation.apk",
		"platform" : "android",
	},
	{ 
		"version" : "1.10.170417", 
		"link" : "https://dl.dropboxusercontent.com/s/t7252fhwfpaa2ys/manifest.plist", 
		"platform" : "ios",
	},
	{ 
		"version" : "1.10.170417", 
		"link" : "https://dl.dropboxusercontent.com/s/94yths3oq1ujffq/Installation.apk",
		"platform" : "android",
	},
	{ 
		"version" : "1.01.170404", 
		"link" : "https://dl.dropboxusercontent.com/s/m5hvx2jitnxlsiy/manifest.plist", 
		"platform" : "ios",
	},
	{ 
		"version" : "1.01.170330", 
		"link" : "https://dl.dropboxusercontent.com/s/ifzlwbacwmyiqmv/installation_0330.apk",
		"platform" : "android",
	},
	{ 
		"version" : "1.00.170120", 
		"link" : "https://dl.dropboxusercontent.com/s/nj5i18im3j2ma3s/manifest.plist", 
		"platform" : "ios",
	},
	{ 
		"version" : "1.00.170120", 
		"link" : "https://dl.dropboxusercontent.com/s/fntlxg2tdq5g590/Wisenet_Installation.v1.00.170120.apk",
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
		"version" : "0.30.161230", 
		"link" : "https://dl.dropboxusercontent.com/s/skxjrekzac5u0iq/manifest.plist", 
		"platform" : "ios",
	},
	{ 
		"version" : "0.30.161230", 
		"link" : "https://dl.dropboxusercontent.com/s/qemaoibcwjnl6u1/Wisenet_Installation.v0.30.161230.apk",
		"platform" : "android",
	},
]);

module.exports = InstallationModel;