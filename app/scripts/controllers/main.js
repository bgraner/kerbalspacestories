'use strict';


var application = angular.module('KerbalSpaceStoriesApp');

application.controller('MainCtrl', ["$scope", "$rootScope", "angularFireCollection", "angularFireAuth", function($scope, $rootScope, angularFireCollection, angularFireAuth) {
    var url = "https://kerbalspacestories.firebaseio.com/stories";

    var ref = new Firebase(url);
    $scope.stories = angularFireCollection(ref.limit(10));

    console.log($scope.stories);

    // Add a story based from this user
  	$scope.addStory = function() {

  		// Check that we have a user object - create a new story if we do otherwise display an error message
  		$scope.stories.add({
            name: $scope.user.email, id: $scope.user.id, storyDetails: $scope.storyDetails
          });
  	};

  	// Listen to the 'login' events, capture the user on this controller's scope
  	$scope.$on("angularFireAuth:login", function(evt, user) {
  		// User logged in.
  		$scope.user = user;

  		// Force this controller to reapply the $scope (as we now have the currently logged in user object)
  		$scope.$apply();
    });

  	// Listen to 'logout' events, remove the user from this controller's scope
	$scope.$on("angularFireAuth:logout", function(evt) {
		// User logged out.
		$scope.user = null;

		// Force this controller to reapply the $scope (as user has now logged out)
		$scope.$apply();
	});

	// Listen to error's logging in, don't know what to do with it though
	$scope.$on("angularFireAuth:error", function(evt, err) {
		// There was an error during authentication.
	});
}]);

application.controller('StoryCtrl', ["$scope", "$rootScope", "$routeParams", "angularFireCollection", "angularFireAuth", function($scope, $rootScope, $routeParams, angularFireCollection, angularFireAuth) {
    
    $scope.storyId = $routeParams.storyId;

    var url = "https://kerbalspacestories.firebaseio.com/stories/" + $scope.storyId;
    var ref = new Firebase(url);

    var imgFireLocation = new Firebase(url + "/image/" + $scope.storyId);
    imgFireLocation.once('value', function(snap) {
      var payload = snap.val();
      console.log("Data at " + imgFireLocation.toString() + ": " + payload)
      $scope.imgSrc = payload;
    });

    ref.on('value', function(snapshot) {
          $scope.storyDetails = snapshot.val().storyDetails;
    });

    $scope.file_changed = function(element, scope) {

         $scope.$apply( function(scope) {
             var photofile = element.files[0];
             var reader = new FileReader();
             reader.onload = function(e) {
                console.log("This is where we would upload the file");

                var payload = e.target.result;
                console.log(payload);

                imgFireLocation.set(payload, function() {
                  $scope.$apply(function() {
                    $scope.imgSrc = payload;
                  });
                });
             };
             reader.readAsDataURL(photofile);
         });
    };

    // $scope.handleFileSelect = function(evt) {
    //   var f = evt.target.files[0];
    //   var reader = new FileReader();
    //   reader.onload = (function(theFile) {
    //     return function(e) {
    //       var filePayload = e.target.result;
    //       // Generate a location that can't be guessed using the file's contents and a random number
    //       var hash = CryptoJS.SHA256(Math.random() + CryptoJS.SHA256(filePayload));
    //       var f = new Firebase(firebaseRef + 'pano/' + hash + '/filePayload');
    //       spinner.spin(document.getElementById('spin'));
    //       // Set the file payload to Firebase and register an onComplete handler to stop the spinner and show the preview
    //       f.set(filePayload, function() { 
    //         spinner.stop();
    //         document.getElementById("pano").src = e.target.result;
    //         $('#file-upload').hide();
    //         // Update the location bar so the URL can be shared with others
    //         window.location.hash = hash;
    //       });
    //     };
    //   })(f);
    //   reader.readAsDataURL(f);
    // }

    //$scope.stories = angularFireCollection(ref.limit(10));

  	// Listen to the 'login' events, capture the user on this controller's scope
	$scope.$on("angularFireAuth:login", function(evt, user) {
  		// User logged in.
  		$scope.user = user;

  		// Force this controller to reapply the $scope (as we now have the currently logged in user object)
  		$scope.$apply();
    });

  	// Listen to 'logout' events, remove the user from this controller's scope
	$scope.$on("angularFireAuth:logout", function(evt) {
		// User logged out.
		$scope.user = null;

		// Force this controller to reapply the $scope (as user has now logged out)
		$scope.$apply();
	});

	// Listen to error's logging in, don't know what to do with it though
	$scope.$on("angularFireAuth:error", function(evt, err) {
		// There was an error during authentication.
		console.log("Error logging in");
	});
}]);

 application.controller('LoginController', ['$scope', '$rootScope', '$location', 'angularFireAuth', function($scope, $rootScope, $location, angularFireAuth) {
    var url = "https://kerbalspacestories.firebaseio.com";
    angularFireAuth.initialize(url, {name: "user"});

    $scope.login = function() {
      var promise = angularFireAuth.login("password", {email:$scope.username, password:$scope.password});
      promise.then(function () {
          $location.path("/");
      });
    }
    
    $scope.logout = function() {
      angularFireAuth.logout();
    }

    $scope.signup = function(){
		angularFireAuth.createUser($scope.signupEmail, $scope.signupPassword, function(error, user) {
			if (!error) {
				//console.log('User Id: ' + user.id + ', Email: ' + user.email);
        $location.path("/");
			}
		});
    }

    // Listen to the 'login' events, capture the user on this controller's scope
  $scope.$on("angularFireAuth:login", function(evt, user) {
      // User logged in.
      $scope.user = user;

      // Force this controller to reapply the $scope (as we now have the currently logged in user object)
      $scope.$apply();
    });

    // Listen to 'logout' events, remove the user from this controller's scope
  $scope.$on("angularFireAuth:logout", function(evt) {
    // User logged out.
    $scope.user = null;

    // Force this controller to reapply the $scope (as user has now logged out)
    $scope.$apply();
  });

  // Listen to error's logging in, don't know what to do with it though
  $scope.$on("angularFireAuth:error", function(evt, err) {
    // There was an error during authentication.
  });
}]);
