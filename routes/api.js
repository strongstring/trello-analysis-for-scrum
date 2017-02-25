var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

var data = [
	  {id : 1, author: "Pete Hunt", text : "This is one comment"},
	  {id : 2, author: "Jordan", text : "This is *another* comment"},
	  {id : 3, author: "Jordan", text : "This is *another* comment"},
	  {id : 4, author: "Jordan", text : "This is *another* comment"},
	  {id : 5, author: "Jordan", text : "This is *another* comment"},
	];

router.get('/comments', function(req, res, next) {
	// console.log(req.param('data'));
  res.send(data);
});

router.post('/comments', function(req, res, next) {
	console.log(req.body);
	data = data.concat([req.body]);
	res.send(data);
});

router.get('/product', function(req, res, next) {
	res.send(product);
});

var product = [
  {category: 'Sporting Goods', price: '$49.99', stocked: true, name: 'Football'},
  {category: 'Sporting Goods', price: '$9.99', stocked: true, name: 'Baseball'},
  {category: 'Sporting Goods', price: '$29.99', stocked: false, name: 'Basketball'},
  {category: 'Electronics', price: '$99.99', stocked: true, name: 'iPod Touch'},
  {category: 'Electronics', price: '$399.99', stocked: false, name: 'iPhone 5'},
  {category: 'Electronics', price: '$199.99', stocked: true, name: 'Nexus 7'}
];

router.post('/product', function(req, res, next) {
	console.log(req.body);
	product = product.concat([req.body]);
	res.send(data);
});

var BOARD = [
  {
    "id" : "I02GmIoD",
    "name" : "COMMON" 
  }, {
    "id" : "3UZJ3kPG",
    "name" : "iPOLiS mobile"
  }, {
    "id" : "g0DBnhdi",
    "name" : "SSM mobile"
  }, {
    "id" : "nisQ181R",
    "name" : "SmartCam mobile"
  }, {
    "id" : "duBw0VfK",
    "name" : "WiseNet mobile"
  }, {
    "id" : "u6SqfXJ9",
    "name" : "Argus"
  },
];

router.get('/mobile/board', function(req, res, next) {
	res.send(BOARD);
});














var VersionManagerHeader = require("../model/VersionManager.js");

var router = express.Router();
var VersionManager = new VersionManagerHeader();

var ERROR = {
  "404" : {
    errorCode : 404,
    errorMessage : "not found",
  }
}

router.get('/serviceList', function(req, res, next) {
  var data = VersionManager.getServiceList();
  res.send(data);
});

module.exports = router;
