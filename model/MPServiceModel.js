function MPServiceModel() {
	this.name = "";
	this.version = [];
	this.imageLink = "";
	this.page = "";
};

MPServiceModel.prototype = {
	setName : function(name) {
		console.log("MPServiceModel Name Change " + this.name + " -> " + name);
		this.name = name;
	},
	getName : function() {
		return this.name;
	},
	setVersion : function(version) {
		console.log("MPServiceModel Version Change " + this.version + " -> " + version);
		this.version = version;
	},
	getLatestVersion : function() {
		var versions = this.version.slice();
		var length = versions.length;

		if(length === 0) return {};

		var result = {}, iOSLatestVersion, AOSLatestVersion, biOSFound = false, bAOSFound = false;
		for(var i = length-1; i >= 0; i--) {
			if(biOSFound && bAOSFound) {
				break;
			}

			var version = versions[i];

			if(version !== undefined && version.option === "Stable") {
				if(version.platform === "ios") {
					iOSLatestVersion = version;
					biOSFound = true;
					result["ios"] = iOSLatestVersion;
					console.log("iOS");
				} else {
					AOSLatestVersion = version;
					bAOSFound = true;
					result["android"] = AOSLatestVersion;
				}
			}
		}

		return result;
	},
	getVersion : function() {
		return this.version;
	},
	setImageLink : function(link) {
		console.log("MPServiceModel ImageLink Change " + this.imageLink + " -> " + link);
		this.imageLink = link;
	},
	getImageLink : function() {
		return this.imageLink;
	},
	setPage : function(page) {
		console.log("MPServiceModel page Change " + this.page + " -> " + page);
		this.page = page;
	},
	getPage : function() {
		return this.page;
	}
};

module.exports = MPServiceModel;