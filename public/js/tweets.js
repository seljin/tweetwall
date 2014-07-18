var app = angular.module('tweetWall', ['ngRoute']);

app.controller('TweetController', ['$scope', '$location', function($scope, $location) {
  var socket = io.connect('http://localhost:8000/');
  var currentHash = null;
  var param = $location.search() || null;

  $scope.h = param['h'];   
  $scope.tweets = [];

  socket.on('tweet', function(tweet){
    $scope.tweets.unshift(tweet);
    $scope.$apply();
  });

  if ($scope.h){
    socket.emit('track', $scope.h);
    currentHash = $scope.h;
  }

  $scope.changeHash = function(){
    var hashtag = $scope.hashtag.toLowerCase();

    $scope.tweets = [];
    if (currentHash) socket.emit('untrack', currentHash);  
    socket.emit('track', hashtag);
    currentHash = hashtag;
    $scope.shareUrl = $location.absUrl() + '#?h=' + hashtag;
  };
}]);