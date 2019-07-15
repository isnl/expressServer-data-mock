var express = require('express');
var router = express.Router();
var test = require("../data/text.json");
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.json(test);
});

module.exports = router;
