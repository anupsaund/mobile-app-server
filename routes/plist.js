var express = require('express'),
router = express.Router(),
fs = require('fs'),
path = require('path'),
appRoot =(path.dirname(require.main.filename || process.mainModule.filename));

router.get('/:plist', function(req, res) {
  
  var filename = path.resolve(appRoot + '/../public/files') + "/"+ req.params.plist;

    fs.readFile(fileName , function(err, data) {
        if (err)
          throw err;
       
      res.set('Content-Type', 'text/plain; charset=utf-8');
      res.send(data);
    })
});

module.exports = router;
