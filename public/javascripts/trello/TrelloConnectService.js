TT.factory('TrelloConnectService',
  ['$q',
  function($q) {

    // @@@@@@@@@@@@@@ UTIL METHOD @@@@@@@@@@@@@ //
    var getObjInArr = function(arr, key, value) {
      return arr.filter(function(obj) { return obj[key] === value; });
    };

    var getIndexInArr = function(arr, key, value) {
      return arr.findIndex(function(obj) { return obj[key] === value; });
    };

    var getObjInRows = function(resultSet) {
      var length = resultSet.rows.length;
      var result = [];

      for(var i = 0; i < length; i++) {
        result[i] = resultSet.rows.item(i);
      }

      return result;
    }

    var ct = function() {

      var self = this;
      this.BOARDS = [ 
        {id : "I02GmIoD", name : "COMMON", spend : 0, estimate: 0, date_spend: {}, cards : [], hash : []},
        {id : "3UZJ3kPG", name : "iPOLiS mobile", spend : 0, estimate: 0, date_spend: {}, cards : [], hash: []},
        {id : "g0DBnhdi", name : "SSM mobile", spend : 0, estimate: 0, date_spend: {}, cards : [], hash: []},
        {id : "nisQ181R", name : "SmartCam mobile", spend : 0, estimate: 0, date_spend: {}, cards : [], hash: []},
        {id : "duBw0VfK", name : "WiseNet mobile", spend : 0, estimate: 0, date_spend: {}, cards : [], hash: []},
        {id : "u6SqfXJ9", name : "Argus", spend : 0, estimate: 0, date_spend: {}, cards : [], hash: []},
      ];
      this.MEMBERS = [];
      this.PART = {};

      this.auth = function() {
        var deferred = $q.defer();

        var onAuthorize = function() { console.log("Successful authentication"); deferred.resolve();};
        var authenticationFailure = function() { 
          console.log("Failed authentication"); 
          deferred.reject();
        };

        Trello.authorize({
          type: "redirect",
          success:  function() { 
            deferred.resolve("Successful authentication");
          }, error : function(error) {
            deferred.reject("Failed authentication");
          }
        });

        return deferred.promise;
      };

      this.getMember = function() {
        var deferred = $q.defer();
        var promises = [];
        var length = self.BOARDS.length;

        var init_flag = false;
        for(var i = 0; i < length; i++) {
          promises.push(
            Trello.get('/boards/' + self.BOARDS[i].id + '/members/',
              function(result) {
                if(!init_flag) {
                  init_flag = true;
                  self.MEMBERS = result;
                } else {
                  var memberLength = result.length;

                  for(var j = 0; j < memberLength; j++) {
                    if( getIndexInArr(self.MEMBERS, 'username', result[j].username) === -1 ) {
                      self.MEMBERS.push(result[j]);
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
            var length = self.MEMBERS.length;

            for(var i = 0; i < length; i++) {
              var member = self.MEMBERS[i];
              member.spend = 0;
              member.estimate = 0;
              member.date_spend = {};
              member.cards = [];
              member.hash = [];
            }
            deferred.resolve(self.MEMBERS);
          }, function(error) {
            deferred.reject(error);
          }
        );

        return deferred.promise;
      };

      var searchSNE = function(board, cards, successFn) {
        var deferred = $q.defer();
        board.cards = [];

        var cardsLength = cards.length;
        for(var i = 0; i < cardsLength; i++) {
          var card = cards[i];

          // make card's name
          if(card.name === undefined) { 
            card.name = card.actions[0].data.card.name;

            var hashChecker = card.name.indexOf('#');
            if(hashChecker !== -1) {
              if(hashChecker === 0) {
                var _hashLength = card.name.split(' ')[0].length;
                card.name = card.name.substr(_hashLength+1, card.name.length);
              } else {
                card.name = card.name.substr(0, hashChecker);
              }
            }
          }

          // action check
          var actionsLength = card.actions.length;
          for(var j = 0; j < actionsLength; j++) {
            var action = card.actions[j];

            if(action.type !== 'updateCard' && action.data.text !== null && 
              action.data.text.indexOf('plus!') !== -1 && action.data.text.indexOf('^resetsync') === -1) {

              var commentText = action.data.text.substring(6);
              var commentArr = commentText.split(' ');
              var duplicated_flag = false;
              var member = [];
              var date = new Date(action.date);

              var commentArrLength = commentArr.length;
              for(var k = 0; k < commentArrLength; k++) {
                var info = commentArr[k];
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
                    if(card.spend === undefined) {
                      card.spend = 0;
                      card.estimate = 0;
                      card.date_spend = {};
                      card.members = [];
                    }

                    var commentMemberLength = member.length;
                    for(var m = 0; m < commentMemberLength; m++) {
                      // add member in card

                      var member_index = getIndexInArr(self.MEMBERS, 'username', member[m]);
                      if(member_index === -1) { break; }

                      var card_member_index = getIndexInArr(card.members, 'username', member[m]);
                      if(card_member_index === -1) {
                        card.members.push({
                          username : self.MEMBERS[member_index].username,
                          fullName : self.MEMBERS[member_index].fullName,
                          date_spend : {},
                          spend : 0,
                          estimate : 0,
                        });
                        card_member_index = card.members.length -1;
                      }

                      // add info in $scope.member
                      var selfMember = self.MEMBERS[member_index];
                      if(selfMember.date_spend === undefined) {
                        selfMember.date_spend = {};
                        selfMember.spend = 0;
                        selfMember.estimate = 0;
                      }

                      if(spend_time !== NaN && estimate_time !== NaN) {
                        var cardMember = card.members[card_member_index];

                        if(spend_time !== 0) {
                          var comment_date = date.getDate();

                          if(cardMember.date_spend[comment_date]  === undefined) {
                            cardMember.date_spend[comment_date] = spend_time;
                          } else {
                            cardMember.date_spend[comment_date] += spend_time;
                          }
                          if(card.date_spend[comment_date] === undefined) {
                            card.date_spend[comment_date] = spend_time;
                          } else {
                            card.date_spend[comment_date] += spend_time;
                          }
                            
                          if(selfMember.date_spend[comment_date] === undefined) {
                            selfMember.date_spend[comment_date] = spend_time;
                          } else { 
                            selfMember.date_spend[comment_date] += spend_time;
                          }
                          
                          cardMember.spend += spend_time;
                          card.spend += spend_time;
                          selfMember.spend += spend_time;
                        }

                        // if(estimate_time !== NaN) {
                        if(estimate_time !== 0) {
                          card.estimate += estimate_time;
                          cardMember.estimate += estimate_time;
                          selfMember.estimate += estimate_time;
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
        } // for (i)

        successFn();
      };

      

      var calcSNE = function(board) {
        var part = self.PART;
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
        if(board.hash !== undefined) {
          var task = board.hash;
          var task_length =task.length;

          for(var j = 0 ; j < task_length; j++) {
            var card_length = task[j].cards.length;

            for(k = 0; k < card_length; k++) {
              var card = task[j].cards[k];

              for(member_name in card.members) {
                var member_index = getIndexInArr(self.MEMBERS, 'username', member_name);
                if(member_index === -1) break;
                var member_task = self.MEMBERS[member_index].hash;
                var member_info = card.members[member_index];
                var member_task_index = -1;

                if(member_task.length > 0) {
                  member_task_index = getIndexInArr(member_task, 'name', task[j].name);
                } else {
                  member_task_index = -1;
                }

                if(member_task_index === -1) {
                  member_task.push({
                    board_name : task[j].board_name,
                    name : task[j].name,
                    estimate : 0,
                    spend : 0,
                    cards : [],
                    date_spend : {}
                  });

                  member_task_index = member_task.length - 1;
                }

                if(member_info.spend !== undefined) {
                  member_task[member_task_index].spend += member_info.spend;
                  task[j].spend += member_info.spend;
                } 

                if(member_info.estimate !== undefined) {
                  member_task[member_task_index].estimate += member_info.estimate;
                  task[j].estimate += member_info.estimate;
                }

                member_task[member_task_index].date_spend = member_info.date_spend;

                var card_name = card.name;
                var hashIndex = card_name.indexOf('#');
                if(hashIndex === 0) {
                  var _hashLength = card_name.split(' ')[0].length;
                  card_name = card_name.substr(_hashLength+1, card_name.length);
                } else {
                  card_name = card_name.substr(0, hashIndex);
                }

                var card_desc = card.desc
                card_desc = card_desc.split('---')[0];

                member_task[member_task_index].cards.push({
                  name : card_name,
                  spend : member_info.spend,
                  estimate : member_info.estimate,
                  date_spend : member_info.date_spend,
                  desc : card_desc,
                  url : card.url,
                });
              }
            }
          }
        }

        setTimeout(function() {
          deferred.resolve();
        });
        
        return deferred.promise;
      };

      this.calcLabel = function() {
        var deferred = $q.defer();
        var part = self.PART;

        if(part.labels === undefined) {
          part.labels = [];
          part.labels.total_label_value = 0;
        }

        var member_length = self.MEMBERS.length;
        for(var i = 0; i < member_length; i++) {
          if(self.MEMBERS[i].labels === undefined) {
            self.MEMBERS[i].labels = [];
            self.MEMBERS[i].labels.total_label_value = 0;
          }
        }

        var board_length = self.BOARDS.length;
        for(var i = 0; i < board_length; i++) {
          var board = self.BOARDS[i];

          var cards_length = board.cards.length;
          for(var j = 0; j < cards_length; j++) {
            var card = board.cards[j];

            if(card.labels[0] !== undefined && card.estimate !== undefined && card.estimate !== 0) {
              var label = card.labels[0];
              var part_label_index = getIndexInArr(self.PART.labels, 'label', label.name);

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

              for(member_name in card.members) {
                var member_index = getIndexInArr(self.MEMBERS, 'username', member_name);
                var member_label_index = getIndexInArr(self.MEMBERS[member_index].labels, 'label', label.name);

                if(member_label_index === -1) {
                  self.MEMBERS[member_index].labels.push({
                    label : label.name,
                    color : labelColor[label.color],
                    value : 0,
                    cards : [],
                  });

                  member_label_index = self.MEMBERS[member_index].labels.length -1;
                }

                self.MEMBERS[member_index].labels[member_label_index].cards.push(card);
                self.MEMBERS[member_index].labels[member_label_index].value += card.members[member_index].estimate;
                self.MEMBERS[member_index].labels.total_label_value += card.members[member_index].estimate;
              }
            }
          }
        }

        setTimeout(function() {
          deferred.resolve();
        });
        
        return deferred.promise;
      };

      this.getAction = function(board) {
        var deferred = $q.defer();

        Trello.get('/boards/' + board.id 
          + '/cards/?field=&actions=commentCard,updateCard:name&actions_limit=1000&action_memberCreator_fields=fullName,initials,username,url,idPremOrgsAdmin&checklists=none&cards=visible',
          function(res) {
            searchSNE(board, res,
              function(success) {
                calcSNE(board).then(
                  function(success) {
                    deferred.resolve();
                  }
                );
              });
              // }, function(error) {
              //   deferred.reject(error);
              // });
          }, function(error) {
            console.log(error);
            deferred.reject(error);
        });

        return deferred.promises;
      };

      this.init = function() {
        var deferred = $q.defer();
        var promises = [];
        var action_promises = [];

        promises[0] = self.auth();
        // promises[1] = self.BOARDS;

        $q.all(promises[0]).then(
          function(results) {
            var auth_result = angular.copy(results[0]);
            var board = angular.copy(self.BOARDS);

            console.log("auth_result", auth_result);
            // console.log("board", board);

            self.getMember().then(
              function(member) {
                console.log("member", member);

                var length = self.BOARDS.length;
                for(var i = 0; i < length; i++) {
                  action_promises[i] = self.getAction(self.BOARDS[i]);
                }

                $q.all(action_promises).then(
                  function(success) {
                    console.log("action_promises success");
                    self.calcLabel().then(
                      function(success) {
                        // console.log("BOARDS success", BOARDS)
                        deferred.resolve();
                      }, function(error) {
                        deferred.reject(error);
                      }
                    )
                    deferred.resolve();
                  }, function(error) {
                    console.log("action_promises error ", error);
                  }
                );
              }, function(error) {
                deferred.reject(error);
              }
            );
          }, function(error) {
            deferred.reject(error);
          }
        );

        return deferred.promise;
      };

    };
    return ct;
}]);