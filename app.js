var env = process.env;
var path = require('path');
var express = require('express');
var main = express();
var api = require('./api.js');
var gapi = require('./gapi.js');

main.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
main.get('/', function(req, res, next) {
	res.sendFile(path.resolve('./static/index.html'));
});
main.get('/health', function(req, res, next) {
	res.sendStatus(200); // equivalent to res.status(200).send('OK')  
});
main.use('/static', express.static('static'));
main.use('/bower', express.static('bower_components'));
main.use('/api', api);
main.use('/gapi', gapi);
main.listen(env.NODE_PORT || 3000, env.NODE_IP || 'localhost', function () {
		console.log('Application worker ${process.pid} started...');
});
