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