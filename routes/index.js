var express = require('express');
var router = express.Router();
var url  = require('url');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('adhoc', { title: 'Analysis Work' });
});

router.get('/scrum', function(req, res, next) {
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
	res.render('adhoc', { 
		title: 'Hanwha Techwin Mobile Team ADHOC Service',
	});
});

router.get('/page/:id', function(req, res, next) {
	res.render('page', { 
		title: req.params.id,
	});
});

router.get('/test', function(req, res, next) {
	res.render('test', { title: 'product test page' });
});

router.get('/smartcam', function(req, res, next) {
	res.render('smartcam', { title: 'product test page' });
});

router.get('/smartcamPlus', function(req, res, next) {
	res.render('smartcamPlus', { title: 'product test page' });
});

router.get('/installation', function(req, res, next) {
	res.render('installation', { title: 'product test page' });
});

router.get('/wisenet', function(req, res, next) {
	res.render('wisenet', { title: 'product test page' });
});

router.get('/camera', function(req, res) {
    var query = url.parse(req.url,true).query;
    var hubId = query.hub;
    var chId = query.ch;
    var user = query.user;

    if(hubId && chId && user) {
        console.log("open camera hub id : " + hubId + "ch id : " + chId + "user name : " + user);
        res.render('camera', {
            hub : hubId,
            ch  : chId,
            user : user,
        });
    } else {
        res.send('<br /><br /> Please enter a valid url. <br /><br /> '
            + '/camera?hub=[hubID]&ch=[chID]&user=[userName]');
    }
});

router.get('/viewer', function (req, res) {
    var query = url.parse(req.url,true).query;
    var user = query.user;

    if(user) {
        res.render('viewer', {
            user : user,
        });
    } else {
        res.send('<br /><br /> Please enter a valid url. <br /><br /> '
            + '/viewer?user=[userName]');
    }
});

module.exports = router;
