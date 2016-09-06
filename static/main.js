(function() {
	angular.module("marks-method", ["ngRoute", "ngMaterial"])
})();

(function() {
	function AppCtrl() {
		var ctrl = this;
	}
	angular.module("marks-method").controller("AppCtrl", AppCtrl);
})();
/*
(function() {
	function mainController($scope, $location, $log, $http) {
		$scope.word_search = "";
		$scope.words = [];
		$scope.findWord = function(synset){
			$log.info(synset);
			$location.path('/words/en/' + synset['Database ID']);
		}
		$scope.updateWordList = function() {
			if($scope.word_search === "")
				$scope.words = [];
			else {
				var config = {
					url:"/api/search",
					method: "GET",
					params: {word: $scope.word_search}
				};
				$http(config).then(
					function success(response) {
						$scope.words = response.data;
					}, function error(response) {
						$scope.words = [];
					}
				)
			}
		}
	}
	mainController.$inject = ["$scope", "$location", "$log", "$http"];
	angular.module("marks-method").controller("mainController", mainController)

})();
*/
(function() {
	function wordsController($scope, $location, $routeParams, $http) {
		$scope.word = $routeParams.db_id;
		$scope.eng_definition = "";
		$scope.synset = {};
		var lang = $routeParams.lang;
		var id = $routeParams.db_id

		var config = {
			url:"/api/"+lang+"/synset/"+id,
			method: "GET",
		};
		$http(config).then(
						function success(response){
							console.log(response.data)
							$scope.synset = response.data;
							$scope.eng_definition = $scope.synset.Definition;
							$scope.word = $scope.synset.Synset;
						}
						, function error(response){
							$scope.eng_definition = "Word not found";
						}
					);
	}
	wordsController.$inject = ["$scope","$location", "$routeParams", "$http"];
	angular.module("marks-method").controller("wordsController", wordsController)
})();

(() => {
	let component = (() => {
		angular.module("marks-method").component('searchView', {
			controller: SearchController,
			templateUrl: '/static/templates/main.htm',
			controllerAs: 'search'
		});
	});

	SearchController.$inject = ["$location", "$log", "$http"];
	function SearchController($location, $log, $http) {
		var ctrl = this;
		ctrl.$onInit = onInit;
		function onInit() {
			// do set up here
			ctrl.word_search = "";
			ctrl.words = [];
		}
		ctrl.findWord = function(synset){
				$log.info(synset);
				$location.path('/words/en/' + synset['Database ID']);
		}
		ctrl.updateWordList = function() {
			if(ctrl.word_search === "")
				ctrl.words = [];
			else {
				var config = {
					url:"/api/search",
					method: "GET",
					params: {word: ctrl.word_search}
				};
				$http(config).then(
					function success(response) {
						ctrl.words = response.data;
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
	angular.module("marks-method").config(function($routeProvider) {
		$routeProvider
		.when("/", {
			// templateUrl : "/static/templates/main.htm",
			// controller: "mainController"
			template: "<search-view />"
		})
		.when("/words/:lang/:db_id", {
			templateUrl : "/static/templates/words.htm",
			controller: "wordsController"
		})
		.when("/about", {
			templateUrl : "/static/templates/about.htm"
		})
		.otherwise( {
			template: "<h3>Url Not Found</h3>"
		})
	});
})()

