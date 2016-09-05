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
	var re = RegExp("\\b" + req.query.word + "\\b")
	console.log(re);
	db.phrase_data.find({Synset: {$regex: re}}, function(err, docs) {
		if (err) return handleErr(err, res);
		res.json(docs);
	})
	//var re = RegExp("\b" + req.query.word + "\b")
	//db.phrase_data.ensureIndex({Synset:"text"});
	//console.log(req.query.word);
	/*db.phrase_data.find({$text: {$search: req.query.word}}, function(err, docs) {
		if(err) return handleErr(err, res);
		res.json(docs);
	});*/

});

api.get('/:lang/synset/:db_id', function(req, res, next) {
	var id = req.params.db_id;
	var lang = req.params.lang
	var db = mongojs(connection_string, ['phrase_data']);
	if(lang === 'en') {
		db.phrase_data.findOne({"Database ID": id}, function(err, docs) {
			if(err) return handleErr(err, res);
			res.json(docs);
		})
	}
});


module.exports = api;