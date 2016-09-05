(function() {
	angular.module("marks-method", ["ngRoute"])
})();

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

(function() {
	angular.module("marks-method").config(function($routeProvider) {
		$routeProvider
		.when("/", {
			templateUrl : "/static/templates/main.htm",
			controller: "mainController"
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

