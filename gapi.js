var express = require("express");
var request = require("request");
var gapi = express();

gapi.get("/define/:word", function(req, res, next) {
	request("https://glosbe.com/gapi/translate?from=eng&dest=eng&format=json&phrase=" + req.params.word, function(error, response, body) {
			res.json(JSON.parse(body));
		});
});

module.exports = gapi