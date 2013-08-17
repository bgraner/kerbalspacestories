'use strict';

angular.module('KerbalSpaceStoriesApp', ['firebase'])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      }).when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginController'
      }).when('/signup', {
        templateUrl: 'views/signup.html',
        controller: 'LoginController'
      }).when('/story/:storyId', {
        templateUrl: 'views/story.html',
        controller: 'StoryCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
