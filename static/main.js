(function() {
	angular.module("marks-method", ["ngRoute"])
})();

(function() {
	function mainController($scope, $location, $log) {
		$scope.word = "";
		$scope.findWord = function(){
			$log.info($scope.word);
			$location.path("/words/" + $scope.word);
		}
	}
	mainController.$inject = ["$scope", "$location", "$log"];
	angular.module("marks-method").controller("mainController", mainController)

})();

(function() {
	function wordsController($scope, $location, $routeParams) {
		$scope.word = $routeParams.word;
	}
	wordsController.$inject = ["$scope","$location", "$routeParams"];
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

