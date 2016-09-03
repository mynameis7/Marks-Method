var express = require("express");
var bodyparser = require("body-parser");
var mongojs = require("mongojs");
var jsonparser = bodyparser.json();
var api = express();

var connection_string = '127.0.0.1:27017/marksmethod';
// if OPENSHIFT env variables are present, use the available connection info:
if(process.env.OPENSHIFT_MONGODB_DB_PASSWORD){
    connection_string = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
    process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
    process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
    process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
    process.env.OPENSHIFT_APP_NAME;
}


function handleErr(err, res) {
	console.log(err);
	res.sendStatus(500);
}

/*
var wordnet = express();
var phrases = express();

wordnet.post('/add', jsonparser, function(req, res) {
	var db = mongojs(connection_string, ['wordnet_data']);
    db.wordnet_data.insert(req.body);
    res.sendStatus(200);
});

phrases.post('/add', jsonparser, function(req, res) {
	var db = mongojs(connection_string, ['phrase_data']);
	db.phrase_data.insert(req.body);
	res.sendStatus(200);
})

api.use('/phrases', phrases);
api.use('/wordnet', wordnet);
*/

api.get('/search', function(req, res, next) {
	var db = mongojs(connection_string, ['phrase_data']);
	var re = RegExp("\b" + req.query.word + "\b")

	db.phrase_data.find({$where: function() { return (this.Synset.search(re) >= 0)}}, function(err, docs) {
		if(err) return handleErr(err, res);
		res.json(docs);
	});

});


module.exports = api;