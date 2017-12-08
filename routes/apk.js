const
    express   = require('express'),
    router = express.Router(),
    path = require('path'),
    fs = require('fs'),
    appRoot =(path.dirname(require.main.filename || process.mainModule.filename))

/* GET apk file. */
router.get('/:apk', function(req, res, next) {
  res.download(path.resolve(appRoot + '/../public/files') + "/"+ req.params.apk)  
})

module.exports = router