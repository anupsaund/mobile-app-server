var express = require('express');
var router = express.Router();
var dir = require('node-dir');
var fs = require('fs');
var handlebars = require('handlebars');
var fileExt = require('file-extension');
var PkgReader = require('isomorphic-pkg-reader');
var path = require('path');
var underscore = require('underscore');
var os = require('os');

var ipAddress =  underscore
.chain(require('os').networkInterfaces())
.values()
.flatten()
.find(function(iface) {
  return iface.family === 'IPv4' && iface.internal === false;
})
.value()
.address;

/* GET home page. */
router.get('/', function(req, res, next) {
  
  let dwList = new Array();
  let port = req.app.settings.port;

  var appRoot =(path.dirname(require.main.filename || process.mainModule.filename));

  dir.readFiles(appRoot +"/../public/files/", {
    match: /.*\.(ipa|apk)/,
    exclude: /^\./
    }, (err, content, filename, next) => {
        if (err) throw err;

        let pkgType = fileExt(filename);

        fs.open(filename, 'r', (err, fd) => {
          if (err) throw err;

          var reader = new PkgReader(filename, pkgType, { searchResource: true });
          
          reader.parse(function(err, pkgInfo) {
            if (err) {
              return err.stack;
            }

            let data = {};

            if(pkgType == "apk"){
              data = {
                'apple': false,
                'versionName': pkgInfo.versionName,
                'package': pkgInfo.package,
                'title': pkgInfo.application.label[0],
                'downloadurl': `https://${ipAddress}:${port}/apk/`+path.basename(filename),
                'ipaddress': ipAddress,
                'port': port
              }
              next();
            }else{
              data = {
                'apple': true,
                'bundleidentifier': pkgInfo.CFBundleIdentifier,
                'bundleversion': pkgInfo.CFBundleVersion,
                'title': pkgInfo.CFBundleDisplayName,
                'subtitle': pkgInfo.CFBundleName,
                'downloadurl': `https://${ipAddress}:${port}/plist/`+pkgInfo.CFBundleDisplayName+`.plist`,
                'filepath':  `https://${ipAddress}:${port}/ipa/`+path.basename(filename),
                'profile': pkgInfo.mobileProvision.Entitlements['application-identifier'],
                'ipaddress': ipAddress,
                'port': port
              }

              fs.readFile(appRoot +"/../views/plist.hbs", 'utf-8', (error, source) =>{
                let template = handlebars.compile(source);
                let html = template(data);
  
                  fs.writeFile(appRoot + "/../public/files/" + pkgInfo.CFBundleDisplayName + ".plist", html, (err) => {
                    if (err) throw err;
                    console.log('plist written');
                    next();
                  });
              });
            }

            dwList.push(data);
            
          });
        });
    },
    function(err, files){
        if (err) throw err;
        //console.log('finished reading files:',files);
        
        res.render('index', { 'title': 'Mobile App Server', 'list': dwList, 'cerLink': `https://${ipAddress}:${port}/cer/server.crt`});
    });


});

module.exports = router;
