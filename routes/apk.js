var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');

/* GET apk files. */
router.get('/:apk', function(req, res, next) {
  var appRoot =(path.dirname(require.main.filename || process.mainModule.filename));
  var filename = path.resolve(appRoot, '/../public/files/') + req.params.apk;

  fs.stat(filename, (err)=>{
    var readStream = fs.createReadStream(filename);

    readStream.on('open', function() {
      readStream.pipe(res);
    });

    readStream.on('error', function(err) {
      res.end(err);
    });
  });
});

module.exports = router;
