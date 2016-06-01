var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Analysis Work' });
});

router.get('/ipolis', function(req, res, next) {
	res.render('ipolis_ota', { title: 'iPOLiS mobile test version Installer' });
});


module.exports = router;
