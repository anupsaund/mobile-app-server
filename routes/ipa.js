var express = require('express'),
router = express.Router(),
fs = require('fs')
path = require('path');

/* GET ios files. */
router.get('/:ipa', function(req, res, next) {
  
  var pwd =(path.dirname(require.main.filename || process.mainModule.filename));
  var filename = path.resolve(appRoot, '/../public/files/') + req.params.ipa;

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
