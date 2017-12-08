var 
  express       = require('express'),
  router        = express.Router(),
  fs            = require('fs'),
  handlebars    = require('handlebars'),
  fileExt       = require('file-extension'),
  PkgReader     = require('isomorphic-pkg-reader'),
  path          = require('path'),
  underscore    = require('underscore'),
  os            = require('os')

const ipAddress =  underscore
.chain(require('os').networkInterfaces())
.values()
.flatten()
.find(function(iface) {
  return iface.family === 'IPv4' && iface.internal === false
})
.value()
.address

console.log(`Bound to IP: ${ipAddress}`)

router.get('/', function(req, res, next) {
  let dwList = new Array()
  let port = req.app.settings.port

  var appRoot =(path.dirname(require.main.filename || process.mainModule.filename))

  function getFiles() {
    return new Promise(function(resolve, reject) {
      fs.readdir(appRoot + "/../public/files/", (err, files) => { 

        if (true) {
          resolve(files);
        }
        else {
          reject(Error(new Array()))
        }
      })
    })
  }

  function getInfo(filename) {
    return new Promise(function(resolve, reject) {
    
      try { 
      
        let pkgType = fileExt(filename)
        if( pkgType == "apk" || pkgType === "ipa" ){
        
          var reader = new PkgReader(`${appRoot}/../public/files/${filename}`, pkgType, { searchResource: true })
          
          reader.parse(function(err, pkgInfo) {
            if (err){
               return err.stack
            }
            
            let data = {}

            if(pkgType == "apk"){
              data = {
                'apple': false,
                'versionName': pkgInfo.versionName,
                'package': pkgInfo.package,
                'title': pkgInfo.application.label[0],
                'downloadurl': `https://${ipAddress}:${port}/apk/`+path.basename(filename),
                'original_filename': filename,
                'ipaddress': ipAddress,
                'port': port
              }
            }else{
              data = {
                'apple': true,
                'bundleidentifier': pkgInfo.CFBundleIdentifier,
                'bundleversion': pkgInfo.CFBundleVersion,
                'title': pkgInfo.CFBundleDisplayName,
                'subtitle': pkgInfo.CFBundleName,
                'downloadurl': `https://${ipAddress}:${port}/plist/${path.basename(filename)}.plist`,
                'filepath':  `https://${ipAddress}:${port}/ipa/`+path.basename(filename),
                'profile': pkgInfo.mobileProvision.Entitlements['application-identifier'],
                'original_filename': filename,
                'ipaddress': ipAddress,
                'port': port
              }

            }

            resolve(data)        
          })
        }else{
          resolve(new Array())
        } 
   
      }catch(err){
          reject(Error(new Array()))
      }

    })
  }

  const readFiles = async () => {
    let fileList = [],
    dwList = []

    fileList = await getFiles() 

    for(var idx in fileList){
      let pkg = await getInfo(fileList[idx])
      if(pkg.length !=0)
        dwList.push( pkg)
    
    }   
   
    return dwList
  }
  
  readFiles().then((dwList)=>{
    res.render('index', { 'title': 'Mobile App Server', 'list': dwList, 'cerLink': `https://${ipAddress}:${port}/cer/server.crt`})
  })
})

module.exports = router