var express = require("express");
var api = express();

api.get('/search', function(req, res, next) {
	console.log(req.query.word);
	res.send(200);
});

module.exports = api;