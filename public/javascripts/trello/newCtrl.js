TT.controller('MainCtrl', 
	function($scope, $q, TrelloConnectService, $interval, $mdSidenav, $log) {

		// this.topDirections = ['left', 'up'];
  //   this.bottomDirections = ['down', 'right'];
  //   this.isOpen = false;
  //   this.availableModes = ['md-fling', 'md-scale'];
  //   this.selectedMode = 'md-fling';
  //   this.availableDirections = ['up', 'down', 'left', 'right'];
  //   this.selectedDirection = 'up';

	  var self = this;
		var trello = new TrelloConnectService();

  	self.loading = true;
  	self.isOpen = false;
  	self.board;

  	var imagePath = 'img/list/60.jpeg';
  	self.messages = [
      {
        face : imagePath,
        what: 'Brunch this weekend?',
        who: 'Min Li Chan',
        when: '3:08PM',
        notes: " I'll be in your neighborhood doing errands"
      },
      {
        face : imagePath,
        what: 'Brunch this weekend?',
        who: 'Min Li Chan',
        when: '3:08PM',
        notes: " I'll be in your neighborhood doing errands"
      },
      {
        face : imagePath,
        what: 'Brunch this weekend?',
        who: 'Min Li Chan',
        when: '3:08PM',
        notes: " I'll be in your neighborhood doing errands"
      },
      {
        face : imagePath,
        what: 'Brunch this weekend?',
        who: 'Min Li Chan',
        when: '3:08PM',
        notes: " I'll be in your neighborhood doing errands"
      },
      {
        face : imagePath,
        what: 'Brunch this weekend?',
        who: 'Min Li Chan',
        when: '3:08PM',
        notes: " I'll be in your neighborhood doing errands"
      },
      {
        face : imagePath,
        what: 'Brunch this weekend?',
        who: 'Min Li Chan',
        when: '3:08PM',
        notes: " I'll be in your neighborhood doing errands"
      },
      {
        face : imagePath,
        what: 'Brunch this weekend?',
        who: 'Min Li Chan',
        when: '3:08PM',
        notes: " I'll be in your neighborhood doing errands"
      },
      {
        face : imagePath,
        what: 'Brunch this weekend?',
        who: 'Min Li Chan',
      when: '3:08PM',
        notes: " I'll be in your neighborhood doing errands"
      },
      {
        face : imagePath,
        what: 'Brunch this weekend?',
        who: 'Min Li Chan',
        when: '3:08PM',
        notes: " I'll be in your neighborhood doing errands"
      },
      {
        face : imagePath,
        what: 'Brunch this weekend?',
        who: 'Min Li Chan',
        when: '3:08PM',
        notes: " I'll be in your neighborhood doing errands"
      },
      {
        face : imagePath,
        what: 'Brunch this weekend?',
        who: 'Min Li Chan',
        when: '3:08PM',
        notes: " I'll be in your neighborhood doing errands"
      },
    ];

    this.close = function () {
      // Component lookup should always be available since we are not using `ng-if`
      $mdSidenav('right').close()
        .then(function () {
          $log.debug("close RIGHT is done");
        });
    };
    

  	// $interval(function() {
  	// 	self.loading = !self.loading;
  	// }, 500);

		self.init = function() {

			trello.init().then(
				function(success) {
					self.loading = false;
					console.log("MainCtrl initialized");
					console.log("success", success)
					console.log(trello.getBoard());

					// trello.getMember().then(
					// 	function(success) {
					// 		console.log("member", success);
					// 	}
					// )
				}, function(error) {
					console.log("MainCtrl initialize fail");
				}
			);
		};

    this.toggleRight = buildToggler('right');
    this.isOpenRight = function(){
      return $mdSidenav('right').isOpen();
    };
    /**
     * Supplies a function that will continue to operate until the
     * time is up.
     */
    function debounce(func, wait, context) {
      var timer;
      return function debounced() {
        var context = $scope,
            args = Array.prototype.slice.call(arguments);
        $timeout.cancel(timer);
        timer = $timeout(function() {
          timer = undefined;
          func.apply(context, args);
        }, wait || 10);
      };
    }
    /**
     * Build handler to open/close a SideNav; when animation finishes
     * report completion in console
     */
    function buildDelayedToggler(navID) {
      return debounce(function() {
        // Component lookup should always be available since we are not using `ng-if`
        $mdSidenav(navID)
          .toggle()
          .then(function () {
            $log.debug("toggle " + navID + " is done");
          });
      }, 200);
    }
    function buildToggler(navID) {
      return function() {
        // Component lookup should always be available since we are not using `ng-if`
        $mdSidenav(navID)
          .toggle()
          .then(function () {
            $log.debug("toggle " + navID + " is done");
          });
      }
    }



});

TT.controller('RightCtrl', 
  function($q, TrelloConnectService, $interval, $mdSidenav, $log) {

    var trello = new TrelloConnectService();
    var self = this;
    self.member;
    self.selectedUser;

    self.init = function() {
      console.log("hi init");

      trello.getMember().then(
        function(success) {
          self.member = success;
          console.log("RightCtrl", self.member);
        }
      );
    }

    self.close = function () {
      $log.debug("close close done");
      // Component lookup should always be available since we are not using `ng-if`
      $mdSidenav('right').close()
        .then(function () {
          $log.debug("close RIGHT is done");
        });
    };
  });
