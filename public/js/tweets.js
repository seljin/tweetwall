angular.module('tweetWall', [])
  .controller('TweetController', ['$scope', '$http', function($scope, $http) {
    $scope.tweets = [];
    
    var socket = io.connect('http://localhost:8000/gaza');
    socket.on('tweet', function(data){
      $scope.tweets.push(data);
      console.log(data);
      $scope.$apply();
    });

    $scope.changeHash = function(){
      $scope.tweets = [];
      $http.get('/api/' + $scope.hashtag);
    };
  }]);