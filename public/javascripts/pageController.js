/*
 * ios, android, pc
 */
var browserPlatform = "android";

function createLegacyRow(version, option, iOSLink, AOSLink) {
	var target = $('.legacy-boarder');

	var contentString = "";

	if(option === undefined) {
		contentString = '<div class="legacy-link"> \
			<p class="legacy-label" style="line-height: 40px;">' + version; '</p>';
	} else {
		contentString = '<div class="legacy-link"> \
			<p class="legacy-label">' + version + ' <br /> ( ' + option + ' )</p>';
	}

	if(iOSLink === undefined) {
		contentString += '<p class="legacy-btn" style="opacity: 0.3">iOS</p>';
	} else {
		contentString += ' <a href="itms-services://?action=download-manifest&url=' + iOSLink + '"> \
											   <p class="legacy-btn">iOS</p> \
											 </a>';
	}

	if(AOSLink === undefined) {
		contentString += '<p class="legacy-btn" style="opacity: 0.3">Android</p>';
	} else {
		contentString += '<a href="' + AOSLink + '"> \
												<p class="legacy-btn" onClick="actionDown(\'' + AOSLink + '\', false)">Android</p> \
											</a>' ;
	}

	contentString += '</div>';

	var content = $(contentString);

	target.append(content);
}

function createTogle(appName, imageUrl) {
	$('.app-toggle .app-img').css('background-image', 'url("' + imageUrl + '")');
	$('.app-toggle .app-name').html(appName);
}

function createLatestRow(appName, imageUrl, iOSLinkObj, AOSLinkObj) {
	var target = $('.latest-app-boarder');
	var imgTarget = $('.latest-app-boarder div img');
	var nameTarget = $('.latest-app-boarder div .app-name');

	console.log(AOSLinkObj);

	var imageLength = imgTarget.length;
	for(var i = 0; i < imageLength; i++) {
		$('.latest-app-boarder div img:eq('+i+')').attr('src', imageUrl);
		$('.latest-app-boarder div .app-name:eq('+i+')').html(appName);
	}

	if($('.latest-app-boarder div.ios').length > 0) {
		$('.latest-app-boarder div.ios a').attr('href', "itms-services://?action=download-manifest&url=" + iOSLinkObj.link); 
		$('.latest-app-boarder div.ios .app-version').html(iOSLinkObj.version);
	} 

	if($('.latest-app-boarder div.android').length > 0) {
		$('.latest-app-boarder div.android').attr('onClick', "actionDown('" + AOSLinkObj.link + "', false)");
		$('.latest-app-boarder div.android .app-version').html(AOSLinkObj.version);
	}
}

function loadLegacyRow() {

	var currentUrl = window.location.href;
	var serviceToken = currentUrl.split("/");
	var service = serviceToken[serviceToken.length - 1];

	var target = $('.legacy-boarder div.legacy-link');

	if(target.length === 0) {
		if($('.legacy-header div.glyphicon').hasClass('glyphicon-menu-up')) {
			$('.legacy-header div.glyphicon').removeClass('glyphicon-menu-up');
			$('.legacy-header div.glyphicon').addClass('glyphicon-menu-down');
		}

		MVCall('/api/getServiceLink/' + service, function(res) {
			var linkList = res;
			var length = linkList.length;

			if(length === 0) {
				return;
			}

			var convertedList = {};
			for(var i = 0; i < length; i++) {
				var link = linkList[i];

				if(convertedList[link.version] === undefined) {
					convertedList[link.version] = {};
				}
				convertedList[link.version][link.platform] = link.link;

				if(link.option !== undefined) {
					convertedList[link.version]['option'] = link.option;
				}
			}

			// console.log("convertedList", convertedList);

			for(version in convertedList) {
				var linkObj = convertedList[version];
				createLegacyRow(version, linkObj.option, linkObj.ios, linkObj.android);
			}


		}, function(error) {
			console.log(error);
		});
	} else {

		var legacyBoard = $('.legacy-boarder');		
		
		legacyBoard.empty();
		legacyBoard.append($('<div class="legacy-header" onClick="loadLegacyRow()"> \
												    Legacy version \
												    <div class="glyphicon glyphicon-menu-up"></div> \
												  </div>'));
	}
}

function initPage() {
	var currentUrl = window.location.href;
	var serviceToken = currentUrl.split("/");
	var service = serviceToken[serviceToken.length - 1];

	MVCall('/api/getLateVersion/' + service, function(res) {
		// createTogle(res.name, res.imageUrl);
		createLatestRow(res.name, res.imageUrl, res.link.ios, res.link.android);
	}, function(error) {
		console.log(error);
	});
}

$(document).ready(function() {
	var pcFilter = "win16|win32|win64|mac|macintel";
	var macFilter = "iphone|ipad";
 
    if( navigator.platform  ){
        if( pcFilter.indexOf(navigator.platform.toLowerCase())<0 ){
            if( macFilter.indexOf(navigator.platform.toLowerCase()) < 0) {
            	browserPlatform = "android";
            } else {
            	browserPlatform = "ios";
            }
        }else{
            browserPlatform = "pc";
        }
    }

    console.log("Current Browser Platform : ", browserPlatform);

	initPage();
});