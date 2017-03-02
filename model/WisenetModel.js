var MPServiceModel = require('./MPServiceModel.js');
var WisenetModel = new MPServiceModel();

WisenetModel.setName("Wisenet Mobile");
WisenetModel.setImageLink("/images/icon_wisenetmobile.png");
WisenetModel.setPage("wisenet");
WisenetModel.setVersion([
	{ 
		"version" : "1.00.170224",
		"option"  : "Improved version",
		"link" : "https://dl.dropboxusercontent.com/s/p1f5ltnd1zwaj4p/manifest.plist", 
		"platform" : "ios",
	},
	{ 
		"version" : "1.00.170224",
		"option"  : "Improved version",
		"link" : "https://dl.dropboxusercontent.com/s/0ujnxvrcg1pozya/Wisenet_mobile_1.00.170224.apk",
		"platform" : "android",
	},
	{ 
		"version" : "1.00.170222",
		"option"  : "Stable",
		"link" : "https://dl.dropboxusercontent.com/s/kwql9vbq0g4ucjt/manifest.plist", 
		"platform" : "ios",
	},
	{ 
		"version" : "1.00.170222",
		"option"  : "Stable",
		"link" : "https://dl.dropboxusercontent.com/s/83a9njtfuofryua/Wisenet_mobile_1.00.170222.apk",
		"platform" : "android",
	},
	{ 
		"version" : "0.96.170214", 
		"link" : "https://dl.dropboxusercontent.com/s/smkrbjsxjigxcp5/manifest.plist", 
		"platform" : "ios",
	},
	{ 
		"version" : "0.96.170214", 
		"link" : "https://dl.dropboxusercontent.com/s/59fefqetaocpyrh/Wisenet_mobile_0.96.170214.apk",
		"platform" : "android",
	},
	{ 
		"version" : "0.95.170207", 
		"link" : "https://dl.dropboxusercontent.com/s/uztsfohtvvj9c4z/manifest.plist", 
		"platform" : "ios",
	},
	{ 
		"version" : "0.95.170207", 
		"link" : "https://dl.dropboxusercontent.com/s/zlsrhbr005o0t7v/Wisenet_mobile_0.95.170207.apk",
		"platform" : "android",
	},
	{ 
		"version" : "0.94.170126", 
		"link" : "https://dl.dropboxusercontent.com/s/cc4rjtel7ordzfl/manifest.plist",
		"platform" : "ios",
	},
	{ 
		"version" : "0.94.170126", 
		"link" : "https://dl.dropboxusercontent.com/s/heqlnkschu5hu6n/Wisenet_mobile_0.94.170126.apk",
		"platform" : "android",
	},
	{ 
		"version" : "0.93.170117", 
		"link" : "https://dl.dropboxusercontent.com/s/ctehvs7znm90mmy/manifest.plist", 
		"platform" : "ios",
	},
	{ 
		"version" : "0.93.170117", 
		"link" : "https://dl.dropboxusercontent.com/s/7qfmb1kfq7hq1xy/Wisenet_mobile_0.93.170117.apk",
		"platform" : "android",
	},
	{ 
		"version" : "0.92.170106", 
		"link" : "https://dl.dropboxusercontent.com/s/152o8kqfa7s91ge/manifest.plist", 
		"platform" : "ios",
	},
	{ 
		"version" : "0.92.170106", 
		"link" : "https://dl.dropboxusercontent.com/s/y519pv5wo0czc2e/Wisenet_mobile_0.9.2.170106.apk",
		"platform" : "android",
	},
	{ 
		"version" : "0.91.161228", 
		"link" : "https://bit.ly/2iC7Ots", 
		"platform" : "ios",
	},
	{ 
		"version" : "0.91.161228", 
		"link" : "http://bit.ly/2id9lTS",
		"platform" : "android",
	},
	
]);

module.exports = WisenetModel;