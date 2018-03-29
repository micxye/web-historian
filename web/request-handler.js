var path = require('path');
var archive = require('../helpers/archive-helpers');
var httpHelpers = require('./http-helpers');
var fs = require('fs');
// require more modules/folders here!


var sendFileContent = function (response, filename, contentType) {
  fs.readFile(filename, function (err, data) {
    if (err) {
      console.log(err);
      response.writeHead(404);
      response.write('Not Found!');
    } else {
      response.writeHead(200, {
        'Content-Type': contentType
      });
      response.write(data);
    }
    response.end();
  });
};


exports.handleRequest = function (req, res) {
  const { method, url } = req;
  const headers = httpHelpers.headers;
  console.log('method:', method, 'url:', url);
  var statusCode;

  if (method === 'GET') {
    if (url === '/') {
      sendFileContent(res, path.join(__dirname, '..', 'web', 'public', 'index.html'), 'text/html');
    } else if (url === '/styles.css') {
      sendFileContent(res, path.join(__dirname, '..', 'web', 'public', 'styles.css'), 'text/css');
    } else {
      sendFileContent(res, archive.paths.archivedSites + '/' + url, 'text/html');
    }
  } else if (method === 'POST') {
    req.on('data', (chunk) => {
      chunk = chunk.slice(4);
      chunk = chunk + '\n';
      // if (!archive.isUrlInList(chunk, (data) => {
      //   return data;
      // })) {
      //   console.log('working');
      //   sendFileContent(res, path.join(__dirname, '..', 'web', 'public', 'loading.html'), 'text/html');
      // }
      archive.addUrlToList(chunk, (err, data) => {
        if (err) {
          statusCode = 404;
          res.writeHead(statusCode, headers);
          res.end();
        } else {
          statusCode = 302;
          res.writeHead(statusCode, headers);
          res.end(data);
        }
      });
    });
  }
  
  //res.end(archive.paths.list);
};