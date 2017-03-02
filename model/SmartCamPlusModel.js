var MPServiceModel = require('./MPServiceModel.js');
var SmartCamPlusModel = new MPServiceModel();

SmartCamPlusModel.setName("Wisenet SmartCam+");
SmartCamPlusModel.setImageLink("/images/icon_smartcamPlus.png");
SmartCamPlusModel.setPage("smartcamPlus");
SmartCamPlusModel.setVersion([
	{ 
		"version" : "1.00.170224", 
		"link" : "https://dl.dropboxusercontent.com/s/7mal0z67yylob0m/manifest.plist", 
		"platform" : "ios",
	},
	{ 
		"version" : "1.00.170224", 
		"link" : "https://dl.dropboxusercontent.com/s/c91trfi2ykmxe61/argus.apk",
		"platform" : "android",
	},
	{ 
		"version" : "1.01.170302", 
		"link" : "https://dl.dropboxusercontent.com/s/ae5utqb0bdgb94b/manifest.plist", 
		"platform" : "ios",
		"option" : "Stable",
	},
	{ 
		"version" : "1.01.170302", 
		"link" : "https://dl.dropboxusercontent.com/s/ku1qvfrdnvg48jy/argus.apk",
		"platform" : "android",
		"option" : "Stable",
	},
]);

module.exports = SmartCamPlusModel;