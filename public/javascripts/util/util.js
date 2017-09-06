function MVCall(url, sucFn, errFn) {
	return $.ajax({
		url : url
	}).done(function(res) {
		console.info(url, "success", res);
		sucFn(res);
	}).fail(function(error) {
		console.info(url, "error", error);
		errFn(error);
	});
};

function actionDown(url, biOS) {
	var reqUrl = biOS ? "itms-services://?action=download-manifest&url=" + url : url;
	console.log("reqUrl : ", reqUrl);
	window.location.href = reqUrl;
}

function randomString(length) {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < length; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
};