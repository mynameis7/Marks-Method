(function() {
	angular.module("marks-method", ["ngRoute", "ngMaterial"])
})();

(() => {
	let service = (() => {
		angular.module("marks-method").factory("wordnetApi", wordnetApi);
	});
	wordnetApi.$inject = ["$q","$http"];
	function wordnetApi($q, $http) {
		let _url = "";
		function setBaseUrl(url) {
			_url = url;
		}
		function prependConfig(config) {
			config.url = _url + config.url;
		}
		function search(word) {
			let config = {
				url: "/api/search",
				method: "GET",
				params: {word: word}
			};
			prependConfig(config);
			return $http(config);
		}
		function getSynset(lang, id) {
			let config = {
				url:"/api/"+lang+"/synset/"+id,
				method: "GET",
			};
			prependConfig(config);
			return $http(config);
		}
		function getPhrase(lang, id) {
			let config = {
				url: "/api/" + lang + "/synset/" + id + "/phrase",
				method: "GET"
			}
			prependConfig(config)
			return $http(config);
		}
		function updatePhrase(lang, id, phrase) {
			let config = {
				url:"/api/"+lang+"/synset/"+id+"/phrase",
				method: "PUT",
				headers: {
					'Content-Type': 'application/json'
				},
				data: {
					phrase: phrase,
					lang: lang
				}
			};
			prependConfig(config);
			return $http(config);
		}
		function getAllPhrases() {
			let config = {
				url:"/api/allPhrases",
				method:"GET"
			}
			prependConfig(config);
			return $http(config);
		}
		
		return {
			setBaseUrl: setBaseUrl,
			search: search,
			getSynset: getSynset,
			getPhrase: getPhrase,
			updatePhrase: updatePhrase,
			getAllPhrases: getAllPhrases
		}
	}
	service();
})();

(() => {
	let service = (() => {
		angular.module("marks-method").factory("comments", CommentsService)
	})
	CommentsService.$inject = ["$http"];//, "$interval"];
	function CommentsService($http){//, $interval) {
		var comments = [];
		var formattedComments = [];
		var lang = "";
		var id = "";
		//var updateInterval = 1000 * 60 * 10;
		//var commentsUpdate = $interval(update, updateInterval)

		function clear() {
			comments = [];
			formattedComments = [];
			//$interval.cancel(commentsUpdate);
			lang = "";
			id = "";
			//updateInterval = 1000 * 60 * 10;
		}
		function getAll() {
			return comments;
		}
		function getParsed() {
			processComments();
			return formattedComments;
		}
		function setParams(language, ident) {
			lang = language;
			id = ident;
			update();
			//commentsUpdate = $interval(update, updateInterval);
		}
		function update(ok_callback, fail_callback) {
			$http.get('/api/'+lang+'/synset/'+id+'/comments').then(
				function success(response) {
					comments = response.data
					if(ok_callback) {
						ok_callback(comments);
					}
				}, function error(response) {
					comments = [];
					if(fail_callback) {
						failCallback(comments);
					}
				});
		}
		function postComment(data, callback) {
			var config = {
				url:"/api/"+lang+"/synset/"+id+"/comments",
				method: "POST",
				headers: {
					'Content-Type': 'application/json'
				},
				data: data
			};
			$http(config).then(
				function success() {
					callback();
				});
		}

		function rootComments(comment, index, array) {
			return !comment.parent;
		}
		function childrenOf(comment){
			return function(elem, index, array) {
				if(elem.parent){
					return comment._id === elem.parent
				} else {
					return false;
				}
			}
		}
		function buildChildren(base) {
			base.children = comments.filter(childrenOf(base))
			//console.log(ctrl.comments.filter(childrenOf(base)));
			for(var i = 0; i < base.children.length; i++) {
				//buildChildren(base.children[i]);
				base.children[i].children = buildChildren(base.children[i]);
			}
			return base.children;
		}
		function processComments() {
			formattedComments = comments.filter(rootComments);
			for(var i = 0; i < formattedComments.length; i++) {
				formattedComments[i].children = buildChildren(formattedComments[i]);
			}
			return formattedComments;
		}
		return {
			getComments: getAll,
			getParsed: getParsed,
			postComment: postComment,
			update: update,
			clear: clear,
			setParams: setParams
			/*comments: comments,
			formattedComments: formattedComments*/
		}
	}
	service();
})();
(function() {
	AppCtrl.$inject = ["wordnetApi"];
	function AppCtrl(wordnetApi) {
		var ctrl = this;
		ctrl.currentNavItem = "home";
		wordnetApi.setBaseUrl("https://marksmethod-mynameis7.rhcloud.com")

	}
	angular.module("marks-method").controller("AppCtrl", AppCtrl);
})();

