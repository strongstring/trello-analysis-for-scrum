var MPServiceModel = require('./MPServiceModel.js');
var SmartCamPlusModel = new MPServiceModel();

SmartCamPlusModel.setName("Wisenet SmartCam+");
SmartCamPlusModel.setImageLink("/images/icon_smartcamPlus.png");
SmartCamPlusModel.setPage("smartcamPlus");
SmartCamPlusModel.setVersion([
	{ 
		"version" : "1.03.170307", 
		"link" : "https://dl.dropboxusercontent.com/s/z5uludaea2f6lc0/manifest.plist", 
		"platform" : "ios",
		"option" : "Stable",
	},
	{ 
		"version" : "1.03.170307", 
		"link" : "https://dl.dropboxusercontent.com/s/3o6n211o80d7ey3/WiseNet%20SmartCam_Android_v.1.03_20170307_WWW.apk",
		"platform" : "android",
		"option" : "Stable",
	},
	{ 
		"version" : "1.01.170302.2", 
		"link" : "https://dl.dropboxusercontent.com/s/8tfosjz8olrdm7k/manifest.plist", 
		"platform" : "ios",
	},
	{ 
		"version" : "1.01.170302", 
		"link" : "https://dl.dropboxusercontent.com/s/ae5utqb0bdgb94b/manifest.plist", 
		"platform" : "ios",
	},
	{ 
		"version" : "1.01.170302", 
		"link" : "https://dl.dropboxusercontent.com/s/ku1qvfrdnvg48jy/argus.apk",
		"platform" : "android",
	},
	{ 
		"version" : "1.01.170302_debug", 
		"link" : "https://dl.dropboxusercontent.com/s/pf6rm19wf1otfua/manifest.plist", 
		"platform" : "ios",
		"option" : "Debug",
	},
	{ 
		"version" : "1.01.170302_debug", 
		"link" : "https://dl.dropboxusercontent.com/s/1da3fl8k89qcajy/argus.apk",
		"platform" : "android",
		"option" : "Debug",
	},
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
]);

module.exports = SmartCamPlusModel;