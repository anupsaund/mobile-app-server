const
  express     = require('express'),
  router      = express.Router(),
  fs          = require('fs')
  path        = require('path'),
  appRoot     = (path.dirname(require.main.filename || process.mainModule.filename))

/* GET iOS files. */
router.get('/:ipa', function(req, res, next) {
  
  let filename = path.resolve(appRoot + '/../public/files') + "/"+ req.params.ipa

  fs.stat(filename, (err)=>{
    var readStream = fs.createReadStream(filename)

    readStream.on('open', function() {
      readStream.pipe(res)
    })

    readStream.on('error', function(err) {
      res.end(err)
    })
  })

})

module.exports = router