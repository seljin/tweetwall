var app = angular.module('tweetWall', []);

// app.config(function ($routeProvider) {
//   $routeProvider
//     .when('/:hashtag',
//     {
//       templateUrl: 'index.html',
//       controller: 'TweetController'
//     }
//   )
// });

app.controller('TweetController', ['$scope', function($scope, $routeParams) {
  $scope.tweets = [];
  var socket = io.connect('http://localhost:8000/');
  var currentHash = null;

  console.log($routeParams);

  socket.on('tweet', function(tweet){
    $scope.tweets.unshift(tweet);
    console.log($scope.tweets);
    $scope.$apply();
  });

  $scope.changeHash = function(){
    var hashtag = $scope.hashtag.toLowerCase();

    $scope.tweets = [];
    if (currentHash) socket.emit('untrack', currentHash);  
    socket.emit('track', hashtag);
    currentHash = hashtag;
  };
}]);