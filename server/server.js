const HTTPS_PORT = 8443;
const fs = require('fs');
const https = require('https');
const WebSocket = require('ws');
const WebSocketServer = WebSocket.Server;
const puppeteer = require('puppeteer');
const robot = require("robotjs");

const serverConfig = {
	key: fs.readFileSync('server/localhost.key'),
	cert: fs.readFileSync('server/localhost.crt'),
};

const handleRequest = function(request, response) {
	console.log('request received: ' + request.url);

	if(request.url === '/') {
		response.writeHead(200, {'Content-Type': 'text/html'});
		response.end(fs.readFileSync('client/index.html'));
	} else if(request.url === '/sender') {
		response.writeHead(200, {'Content-Type': 'text/html'});
		response.end(fs.readFileSync('client/sender.html'));
	}
};

const httpsServer = https.createServer(serverConfig, handleRequest);
httpsServer.listen(HTTPS_PORT, '0.0.0.0');

const wss = new WebSocketServer({server: httpsServer});

wss.on('connection', function(ws) {
	ws.on('message', function(message) {
		console.log('received: %s', message);
		
		var data = JSON.parse(message);
		if(data.command){
			eval(data.command);
			return;
		}
		
		wss.clients.forEach(function(client) {
			if(client.readyState === WebSocket.OPEN)
				client.send(message);
		});
	});
});

async function start(){
	const browser = await puppeteer.launch({args: ['--remote-debugging-port=9222', '--use-fake-ui-for-media-stream']});
	const page = await browser.newPage();
	await page.goto('https://localhost:' + HTTPS_PORT + '/sender');
	console.log('Server running. Visit https://localhost:' + HTTPS_PORT);
}

start();
