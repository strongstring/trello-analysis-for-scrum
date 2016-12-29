var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Analysis Work' });
});

router.get('/dashboard', function(req, res, next) {
  res.render('dashboard', { title: 'Analysis Work' });
});

router.get('/ipolis', function(req, res, next) {
	res.render('ipolis_ota', { title: 'iPOLiS mobile test version Installer' });
});

router.get('/comment', function(req, res, next) {
	res.render('comment', { title: 'comment test page' });
});

router.get('/product', function(req, res, next) {
	res.render('product', { title: 'product test page' });
});

router.get('/task', function(req, res, next) {
	res.render('task', { title: 'product test page' });
});

router.get('/dailyc', function(req, res, next) {
	res.render('dailyc', { title: 'product test page' });
});

router.get('/adhoc', function(req, res, next) {
	res.render('adhoc', { title: 'product test page' });
});

router.get('/smartcam', function(req, res, next) {
	res.render('smartcam', { title: 'product test page' });
});

router.get('/installation', function(req, res, next) {
	res.render('installation', { title: 'product test page' });
});

// router.get('/wisenet', function(req, res, next) {
// 	res.render('wisenet', { title: 'product test page' });
// });

module.exports = router;
