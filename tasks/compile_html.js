// Run this script from the application root.

process.env.NODE_ENV = 'production';
var assets = require('../assets');
var garnet = require('garnet');
var fs = require('fs');
var template = garnet.compile('../views/application.html');
var output = template({
  styles: assets.getStyles(),
  scripts: assets.getScripts()
});
fs.writeFile('./public/assets/application.html', output, function(err) {
  if (err) {
    console.error(err);
    process.exit(1);
  }

  process.exit(0);
});
