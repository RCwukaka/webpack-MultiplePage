var express = require('express');
var router = express.Router();

var webTile = '猴子商业统计';
/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', {
		title: webTile,
		pageNav: 'index'
	});
});

router.get('/product', function(req, res, next) {
	res.render('product', {
		title:  webTile,
		pageNav: 'product'
	});
});

router.get('/useCase', function(req, res, next) {
  res.render('useCase', {
    title:  webTile,
    pageNav: 'useCase'
  });
});

module.exports = router;