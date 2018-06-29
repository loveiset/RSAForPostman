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
because Postman can not load js file from local disk, so we put `forge.js` on a web server.
### pre-script
```
var jscontent = pm.globals.get("forgeJS");
if(!jscontent || jscontent === ""){ 
    pm.sendRequest("http://web/path/to/forge.js", function (err, res) {
        if (err) {
        console.log(err);
    } else {
        console.log(res.text());
        pm.globals.set("forgeJS", res.text());
    }
})}
eval(postman.getGlobalVariable("forgeJS"));
```
you can use rsa encrypt in postman now!
