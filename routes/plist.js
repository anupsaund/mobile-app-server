var express = require('express'),
router = express.Router(),
fs = require('fs'),
path = require('path');

router.get('/:ipa', function(req, res) {
  
  var fileName = path.join(__dirname, '..', 'public/files') + '/' + req.params.ipa;

    fs.readFile(fileName , function(err, data) {
        if (err)
          throw err;
       
      res.set('Content-Type', 'text/plain; charset=utf-8');
      res.send(data);
    })
});

module.exports = router;