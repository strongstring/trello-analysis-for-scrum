(function() {
  'use strict';

//   angular.module('MyApp').directive('ngFocusOut', function( $timeout ) {
//     return function( $scope, elem, attrs ) {
//         $scope.$watch(attrs.ngFocusOut, function( newval ) {
//             if ( newval ) {
//                 $timeout(function() {
//                     elem[0].focusout();
//                 }, 0, false);
//             }
//         });
//     };
// });

  angular.module('MyApp',['ngMaterial', 'ngMessages'])
      .directive('focusOut', function( $timeout ) {
        return function( $scope, elem, attrs ) {
            $scope.$watch(attrs.focusOut, function( newval ) {
                if ( newval ) {
                    $timeout(function() {
                        elem[0].focusout();
                    }, 0, false);
                }
            });
        };
    });

    angular.module('MyApp',['ngMaterial', 'ngMessages'])
    .controller('AppCtrl', function($scope) {
      //$mdLockedState
      this.topDirections = ['left', 'up'];
      this.bottomDirections = ['down', 'right'];

      this.isOpen = false;

      this.availableModes = ['md-fling', 'md-scale'];
      this.selectedMode = 'md-fling';

      this.selectedDirection = 'left';

      $scope.isOOpen = false;
      $scope.demo = {
        isOpen: false,
        count: 0,
        selectedDirection: 'left'
      };

      // $scope.isOpen = false;
      $scope.isOpen = function(message) {
        console.log("hi");
        if(message !== undefined) {
          return false;
        } else {
          return true;
        }
      }

      $scope.them = function(event) {
        console.log(event);
        console.log($scope.demo.count);
        // event.preventDefault();
        return true;
      }


    });
})();


/**
Copyright 2016 Google Inc. All Rights Reserved. 
Use of this source code is governed by an MIT-style license that can be in foundin the LICENSE file at http://material.angularjs.org/license.
**/