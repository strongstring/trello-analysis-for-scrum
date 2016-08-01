angular.module('MyApp', []).controller('AppCtrl', function($q, $timeout, $scope) {

	$scope.boards = [ 
		{id : "I02GmIoD", name : "COMMON", spend : 0, estimate: 0, date_spend: {}, cards : [], hash : []},
	  {id : "3UZJ3kPG", name : "iPOLiS mobile", spend : 0, estimate: 0, date_spend: {}, cards : [], hash: []},
	  {id : "g0DBnhdi", name : "SSM mobile", spend : 0, estimate: 0, date_spend: {}, cards : [], hash: []},
	  {id : "nisQ181R", name : "SmartCam mobile", spend : 0, estimate: 0, date_spend: {}, cards : [], hash: []},
	  {id : "duBw0VfK", name : "WiseNet mobile", spend : 0, estimate: 0, date_spend: {}, cards : [], hash: []},
	  {id : "u6SqfXJ9", name : "Argus", spend : 0, estimate: 0, date_spend: {}, cards : [], hash: []},
	];
	$scope.members = [];
	$scope.part = {};
	$scope.selected_member;
	$scope.selected_model = $scope.members[0];

	var auth = function() {
		var deferred = $q.defer();

	  var onAuthorize = function() { console.log("Successful authentication"); deferred.resolve();};
	  var authenticationFailure = function() { console.log("Failed authentication"); deferred.reject();};

	  Trello.authorize({
	      type: "redirect",
	      success:  function() { 
	      	console.log("Successful authentication"); 
	      	deferred.resolve();
	      }, error : function(error) {
	      	console.log("Failed authentication");
	      	deferred.reject();
	      }
	  });

		return deferred.promise;
	};

	var initMember = function() {
		var deferred = $q.defer();
		var promises = [];
		var length = $scope.boards.length;

		var init_flag = false;
		for(var i = 0; i < length; i++) {
			promises.push(
				Trello.get('/boards/' + $scope.boards[i].id + '/members/',
					function(result) {
						if(!init_flag) {
							init_flag = true;
							$scope.members = result;
						} else {
							var memberLength = result.length;

							for(var j = 0; j < memberLength; j++) {
								if( getIndexInArr($scope.members, 'username', result[j].username) === -1 ) {
									$scope.members.push(result[j]);
								}
							}
						}
					}, function(error) {
						console.log(error);
					}
			));
		}

		$q.all(promises).then(
			function(success) {
				var length = $scope.members.length;

				for(var i = 0; i < length; i++) {
					var member = $scope.members[i];
					member.spend = 0;
					member.estimate = 0;
					member.date_spend = {};
					member.cards = [];
					member.hash = [];
				}
				deferred.resolve($scope.members);
			}, function(error) {
				deferred.reject(error);
			}
		);

		return deferred.promise;
	}

	var serachSNE = function(board, cards, successFn) {
		var deferred = $q.defer();
		var length = cards.length;
		board.cards = [];

		for(var i = 0; i < length; i++) {
			var card = cards[i];
			var hash_index = -1;

			if(card.actions.length > 0) {
				card.name = card.actions[0].data.card.name;
				if(card.name.indexOf('#') !== -1) {
					var name_info = card.name.split(' ');
					var name_length = name_info.length;
					var hash = "";
					for(var j = 0; j < name_length; j++) {
						if(name_info[j].indexOf('#') !== -1) hash = name_info[j];
					}

					console.log("hash task", hash);
					hash_index = getIndexInArr(board.hash, "name", hash);

					if(hash_index === -1) {
						board.hash.push({
							name : hash,
							cards : [],
							spend : 0,
							estimate : 0,
							date_spend : {},
						});

						hash_index = board.hash.length -1;
					}
				}
			}


			var action_length = card.actions.length;
			for(var j = 0; j < action_length; j++) {
				var action = card.actions[j];

				if(action.type !== 'updateCard' && action.data.text !== null && 
					action.data.text.indexOf('plus!') !== -1 && action.data.text.indexOf('^resetsync') === -1) {

					var comment_text = action.data.text.substring(6);
					var comment_info = comment_text.split(' ');
					var duplicated_flag = false;
					var member = [];
					var date = new Date(action.date);
					var comment_info_length = comment_info.length;

					for(var k = 0; k < comment_info_length; k++) {
						var info = comment_info[k];
						// Make Member Information
						if(info.indexOf('@') !== -1) {
							duplicated_flag = false;
							if(info.substring(1) === "me") {
								member.push(action.memberCreator.username);	
							} else {
								member.push(info.substring(1));
							}

						// Make Date Information
						} else if(info.indexOf('d') !== -1) {
							date.setDate(date.getDate() + parseInt(info.substring(0, 2)));

						// Make Spend time & Estimate time Information
						} else if((info.indexOf('/') !== -1 || parseFloat(info) !== NaN) && info !== '') {
							var time_arr = info.indexOf('/') !== -1 ? info.split('/') : [info, 0];
							var spend_time = parseFloat(time_arr[0]);
							var estimate_time = parseFloat(time_arr[1]);

							// if dont have @username, that S
							if(member.length === 0) member.push(action.memberCreator.username);
							// for double S&E in one comment line
							if(!duplicated_flag) {
								if(card.spend === undefined) card.spend = 0;
								if(card.estimate === undefined) card.estimate = 0;
								if(card.date_spend === undefined) card.date_spend = {};
								if(card.members === undefined) card.members = {};

								var action_member_length = member.length;
								for(var m = 0; m < action_member_length; m++) {
									// add member in card
									if(card.members[member[m]] === undefined) card.members[member[m]] = {};

									var selected_member = card.members[member[m]];
									var member_index = getIndexInArr($scope.members, 'username', member[m]);
									if(selected_member.fullName === undefined && member_index !== -1) 
	                  selected_member.fullName = $scope.members[member_index].fullName;
	                if(selected_member.date_spend === undefined) selected_member.date_spend = [];
	                if(selected_member.spend === undefined)  selected_member.spend = 0;
	                if(selected_member.estimate === undefined) selected_member.estimate = 0;

	                // add info in $scope.member
	                if(member_index !== -1) {
	                	var root_member = $scope.members[member_index];
	                	if(root_member.date_spend === undefined) root_member.date_spend = {};
	                	if(root_member.spend === undefined) root_member.spend = 0;
	                	if(root_member.estimate === undefined) root_member.estimate = 0;

	                	var board_hash = undefined;
	                	if(hash_index !== -1) {
	                  	board_hash = board.hash[hash_index];

		                 	if(board_hash.members === undefined)
		                 		board_hash.members = {};
		                  if(board_hash.members[member[m]] === undefined)
		                  	board_hash.members[member[m]] = {};	
		                  if(board_hash.members[member[m]].spend === undefined)
		                  	board_hash.members[member[m]].spend = 0;
		                  if(board_hash.members[member[m]].estimate === undefined)
		                  	board_hash.members[member[m]].estimate = 0;
	                  }

	                	if(parseFloat(time_arr[0]) !== NaN) {
	                		// add spend in member in card
		                  if(selected_member.date_spend[date.getDate()]  === undefined) 
		                    selected_member.date_spend[date.getDate()] = 0;
		                  if(card.date_spend[date.getDate()] === undefined) 
		                    card.date_spend[date.getDate()] = 0;
		                  if(root_member.date_spend[date.getDate()] === undefined) 
		                    root_member.date_spend[date.getDate()] = 0;
		                  
		                  selected_member.date_spend[date.getDate()] += spend_time;
		                  selected_member.spend += spend_time;
		                  card.date_spend[date.getDate()] += spend_time;
		                  card.spend += spend_time;
		                  root_member.date_spend[date.getDate()] += spend_time;
		                  root_member.spend += spend_time;
		                  if(hash_index !== -1) {
		                  	if(board_hash.date_spend[date.getDate()] === undefined) {
		                  		board_hash.date_spend[date.getDate()] = 0;
		                  	}
			                  board_hash.date_spend[date.getDate()] += spend_time;
			                  board_hash.spend += spend_time;
			                  board_hash.members[member[m]].spend += spend_time;
			                }

		                  if(parseFloat(time_arr[1]) !== NaN) {
		                  	card.estimate += estimate_time;
		                  	selected_member.estimate += estimate_time;
		                  	root_member.estimate += estimate_time;
		                  	if(hash_index !== -1) {
		                  		board_hash.estimate += estimate_time;
		                  		board_hash.members[member[m]].estimate += estimate_time;
		                  	}
		                  }
	                	} 
	                }
								} // for (m) : member count
								duplicated_flag = true;
							}
						}
	        } // for (k)
	      } // if (check 'plus!' about S & E comment)
	    } // for (j)
	    board.cards.push(card);
	    if(hash_index !== -1) board.hash[hash_index].cards.push(card);
		} // for (i)

		$timeout(function() {
			deferred.resolve();
		});
		
		return deferred.promise;
	};

	var calcSNE = function(board) {
		var part = $scope.part;
		var deferred = $q.defer();

	  // to team
	  if(part.spend === undefined) part.spend = 0;
	  if(part.estimate=== undefined) part.estimate = 0;
	  if(part.date_spend === undefined) part.date_spend = {};

	  // to project
	  if(board.spend === undefined) board.spend = 0;
	  if(board.estimate === undefined) board.estimate = 0;
	  if(board.date_spend === undefined) board.date_spend = {};

	  var cardsLEngth = board.cards.length;
	  for (var i = 0; i < cardsLEngth; i++) {
	    var _card = board.cards[i];

	    if(_card.spend !== undefined) {
	      part.spend += _card.spend;
	      board.spend += _card.spend;
	    }

	    if(_card.estimate !== undefined) {
	      part.estimate += _card.estimate;
	      board.estimate += _card.estimate;
	    }
	    
	    if(_card.date_spend !== undefined) {
	      for(_dateKey in _card.date_spend) {
	        if(part.date_spend[_dateKey] === undefined) part.date_spend[_dateKey] = 0;
	        if(board.date_spend[_dateKey] === undefined) board.date_spend[_dateKey] = 0;

	        part.date_spend[_dateKey] += _card.date_spend[_dateKey];
	        board.date_spend[_dateKey] += _card.date_spend[_dateKey];
	      }
	    }
	  }

	  // calc hash task
	  var length = $scope.boards.length;
	  for(var i = 0; i < length; i++) {
	  	if($scope.boards[i].hash !== undefined) {
	  		var task = $scope.boards[i].hash;
	  		var task_length = task.length;
	  		var member_task_index;

	  		for(var j = 0; j < task_length; j++) {
	  			for(member_name in task[j].members) {
		  			var member_index = getIndexInArr($scope.members, 'username', member_name);
		  			var member_task = $scope.members[member_index].hash;
		  			var memberInfo = task[j].members[member_name];

		  			if(member_task.length > 0) {
		  				member_task_index = getIndexInArr(member_task, 'name', task[j].name);
		  			} else {
		  				member_task_index = -1;
		  			}

	  				if(member_task_index === -1) {
	  					member_task.push({
	  						name : task[j].name,
		  					estimate : 0,
		  					spend : 0,
		  					cards : [],
	  					});
	  					member_task_index = member_task.length - 1;
	  				}

	  				
	  				var card_length = task[j].cards.length;
	  				for(var k = 0; k < card_length; k++) {
	  					var _cardName = task[j].cards[k].name
			        var hashIndex = _cardName.indexOf('#');
		          if(hashIndex === 0) {
		            _hashLength = _cardName.split(' ')[0].length;
		            _cardName = _cardName.substr(_hashLength+1, _cardName.length);
		          } else {
		            _cardName = _cardName.substr(0, hashIndex);
		          }

			        var card_index = getIndexInArr(member_task[member_task_index].cards, 'name', _cardName);
			        if(card_index === -1) {
			        	member_task[member_task_index].cards.push({
			        		name : _cardName,
			        		spend : 0,
			        		estimate : 0,
			        		date_spend : {}
			        	});
			        	card_index = member_task[member_task_index].cards.length -1;
			        }
			        if(task[j].cards[k].estimate !== undefined) {
			  				member_task[member_task_index].cards[card_index].estimate += task[j].cards[k].members[member_name].estimate;
			  			}

			  			if(task[j].cards[k].spend !== undefined) {
			  				member_task[member_task_index].cards[card_index].spend += task[j].cards[k].members[member_name].spend;
			  				member_task[member_task_index].cards[card_index].date_spend = task[j].cards[k].members[member_name].date_spend;
			  			}
	  				}
	  				if(memberInfo.estimate !== undefined) {
		  				member_task[member_task_index].estimate += memberInfo.estimate;
		  			}
	  				if(memberInfo.spend !== undefined) {
	  					member_task[member_task_index].spend += memberInfo.spend;
	  				}
		  		}
	  		}
	  	}
	  }

	  $timeout(function() {
	  	deferred.resolve();
	  })

	  return deferred.promise;
	};

	var calcLabel = function() {
		var deferred = $q.defer();
		var part = $scope.part;

		if(part.labels === undefined) {
			part.labels = [];
			part.labels.total_label_value = 0;
		}

		var member_length = $scope.members.length;
		for(var i = 0; i < member_length; i++) {
			if($scope.members[i].labels === undefined) {
				$scope.members[i].labels = [];
				$scope.members[i].labels.total_label_value = 0;
			}
		}

		var board_length = $scope.boards.length;
		for(var i = 0; i < board_length; i++) {
			var board = $scope.boards[i];

			var cards_length = board.cards.length;
			for(var j = 0; j < cards_length; j++) {
				var card = board.cards[j];

				if(card.labels[0] !== undefined && card.estimate !== undefined && card.estimate !== 0) {
					var label = card.labels[0];
					var part_label_index = getIndexInArr($scope.part.labels, 'label', label.name);

					if(part_label_index === -1) {
						part.labels.push({
							label : label.name,
							color : labelColor[label.color],
							value : 0,
							cards : [],
						});

						part_label_index = part.labels.length -1;
					}

					part.labels[part_label_index].cards.push(card);
					part.labels[part_label_index].value += card.estimate;
					part.labels.total_label_value += card.estimate;

					// var card_member_length = card.members.length;

					for(member in card.members) {
						var member_index = getIndexInArr($scope.members, 'username', member);
						var member_label_index = getIndexInArr($scope.members[member_index].labels, 'label', label.name);

						if(member_label_index === -1) {
							$scope.members[member_index].labels.push({
								label : label.name,
								color : labelColor[label.color],
								value : 0,
								cards : [],
							});

							member_label_index = $scope.members[member_index].labels.length -1;
						}

						$scope.members[member_index].labels[member_label_index].cards.push(card);
						$scope.members[member_index].labels[member_label_index].value += card.estimate;
						$scope.members[member_index].labels.total_label_value += card.estimate;
					}
				}
			}
		}

		$timeout(function() {
			deferred.resolve();
		});

		return deferred.promise;
	};


	var getAction = function(board) {
		var deferred = $q.defer();

		Trello.get('/boards/' + board.id 
	    + '/cards/?field=&actions=commentCard,updateCard:name&actions_limit=1000&action_memberCreator_fields=fullName,initials,username,url,idPremOrgsAdmin&checklists=none&cards=visible',
	    function(res) {
	    	serachSNE(board, res).then(
	    		function(success) {
	    			calcSNE(board).then(
	    				function(success) {
	    					// deferred.resolve();
	    					$timeout(function() {
			    				deferred.resolve();
			    			}, 3000);
	    				}
	    			);
	    		}, function(error) {
	    			deferred.reject(error);
	    		});
		  }, function(error) {
		    console.log(error);
		    deferred.reject(error);
	  });

		return deferred.promises;
	}

	var showPartLabel = function() {

	  var total_value = $scope.part.labels.total_label_value;
	  var length = $scope.part.labels.length;

	  // calculate percentage
	  for(var i = 0; i < length; i++) {
	    var lable_value = objectCopy($scope.part.labels[i].value);
	    $scope.part.labels[i].value =  ((lable_value / total_value)*100).toFixed(2);
	  } // (for) calculate percentage

	  Morris.Donut({
	    element: 'partDounut',
	    data : $scope.part.labels,
	    backgroundColor: '#ffffff',
	    labelColor: '#4d4d4d',
	    formatter: function (x) { return x + "%"}
	  });

	  // $('#flot-part-pie-chart').click(function(){
	  //   showParCardTable($('#flot-part-pie-chart tspan:eq(0)').html());
	  // });
	}

	$scope.changeMember = function(event) {
		console.log($scope.selected_member);

		angular.element('#memberDounut').empty();
		var member_index = getIndexInArr($scope.members, "username", $scope.selected_member);
		var drawData = $scope.members[member_index].labels;
		var total_value = drawData.total_label_value;
	  var length = drawData.length;
	  $scope.selected_model = $scope.members[member_index];
	  console.log($scope.selected_model);

	  // calculate percentage
	  for(var i = 0; i < length; i++) {
	    var lable_value = objectCopy(drawData[i].value);
	    drawData[i].value =  ((lable_value / total_value)*100).toFixed(2);
	  } // (for) calculate percentage
	  console.log(drawData);

	  Morris.Donut({
	    element: 'memberDounut',
	    data : drawData,
	    backgroundColor: '#ffffff',
	    labelColor: '#4d4d4d',
	    formatter: function (x) { return x + "%"}
	  });
	}

	$scope.stylePercentage = function(card) {
		var value = (card.spend / card.estimate * 100).toFixed(1);
	
		if(value > 99) {
			return {"color" : 'rgb(97, 189, 79)'};
		} else if(value > 1) {
			return {"color" : 'rgb(255, 171, 74)'};
		} else {
			return {"color" : 'black'};
		}
	}

	$scope.makeTaskLable = function(card) {
		var task_lable = card.name + " " + "[" + card.spend + " / " + card.estimate + "]  ";

		var min_date = 99;
		var max_date = 0;
		for(date in card.date_spend) {
			if(date > max_date) {
				max_date = date;
			}
			if(date < min_date) {
				min_date = date;
			}
		}
		if(card.spend === card.estimate) {
			task_lable += "date : " + min_date + " ~ " + max_date;
		} else {
			if(card.spend > 0) task_lable += "date : " + min_date + " ~ ";
		}

		return task_lable;
	};

	var init = function() {
		$('#indicator').css('display', 'block');
		auth().then(
			function(success) {
				initMember().then(
					function(memberInfo) {
						console.log("member information", memberInfo);
						var boardLength = $scope.boards.length;
						var promises = [];

						for(var i = 0; i < boardLength; i++) {
							promises[i] = getAction($scope.boards[i]);
						}

						$scope.selected_member = $scope.members[0].fullName;

						$timeout(function() {
						// $q.all(promises).then(
							// function(success) {
								calcLabel().then(
									function(success) {
										console.log("label is done", $scope.part);
									}
								);
								console.log("getAction success");
								console.log("$scope.part", $scope.part);
								console.log("$scope.members", $scope.members);
								console.log("$scope.boards", $scope.boards);
								showPartLabel();
							// });
							$('#indicator').css('display', 'none');
						}, 2000);
					}, function(error) {
						console.log("init error : ", error);
					}
				);
			}
		);

	}

	$timeout(function() {
		init();
	});
});