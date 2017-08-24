var express = require('express'),
router = express.Router(),
fs = require('fs');

/* GET ios files. */
router.get('/:ipa', function(req, res, next) {
  
  var filename = req.params.ipa;
  filename = './public/files/'+filename;
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
