(function() {
	angular.module("marks-method", ["ngRoute"])
})();

(function() {
	function mainController($scope, $location, $log, $http) {
		$scope.word_search = "";
		$scope.words = [];
		$scope.findWord = function(){
			$log.info($scope.word_search);
			$location.path("/words/" + $scope.word_search);
		}
		$scope.updateWordList = function() {
			console.log("word")
		}
	}
	mainController.$inject = ["$scope", "$location", "$log", "$http"];
	angular.module("marks-method").controller("mainController", mainController)

})();

(function() {
	function wordsController($scope, $location, $routeParams, $http) {
		$scope.word = $routeParams.word;
		$scope.eng_definition = "";
		var config = {
			url:"/gapi/define/" + $scope.word,
			method: "GET",
		};
		$http(config).then(
						function success(response){
							$scope.eng_definition = response.data;
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
		.when("/words/:word", {
			templateUrl : "/static/templates/words.htm",
			controller: "wordsController"
		})
		.when("/about", {
			templateUrl : "/static/templates/about.htm"
		})
	});
})()

