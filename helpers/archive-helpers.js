var fs = require('fs');
var path = require('path');
var _ = require('underscore');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function (pathsObj) {
  _.each(pathsObj, function (path, type) {
    exports.paths[type] = path;
  });
};


// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function (callback) { //should return an array of url's
  // var context = this;
  fs.readFile(this.paths.list, (err, data) => {
    if (err) {
      callback(err);
    }
    //split string (newline ) into array?
    var stringsArray = data.toString().split('\n');
    callback(stringsArray);
  });
};

exports.isUrlInList = function (url, callback) {
  //use readlist of urls to check
  //if this.readlistofURLs includes url 
  //return true
  this.readListOfUrls((stringsArray) => {
    callback(stringsArray.includes(url));
  });

};

exports.addUrlToList = function (url, callback) {
  //use fs append to file
  fs.appendFile(this.paths.list, url, (err) => {
    if (err) {
      callback(err);
    }
    callback(null, url);
  });

};

exports.isUrlArchived = function (url, callback) {   
  fs.stat(this.paths.archivedSites + '/' + url, (err)=> {
    callback(err === null); 
  });
};

exports.downloadUrls = function (urls) {
  for (var i = 0; i < urls.length; i++) {
    fs.writeFile(this.paths.archivedSites + '/' + urls[i], urls[i], function (err) {
      if (err) {
        console.log('error writing file', err);
      } else {
        console.log('writing file succeeded');
      }
    });
  }
};