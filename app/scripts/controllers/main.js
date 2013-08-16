'use strict';


var application = angular.module('KerbalSpaceStoriesApp');

application.controller('MainCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });

 application.controller('LoginController', ['$scope', 'angularFireAuth', function($scope, angularFireAuth) {
    var url = "https://kerbalspacestories.firebaseio.com";
    angularFireAuth.initialize(url, {scope: $scope, name: "user"});

    $scope.login = function() {
      angularFireAuth.login("password", {email:$scope.username, password:$scope.password});
    }
    $scope.logout = function() {
      angularFireAuth.logout();
    }
    $scope.addComment = function(e) {
      if (e.keyCode != 13) {
        return;
      }
      if (!$scope.user) {
        alert("You must be logged in to leave a comment");
      } else {
        $scope.comments.add({
          name: $scope.user.name, id: $scope.user.id, body: $scope.newComment
        });
        $scope.newComment = "";
        e.preventDefault();
      }
    }
  }]);
