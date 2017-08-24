var express = require('express');
var router = express.Router();

/* GET apk files. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
