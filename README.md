# RSAForPostman

## reference
this project is based on [forge Project](https://github.com/digitalbazaar/forge)
## how to build
First you need to install node and git on your pc.
### clone forge and install
```
git clone https://github.com/digitalbazaar/forge.git
cd /path/to/your/dir
npm install
```
### modify configure
modify`webpack.config.js`, replace `umd` with `var`
```javascript
  const bundle = Object.assign({}, common, {
    output: {
      path: path.join(__dirname, 'dist'),
      filename: info.filenameBase + '.js',
      library: info.library || '[name]',
      libraryTarget: info.libraryTarget || 'var'
    }
  });
  if(info.library === null) {
    delete bundle.output.library;
  }
  if(info.libraryTarget === null) {
    delete bundle.output.libraryTarget;
  }

  // optimized and minified bundle
  const minify = Object.assign({}, common, {
    output: {
      path: path.join(__dirname, 'dist'),
      filename: info.filenameBase + '.min.js',
      library: info.library || '[name]',
      libraryTarget: info.libraryTarget || 'var'
    },
    devtool: 'cheap-module-source-map',
    plugins: [
      new webpack.optimize.UglifyJsPlugin({
        sourceMap: true,
        compress: {
          warnings: true
        },
        output: {
          comments: false
        }
        //beautify: true
      })
    ]
  });
```
### repack
```
npm run build
```
then  in `dist` folder, we'll find a file named `forge.js`, that's what we need.
## how to use it
because Postman can not load js file from local disk, so we put `forge.js` on a web server(**url on github seems not work, a local server may works or add a varible `forgeJS` manully**).
### pre-script
```
//download forgeJS from web and set varible
if(!pm.globals.has("forgeJS")){
        pm.sendRequest("https://github.com/loveiset/RSAForPostman/blob/master/forge.js", function (err, res) {
        if (err) {
            console.log(err);}
        else {
            pm.globals.set("forgeJS", res.text());}
})}

eval(postman.getGlobalVariable("forgeJS"));

const public_key = '-----BEGIN PUBLIC KEY-----\n'+
'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDORoOSW2gbHl6s/YmS1jWxb954\n'+
'X/jflZ2dK65oM/Bxii2Iba80IiC9+Sa1phmOVDAk+IVDsPNZ+YJ2Qg0hPmoLSLxe\n'+
'f2A6ySJPl5su8TaGOuVZg1SRyk55bjHymQUnxryD/ml1EmBUaGcrs9FCiVBy38kg\n'+
'eZNbCexucVQxn6OYlwIDAQAB\n'+
'-----END PUBLIC KEY-----'

const private_key = '-----BEGIN PRIVATE KEY-----\n' +
'MIICeAIBADANBgkqhkiG9w0BAQEFAASCAmIwggJeAgEAAoGBAM5Gg5JbaBseXqz9\n' +
'iZLWNbFv3nhf+N+VnZ0rrmgz8HGKLYhtrzQiIL35JrWmGY5UMCT4hUOw81n5gnZC\n' +
'DSE+agtIvF5/YDrJIk+Xmy7xNoY65VmDVJHKTnluMfKZBSfGvIP+aXUSYFRoZyuz\n' +
'0UKJUHLfySB5k1sJ7G5xVDGfo5iXAgMBAAECgYEAk6KQZN4bQt2XsYS9RGUghOCm\n' +
'f81g2NXCu00aROZ3vyvArxaiAVQzzwRWGkjJnb7PvoZJC0vIwKr+HxnjP9nmFufd\n' +
'+0EnBT+imYSzrfZhfGGwyI6EIyy/XcoW5lf0xltx3w9mJicnR9kMzNtZ5mNGPMNn\n' +
'CgAgjvZqnWYb+f6tb/ECQQD0tdpg8ts3puXclPe51my+LbKhEbyFSMzvtMTDCRmO\n' +
'd0jrmZhQomsZacC8+l+2l6WTj5vrhVQlAVUeUJ7kldQNAkEA18q53wor6a4Cv0OL\n' +
'xFzBWXRCMVFfyCWAFQUpTSGrIM/X4Lx30IZCShtvkdh1ky39b9T6lpOjES7MK4Dh\n' +
'xttCMwJAUGBi6DEcm/zvxzIO5DVv5k9wOsNunoC4/4rqjf0xLcA0bV43z1RpxSEd\n' +
'M3UxdvH8aqli10slxjnX0Ws9pWspCQJBALqSncgYzETbXaauqO5a4BUOrphjafPr\n' +
'cGU8NCxrGsFg0p6NdO5G1pOqSvmHdIiPL9t8AjkkZs3Zb0+BvDOpqP8CQQDZhfh4\n' +
'/c/Qzp4szj7+GXTZ1cmGwAuFo2/9uiumUAS3f19EpgoV9u9eyJ4gZPEBDvAjO961\n' +
'kAjdja4DAy4SbCXy\n' +
'-----END PRIVATE KEY-----'

//encrypt text "plaintext"
var publicKey = forge.pki.publicKeyFromPem(public_key);
var encryptedText = forge.util.encode64(publicKey.encrypt("plaintext", 'RSA-OAEP', {
  md: forge.md.sha1.create(),
  mgf1: {
    md: forge.md.sha1.create()
  }
}));
console.log("encrypted text:" + encryptedText);

// decrypt text
var privateKey = forge.pki.privateKeyFromPem(private_key);
var decryptedText = privateKey.decrypt(forge.util.decode64(encryptedText), 'RSA-OAEP', {
  md: forge.md.sha1.create(),
  mgf1: {
    md: forge.md.sha1.create()
  }
});

console.log("dectypted text:" + decryptedText);
```
you can use rsa encrypt in postman now!
## something else
### about web server
if you don't want to use a web server, you an simply create a globle varible named `forgeJS` and copy content in `forge.js` to the value(**postman may be very slow because the file is big**)
### how to delete the varible
because of `forgeJS` varible, it may be very diffcuilt to edit other varible in postman, to solve this, you can delete the `forgeJS` varible
```
pm.globals.unset("forgeJS");
```
### document about RSA encrypt
[https://github.com/digitalbazaar/forge](https://github.com/digitalbazaar/forge)
### ps
this thing is a temporary solution, we all hope postman can support RSA encrypt oneday officially.