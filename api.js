var express = require("express");
var bodyparser = require("body-parser");
var mongojs = require("mongojs");
var stringSimilarity = require("string-similarity");
var jsonparser = bodyparser.json();
var api = express();

RegExp.quote = function(str) {
    return (str+'').replace(/[.?*+^$[\]\\(){}|-]/g, "\\$&");
};

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
var db = mongojs(connection_string, ["wordnet_data", "phrase_data", "phrases", "comments"])

var wordnet = express();
var phrases = express();

wordnet.post('/add', jsonparser, function(req, res) {
	//var db = mongojs(connection_string, ['wordnet_data']);
    db.wordnet_data.insert(req.body);
    res.sendStatus(200);
});

phrases.post('/add', jsonparser, function(req, res) {
	//var db = mongojs(connection_string, ['phrase_data']);
	db.phrase_data.insert(req.body);
	res.sendStatus(200);
})

api.use('/phrases', phrases);
api.use('/wordnet', wordnet);

function filterWords(query, data) {
	var newData = [];
	for(var i = 0; i < data.length; i++) {
		var word = data[i].Synset;
		//console.log(word);
		var delimiter = word.split(",");
		//console.log(delimiter);
		if(delimiter.length > 0) {
			for(var j = 0; j < delimiter.length; j++) {
				if(delimiter[j].toLowerCase() === query.toLowerCase()) {
					newData.push(data[i]);
					break;
				}
			}
		}
	}
	return newData;
}

api.get('/search', function(req, res, next) {
	//var db = mongojs(connection_string, ['phrase_data']);
	var re = RegExp("\\b" + RegExp.quote(req.query.word) + "\\b", 'i')
	//console.log(re);
	db.wordnet_data.find({Synset: {$regex: re}}, {"Database ID": 1, "Synset": 1, "Definition":1}, function(err, docs) {
		if (err) return handleErr(err, res);
		var word = req.query.word;
		//console.log(docs.length)
		var newDocs = filterWords(word, docs);
		//console.log(docs);
	//	console.log(newDocs)
		res.json(newDocs);
	})
	//var re = RegExp("\b" + req.query.word + "\b")
	//db.phrase_data.ensureIndex({Synset:"text"});
	//console.log(req.query.word);
	/*db.phrase_data.find({$text: {$search: req.query.word}}, function(err, docs) {
		if(err) return handleErr(err, res);
		res.json(docs);
	});*/

});

api.get('/search_phrase', function(req, res, next) {
	res.sendStatus(200);
});

api.get('/phrase_count/:db_id', function(req, res, next) {
	db.phrases.find({"Database ID": id}, function(err, docs) {
		if(err) return handleErr(err, res);
		res.send(docs.length);
	})
}) ;

api.get('/:lang/synset/:db_id', function(req, res, next) {
	var id = req.params.db_id;
	var lang = req.params.lang
	//var db = mongojs(connection_string, ['phrase_data']);
	if(lang === 'en') {
		db.wordnet_data.findOne({"Database ID": id}, function(err, docs) {
			if(err) return handleErr(err, res);
			res.json(docs);
		})
	}
});

api.get('/:lang/synset/:db_id/phrase', function(req, res, next){
	var id = req.params.db_id;
	var lang = req.params.lang;
	db.phrases.findOne({"Database ID": id, "lang": lang}, function(err, doc){
		if(err) return handleErr(err, res);
		res.json(doc);
	})
});
api.put('/:lang/synset/:db_id/phrase',jsonparser, function(req, res, next) {
	var id = req.params.db_id;
	var lang = req.params.lang;
	var phrase = req.body;
	//var db = mongojs(connection_string, ['phrase_data']);
		db.phrases.findAndModify({
			query:{"Database ID": id, "lang": lang},
			update: {
				$set: {phrase: phrase.phrase, lang: phrase.lang }
			},
			new: true,
			upsert: true
		}, function(err, doc, lastErrorObject) {
			if(err) return handleErr(err, res);
			res.sendStatus(200);
		});
});


api.post('/:lang/synset/:db_id/comments', jsonparser, function(req, res, next) {

	var id = req.params.db_id;
	var lang = req.params.lang;
	var comment = req.body;
	var temp = db.comments.insert({
		"Database ID": id,
		"lang": lang,
		"text": comment.text,
		"parent": comment.parent,
		"author": comment.author, 
		"date": new Date()
	});
	res.sendStatus(200);
});

api.get('/:lang/synset/:db_id/comments', function(req, res, next){
	var id = req.params.db_id;
	var lang = req.params.lang;
	db.comments.find({"Database ID": id, "lang": lang}, function(err, docs) {
		if(err) return handleErr(err, res);
		res.json(docs);
	});
});

module.exports = api;