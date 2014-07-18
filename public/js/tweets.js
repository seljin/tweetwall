angular.module('tweetWall', [])
  .controller('TweetController', ['$scope', '$http', function($scope, $http) {
    $scope.tweets = [];
    var socket = null;

    onTweet = function(data){
      $scope.tweets.push(data);
      console.log(data);
      $scope.$apply();
    };

    $scope.changeHash = function(){
      var hashtag = $scope.hashtag.toLowerCase();

      $scope.tweets = [];
      $http.get('/api/' + hashtag).success(function(){  
        if (socket) {
          socket.disconnect();
          delete socket;
        }
        socket = io.connect('http://localhost:8000/' + hashtag);
        socket.on('tweet', onTweet);
      });
    };
  }]);