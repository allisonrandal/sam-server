var http = require('http');
var fs = require('fs');

function parseRequest(path) {
  var tuple;

  if (path == '/sam.html') {
    tuple = ['static', '/home/ubuntu/sam-server/services/http/public/sam.html', 'text/html'];
  }
  else if (path == '/state.json') {
    tuple = ['static', '/home/ubuntu/sam-server/services/http/public/state.json', 'application/json'];
  }
  else {
    tuple = ['error', "No match for request: " + path];
  }

  return tuple;
}

http.createServer(function (request, response) {
  var action = parseRequest(request.url);
  if ( !action || action[0] == 'error') {
    response.writeHead(500, {'Content-Type':'text/plain'});
    response.end('internal error: ' + action[1]);
  }
  else {
    var filepath = action[1];
    var filetype = action[2];

    fs.readFile(filepath, function (err, data) {
     if (err) {
 	response.writeHead(500, {'Content-Type':'text/plain'});
 	response.end('internal error: ' + err);
      } else {
	response.writeHead(200, {'Content-Type': filetype});
	response.end(data, 'utf-8');
      }
    });
  }
}).listen(8080, "10.0.3.36");

console.log('Server running at http://10.0.3.36:8080/');