(() => {
	let component = (() => {
		angular.module("marks-method").component("wordView", {
			controller: wordsController,
			templateUrl: "templates/words.htm",
			controllerAs: "word",
			bindings: {
				synset: "<"
			}
		});
	});


	wordsController.$inject = ["$location", "$routeParams", "comments", "wordnetApi"];
	function wordsController($location, $routeParams, comments, wordnetApi) {
		var ctrl = this;
		ctrl.$onInit = onInit;
		function onInit() {
			ctrl.word = "";
			ctrl.eng_definition = "";
			ctrl.updatePhrase = updatePhrase;
			ctrl.toggleReply = toggleReply;
			//ctrl.forceUpdate = forceUpdate;
			ctrl.comments = comments.comments;
			ctrl.formattedComments = comments.formattedComments;
			ctrl.activeReply = false;
			ctrl.define_link
			var lang = $routeParams.lang;
			var id = $routeParams.db_id
			comments.clear();
			comments.setParams(lang, id);
			console.log(ctrl.synset);
			//ctrl.synset = 
			/*wordnetApi.getSynset(lang, id).then(
							function success(response){
								ctrl.synset = response.data;
								ctrl.eng_definition = ctrl.synset.Definition;
								ctrl.word = ctrl.synset.Synset;
								ctrl.define_link = "https://www.google.com/#safe=active&q=define:" + getSearchWord(ctrl.synset.Synset);

							}).catch(
							function error(response){
								ctrl.eng_definition = "Word not found";
							}
						);*/
			getPhrase("en", id);
			getPhrase("jpn", id);
			comments.update(function(cmts) {
				ctrl.comments = cmts;
				ctrl.formattedComments = comments.getParsed();
			})
		}

		function getPhrase(lang, id) {
			wordnetApi.getPhrase(lang, id).then(
				function success(response){
					if(response.data) {
						if(lang === "en")
							ctrl.phrase = response.data.phrase
						else if(lang === "jpn") {
							ctrl.jp_phrase = response.data.phrase
						}
					}
				}).catch(function error(response) {

				});	
		}
		function updatePhrase(lang, id, phrase) {
			wordnetApi.updatePhrase(lang, id, phrase).then(
							function success(response){
								console.log(response);
							}
							).catch(function error(response){
								alert("Unable to update phrase")
							}
						);
		}
		/*function forceUpdate() {
			comments.update(function(cmnts) {
				ctrl.comments = cmnts;
				ctrl.formattedComments = comments.getParsed();
			})
		}*/
		function getComments() {

			ctrl.comments = comments.getComments();
			ctrl.formattedComments = comments.getParsed();
		}
		function toggleReply() {
			ctrl.activeReply = !ctrl.activeReply;
		}
		
		function getSearchWord(synset) {
			var newData = [];
			var word = synset;
			var delimiter = word.split(",");
			if(delimiter.length > 0) {
				return delimiter[0];
			}
			return "";
		}
	}

	component();
	//angular.module("marks-method").controller("wordsController", wordsController)
})();

(() => {
	let component = (() => {
		angular.module("marks-method").component('commentView', {
			controller: CommentController,
			templateUrl: 'templates/comment.htm',
			controllerAs: 'comment',
			bindings: {
				"comment": "=",
				"full": "="
			}
		});
	});
	CommentController.$inject = ["$http", "$routeParams"]
	function CommentController($http, $routeParams){
		var ctrl = this;
		ctrl.author = "";
		ctrl.text = "";
		ctrl.id = "";
		ctrl.$onInit = onInit;
		ctrl.children = [];
		ctrl.reply = {};
		ctrl.toggleReply = toggleReply;
		ctrl.activeReply = false;
		function onInit() {
			ctrl.author = ctrl.comment.author;
			ctrl.text = ctrl.comment.text;
			ctrl.children = ctrl.comment.children;
			ctrl.id = ctrl.comment._id;
			
		}
		function toggleReply() {
			ctrl.activeReply = !ctrl.activeReply;
		}

	

	}
	component();
})();

