var robot = require("robotjs");
var http = require('http');
var url = require('url');

http.createServer(function (req, res) {
	var parts = url.parse(req.url, true);
	var command = parts.query.command;
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Request-Method', '*');
	res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
	res.setHeader('Access-Control-Allow-Headers', '*');
	if ( req.method === 'OPTIONS' ) {
		res.writeHead(200);
		res.end();
		return;
	}
	
	res.writeHead(200, {'Content-Type': 'text/plain'});
	try {
		eval(command)
	} catch(e) {
		res.end("FAIL: " + command);
		return;
	}
	res.end("SUCCESS: " + command);
}).listen(8080, '10.2.3.40');