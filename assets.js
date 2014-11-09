var fs = require('fs');
var path = require('path');
var express = require('express');

exports.getStyles = function() {
  if (process.env.NODE_ENV === 'production') {
    return ['/assets/application.css'];
  }

  var styles = ['/assets/normalize.css'];

  var files = fs.readdirSync('styles');
  fs.readdirSync('styles/development').forEach(function(name) {
    files.push('development/' + name);
  });

  files.forEach(function(name) {
    var found = false;
    var ext = path.extname(name);
    if (ext === '.css' || ext === '.scss') {
      if (ext !== '.css') {
        name += '.css';
      }
      for (var i = 0; i < styles.length; i += 1) {
        if (styles[i] === '/assets/' + name) {
          found = true;
          break;
        }
      }
      if (!found) {
        styles.push('/assets/' + name);
      }
    }
  });

  return styles;
};

exports.getScripts = function() {
  if (process.env.NODE_ENV === 'production') {
    return ['/assets/application.js'];
  }

  var scripts = ['/assets/fastclick.js', '/assets/development/react.js', '/assets/jquery-2.1.1.js'];

  var files = fs.readdirSync('scripts');
  fs.readdirSync('scripts/development').forEach(function(name) {
    files.push('development/' + name);
  });

  files.forEach(function(name) {
    var ext = path.extname(name);
    if (ext === '.js' || ext === '.jsx') {
      if (ext !== '.js') {
        name += '.js';
      }
      var found = false;
      for (var i = 0; i < scripts.length; i += 1) {
        if (scripts[i] === '/assets/' + name) {
          found = true;
          break;
        }
      }
      if (!found) {
        scripts.push('/assets/' + name);
      }
    }
  });

  return scripts;
};

exports.config = function(app) {
  if (process.env.NODE_ENV !== 'production') {
    var sass = require('node-sass');
    var reactTools = require('react-tools');

    app.get('/assets/*.css', function(req, res) {
      res.set('Content-Type', 'text/css');
      var name = req.params[0];
      if (path.extname(name) === '.scss') {
        var fullPath = __dirname + '/styles/' + name;
        res.send(sass.renderSync({ file: fullPath }));
      } else {
        res.sendFile(__dirname + '/styles/' + name + '.css');
      }
    });

    app.get('/assets/*.js', function(req, res) {
      res.set('Content-Type', 'application/javascript');
      var name = req.params[0];
      if (path.extname(name) === '.jsx') {
        var fullPath = __dirname + '/scripts/' + name;
        var fileData = fs.readFileSync(fullPath, { encoding: 'utf8' });
        res.send(reactTools.transform(fileData, {}));
      } else {
        res.sendFile(__dirname + '/scripts/' + req.params[0] + '.js');
      }
    });
  }

  app.use('/', express.static(__dirname + '/public'));
};