(() => {
	let component = (() => {
		angular.module("marks-method").component("replyBox",{
			controller: ReplyController,
			templateUrl: "templates/comment_submit.htm",
			controllerAs: "reply",
			bindings: {
				"parent": "=",
				"showing": "=",
				"full": "="
			}
		})
	})

	ReplyController.$inject = ["$http", "comments"];
	function ReplyController($http, comments) {
		var ctrl = this;
		ctrl.author = "";
		ctrl.text = "";
		ctrl.submit = function() {
			comments.postComment({author: ctrl.author, text: ctrl.text, parent: ctrl.parent}, function(){
				comments.update(function(cmnts) {
					ctrl.full = comments.getParsed();
				})
			});
			/*comments.update(function(cmnts){
				comments.comments = cmnts;
				comments.formattedComments = comments.getParsed();
			});*/
			ctrl.author = "";
			ctrl.text = "";
			ctrl.showing = false;
		}	
	}
	component();
})();

(() => {
	let component = (() => {
		angular.module("marks-method").component('searchView', {
			controller: SearchController,
			templateUrl: 'templates/search.htm',
			controllerAs: 'search'
		});
	});

	SearchController.$inject = ["$location", "$log", "$http", "wordnetApi"];
	function SearchController($location, $log, $http, wordnetApi) {
		var ctrl = this;
		ctrl.$onInit = onInit;
		ctrl.searching = false;
		function onInit() {
			ctrl.word_search = "";
			ctrl.words = [];
		}

		function filterWords(query, data) {
			var newData = [];
			for(var i = 0; i < data.lengt; i++) {
				var word = data[i].Synset;
				var delimiter = word.split(",");
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
		ctrl.findWord = function(synset){
				$location.path('/words/en/' + synset['Database ID']);
		}
		ctrl.updateWordList = function() {
			if(ctrl.word_search === "")
				ctrl.words = [];
			else {
				ctrl.searching = true;
				wordnetApi.search(ctrl.word_search).then(
					function success(response) {
						ctrl.searching = false;
						ctrl.words = response.data;//filterWords(ctrl.word_search, response.data);
					}, function error(response) {
						ctrl.words = [];
					}
				)
			}
		}
	}

	component();

})();

(function() {
	let component = (() => {
		angular.module("marks-method").component("listView", {
			controller: listController,
			templateUrl: "templates/list.htm",
			controllerAs: "list",
			bindings: {
				data: "<"
			}
		});
	});
	listController.$inject = ["$location","wordnetApi"];
	function listController($location, wordnetApi) {
		var ctrl = this;
		ctrl.phrases = [];
		ctrl.langOrder = [];
		ctrl.$onInit = onInit;
		ctrl.click = click;

		function onInit() {
			console.log(ctrl)
			ctrl.phrases = ctrl.data.phrases;
			ctrl.langOrder = ctrl.data.languageOrder;
			/*wordnetApi.getAllPhrases()
			.then(function success(response) {
				ctrl.phrases = response.data.phrases;
				ctrl.langOrder = response.data.languageOrder;
			})
			.catch(function error() {
			});*/
		}
		function click(id, lang) {
			$location.url('words/' + lang + '/' + id);
		}
	}
	component();
})();

(function() {
	angular.module("marks-method").config(function($routeProvider) {
		$routeProvider
		.when("/", {
			template: "<search-view></search-view>",
			title:""
		})
		.when("/search", {
			template: "<search-view></search-view>",
			title: " - Search"
		})
		.when("/words/:lang/:db_id", {
			template: '<word-view synset="$resolve.synset"></word-view>',
			title: "",
			resolve: {
				synset: function($route, wordnetApi) {
					let params = $route.current.params;
					return wordnetApi.getSynset(params.lang, params.db_id).then(function(response) {
						console.log(response.data);
						return response.data;
					})
				}
			}
		})
		.when("/about", {
			templateUrl : "templates/about.htm",
			title: " - About"
		})
		.when("/list", {
			template: '<list-view data="$resolve.allPhrases"></list-view>',
			title: " - List",
			resolve: {
				allPhrases: function(wordnetApi) {
					return wordnetApi.getAllPhrases().then(function(response){
						return response.data;
					})
				},
			}
		})
		.otherwise( {
			template: "<h3>Url Not Found</h3>"
		});
	});
})();

(function() {
	angular.module("marks-method").run(["$rootScope",function($rootScope) {
		$rootScope.$on("$routeChangeSuccess", function(event, current, previous) {
			$rootScope.title = current.title;
			$rootScope.loadingView = false;
		});
		$rootScope.$on("$routeChangeStart", function(event, current, previous) {
		    if (current.$$route && current.$$route.resolve) {
		      // Show a loading message until promises are not resolved
		      $rootScope.loadingView = true;
		    }
		});
	}])
})();

